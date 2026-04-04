import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { siteConstants } from '../constants/site';
import { parseDate, formatDate } from './date';
import { renderMarkdown } from './markdown';
import { escapeHtml } from '../shared/escapeHtml';
import type { PostFrontmatter } from './types';

export interface Post {
  title: string;
  author: string;
  date: Date;
  dateFormatted: string;
  slug: string;
  content: string;
  sourceDir: string;
}

export function readPosts(postsDir: string): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const posts: Post[] = [];

  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(postsDir, entry.name);
    const files = fs.readdirSync(dir);
    const mdFile = files.find(f => f === entry.name + '.md')
                ?? files.find(f => f.endsWith('.md'));
    if (!mdFile) continue;

    const filepath = path.join(dir, mdFile);
    const { data, content } = matter(fs.readFileSync(filepath, 'utf-8'));
    const frontmatter = data as PostFrontmatter;

    const date = parseDate(frontmatter.date ?? '');
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date "${frontmatter.date}" in ${filepath}. Expected DDMMYYYY (e.g. "22122016").`);
    }

    const slug = frontmatter.id ?? path.basename(filepath, '.md');
    posts.push({
      title: frontmatter.title ?? slug,
      author: frontmatter.author ?? siteConstants.author,
      date,
      dateFormatted: formatDate(date),
      slug,
      content: renderMarkdown(content),
      sourceDir: dir,
    });
  }

  const seen = new Map<string, string>();
  for (const post of posts) {
    const prev = seen.get(post.slug);
    if (prev) {
      throw new Error(`Duplicate slug "${post.slug}": ${prev} vs ${post.sourceDir}`);
    }
    seen.set(post.slug, post.sourceDir);
  }

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generatePostsList(posts: Post[]): string {
  if (posts.length === 0) return '<p>No posts yet.</p>';

  const byYear = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.date.getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }

  const lines: string[] = [];
  for (const [year, yearPosts] of [...byYear.entries()].sort(([a], [b]) => b - a)) {
    lines.push(`<details id="year-${year}">`);
    lines.push(`<summary>${year}</summary>`);
    lines.push('<ul>');
    for (const p of yearPosts) {
      lines.push(
        `<li><a href="/blogs/${p.slug}/">${escapeHtml(p.title)}</a> <time>${p.dateFormatted}</time></li>`
      );
    }
    lines.push('</ul>');
    lines.push('</details>');
  }

  return lines.join('\n');
}
