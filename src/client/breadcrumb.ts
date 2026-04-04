import { siteTree } from '../constants/siteTree';
import type { SiteNode } from '../constants/siteTree';
import { escapeHtml } from '../shared/escapeHtml';

function normalize(p: string): string {
  return p.replace(/\/$/, '') || '/';
}

function findTrail(
  node: SiteNode,
  pathname: string,
  trail: SiteNode[]
): SiteNode[] | null {
  const current = [...trail, node];

  if (normalize(node.path) === normalize(pathname)) return current;
  if (!node.children) return null;

  for (const child of node.children) {
    if (child.dynamic) {
      // Match any path that is a descendant of the current node
      const prefix = normalize(node.path);
      const target = normalize(pathname);
      if (target.startsWith(prefix + '/')) {
        const postTitle = document.body.dataset.postTitle ?? '';
        return [...current, { ...child, label: postTitle, path: pathname }];
      }
      continue;
    }
    const found = findTrail(child, pathname, current);
    if (found) return found;
  }

  return null;
}

function renderBreadcrumb(): void {
  const nav = document.getElementById('breadcrumb');
  if (!nav) return;

  const trail = findTrail(siteTree, window.location.pathname, []);
  if (!trail) return;

  nav.innerHTML = trail
    .map((node, i, arr) => {
      const isLast = i === arr.length - 1;
      const safeLabel = escapeHtml(node.label);
      if (isLast) return `<span>${safeLabel}</span>`;
      return `<span><a href="${node.path}">${safeLabel}</a></span>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', renderBreadcrumb);
