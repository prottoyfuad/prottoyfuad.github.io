import fs from 'fs';
import path from 'path';
import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { siteConstants } from '../constants/site';
import { fill } from './template';
import { ensureDir, copyDir, findAsset } from './fileUtils';
import { readPosts, generatePostsList } from './posts';
import { renderMarkdown } from './markdown';
import { escapeHtml } from '../shared/escapeHtml';
import type { Templates, TemplateVars } from './types';

const CONTENTS_DIR = 'contents';
const POSTS_DIR = path.join(CONTENTS_DIR, 'posts');
const TEMPLATES_DIR = 'templates';
const STYLES_DIR = 'styles';
const ASSETS_DIR = 'assets';
const OUT_DIR = 'docs';

function clean(): void {
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
  ensureDir(OUT_DIR);
}

function loadTemplates(): Templates {
  const read = (name: string) => fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf-8');
  return {
    index: read('index.html'),
    blogs: read('blogs.html'),
    about: read('about.html'),
    post: read('post.html'),
    notFound: read('404.html'),
  };
}

function resolveAssets(): { welcomePath: string; faviconPath: string; avatarPath: string } {
  const welcomeFile = findAsset(ASSETS_DIR, 'welcome');
  const faviconFile = findAsset(ASSETS_DIR, 'favicon');
  const avatarFile  = findAsset(ASSETS_DIR, 'avatar');
  return {
    welcomePath: welcomeFile ? `/assets/${welcomeFile}` : '',
    faviconPath: faviconFile ? `/assets/${faviconFile}` : '',
    avatarPath:  avatarFile  ? `/assets/${avatarFile}`  : '',
  };
}

function writeHomePage(tmpl: string, base: TemplateVars, welcomePath: string): void {
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.html'),
    fill(tmpl, { ...base, PAGE_TITLE: escapeHtml(siteConstants.title), WELCOME_IMAGE_PATH: welcomePath, POEM: escapeHtml(siteConstants.poem) })
  );
}

function writeAboutPage(tmpl: string, base: TemplateVars): void {
  const bioMarkdown = fs.readFileSync(path.join(CONTENTS_DIR, 'about.md'), 'utf-8');
  const bioHtml     = renderMarkdown(bioMarkdown);

  const socialLinksHtml = Object.entries(siteConstants.social)
    .map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`)
    .join('\n');

  ensureDir(path.join(OUT_DIR, 'about'));
  fs.writeFileSync(
    path.join(OUT_DIR, 'about', 'index.html'),
    fill(tmpl, { ...base, PAGE_TITLE: escapeHtml(`About | ${siteConstants.title}`), AUTHOR: escapeHtml(siteConstants.author), BIO: bioHtml, SOCIAL_LINKS: socialLinksHtml })
  );
}

function writeBlogsPage(tmpl: Pick<Templates, 'blogs' | 'post'>, base: TemplateVars): number {
  const posts = readPosts(POSTS_DIR);

  const blogIntroPath = path.join(CONTENTS_DIR, 'blogs.md');
  const blogIntroHtml = fs.existsSync(blogIntroPath)
    ? renderMarkdown(fs.readFileSync(blogIntroPath, 'utf-8'))
    : '';

  ensureDir(path.join(OUT_DIR, 'blogs'));
  fs.writeFileSync(
    path.join(OUT_DIR, 'blogs', 'index.html'),
    fill(tmpl.blogs, { ...base, PAGE_TITLE: escapeHtml(`Blogs | ${siteConstants.title}`), BLOG_INTRO: blogIntroHtml, POSTS_LIST: generatePostsList(posts) })
  );

  for (const post of posts) {
    const postDir = path.join(OUT_DIR, 'blogs', post.slug);
    ensureDir(postDir);
    fs.writeFileSync(
      path.join(postDir, 'index.html'),
      fill(tmpl.post, {
        ...base,
        PAGE_TITLE: escapeHtml(`${post.title} | ${siteConstants.title}`),
        POST_TITLE: escapeHtml(post.title),
        POST_AUTHOR: escapeHtml(post.author),
        POST_DATE: post.dateFormatted,
        POST_CONTENT: post.content,
      })
    );

    // Copy co-located assets (images, etc.) from the post's source folder
    for (const file of fs.readdirSync(post.sourceDir)) {
      if (!file.endsWith('.md')) {
        fs.copyFileSync(
          path.join(post.sourceDir, file),
          path.join(postDir, file)
        );
      }
    }
  }

  return posts.length;
}

function write404Page(tmpl: string, base: TemplateVars): void {
  fs.writeFileSync(
    path.join(OUT_DIR, '404.html'),
    fill(tmpl, { ...base, PAGE_TITLE: escapeHtml(`404 | ${siteConstants.title}`) })
  );
}

function copyAssets(): void {
  if (fs.existsSync(ASSETS_DIR)) copyDir(ASSETS_DIR, path.join(OUT_DIR, 'assets'));
}

function compileStyles(): void {
  const outStylesDir = path.join(OUT_DIR, 'styles');
  ensureDir(outStylesDir);

  for (const file of fs.readdirSync(STYLES_DIR)) {
    if (!file.endsWith('.scss')) continue;
    const result = sass.compile(path.join(STYLES_DIR, file));
    fs.writeFileSync(path.join(outStylesDir, file.replace(/\.scss$/, '.css')), result.css);
  }

  const hlTheme = path.join('node_modules', 'highlight.js', 'styles', 'atom-one-dark.css');
  if (fs.existsSync(hlTheme)) {
    fs.copyFileSync(hlTheme, path.join(outStylesDir, 'highlight.css'));
  }
}

function writeCNAME(): void {
  if (siteConstants.domain) {
    fs.writeFileSync(path.join(OUT_DIR, 'CNAME'), siteConstants.domain);
  }
}

async function bundleClientScripts(): Promise<void> {
  ensureDir(path.join(OUT_DIR, 'js'));
  await esbuild.build({
    entryPoints: [
      'src/client/breadcrumb.ts',
      'src/client/blog-list.ts'
    ],
    bundle: true,
    outdir: path.join(OUT_DIR, 'js'),
    target: 'es2020',
    platform: 'browser',
    minify: true,
  });
}

async function build(): Promise<void> {
  clean();

  const templates = loadTemplates();
  const { welcomePath, faviconPath, avatarPath } = resolveAssets();
  const base: TemplateVars = {
    SITE_TITLE: escapeHtml(siteConstants.title),
    FAVICON_PATH: faviconPath,
    AVATAR_PATH: avatarPath,
  };

  writeHomePage(templates.index, base, welcomePath);
  writeAboutPage(templates.about, base);
  const postCount = writeBlogsPage(templates, base);
  write404Page(templates.notFound, base);

  copyAssets();
  compileStyles();
  writeCNAME();
  await bundleClientScripts();

  console.log(`Built ${postCount} post(s) → ${OUT_DIR}/`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
