import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@shikijs/rehype';
import { mdxComponents } from './mdx-components';

const jsxRuntime = runtime as unknown as Pick<EvaluateOptions, 'Fragment' | 'jsx' | 'jsxs'>;

/** Server component: compiles MDX at build time (pages are statically generated). */
export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...jsxRuntime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false }]],
  });
  return <Content components={mdxComponents} />;
}
