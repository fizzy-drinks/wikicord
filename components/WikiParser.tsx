import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSectionize from "remark-sectionize";
import rehypeToc from "@jsdevtools/rehype-toc";
import remarkWikiLink from "remark-wiki-link";

const WikiParser: FC<{ wikiSubpath: string; children: string }> = ({
  wikiSubpath,
  children,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkSectionize,
        [
          remarkWikiLink,
          { hrefTemplate: (article: string) => `/${wikiSubpath}/${article}` },
        ],
      ]}
      rehypePlugins={[
        rehypeSlug,
        rehypeToc,
        [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
      ]}
    >
      {children}
    </ReactMarkdown>
  );
};

export default WikiParser;
