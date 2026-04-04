import fs from 'fs';
import path from 'path';

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function copyDir(src: string, dest: string): void {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

/* Returns the filename (with extension) of the first file
 * whose stem matches prefix. 
 */
export function findAsset(assetsDir: string, prefix: string): string | undefined {
  if (!fs.existsSync(assetsDir)) return undefined;
  return fs.readdirSync(assetsDir).find(f => {
    const dot = f.indexOf('.');
    return dot !== -1 && f.slice(0, dot) === prefix;
  });
}
