import { renderToHtml } from 'md4x/napi';
import { createHighlighter } from 'shiki';

import path from 'node:path';

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['js', 'json', 'jsonc', 'ts', 'html', 'css', 'c', 'zig'],
});

{
  const ROOT = path.join(import.meta.dir, '..');
  const PAGES = path.join(ROOT, 'pages');
  const PAGES_OUTPUT = path.join(ROOT, 'docs');

  const TEMPLATE = await Bun.file(path.join(PAGES, 'template.html')).text();

  const renderPage = async (p: string) => {
    const content = renderToHtml(await Bun.file(path.join(PAGES, p)).text(), {
      full: true,
      highlighter: (code, block) =>
        block.lang !== ''
          ? highlighter.codeToHtml(code, {
              lang: block.lang,
              theme: 'github-dark',
            })
          : void 0,
    });

    await Bun.write(
      path.join(PAGES_OUTPUT, path.basename(p, '.md') + '.html'),
      TEMPLATE.replace('<body></body>', `<body>${content}</body>`),
    );
  };

  for (const path of new Bun.Glob('**/*.md').scanSync(PAGES)) renderPage(path);
}
