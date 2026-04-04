import { marked } from 'marked';
import type { Renderer } from 'marked';
import hljs from 'highlight.js';

/* marked's TS types declare the code renderer as receiving a Code token,
 * but this build's runtime passes (code: string, lang?: string, escaped: boolean).
 * We cast through unknown to the exact Renderer method type — no any involved.
 */
type CodeRenderer = Renderer['code'];

marked.use({
  renderer: {
    code: ((code: string, lang: string | undefined) => {
      const langClean = (lang ?? '').split(/[\s:]/)[0].toLowerCase();
      const language = langClean && hljs.getLanguage(langClean) ? langClean : 'plaintext';
      const highlighted = hljs.highlight(code, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    }) as unknown as CodeRenderer,
  },
});

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}
