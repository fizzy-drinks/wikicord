import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import { Page, PageDb } from "utils/types/Page";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";
import Header from "components/Header";
import remarkGfm from "remark-gfm";
import { ObjectId } from "mongodb";
import capitalise from "utils/capitalise";
import enhanceWikiLinks from "utils/enhanceWikiLinks";

type WikiPageProps = {
  pageTitle: string;
  guild: Guild;
  page: Page | null;
};

const WikiPage: NextPage<WikiPageProps> = ({ pageTitle, page, guild }) => {
  return (
    <>
      <Header guild={guild} />
      <main>
        <nav>
          <Link
            href={{
              pathname: `/${guild.id}/wiki/${pageTitle}`,
              query: { edit: "true" },
            }}
          >
            Source
          </Link>
        </nav>
        <h1>{capitalise(pageTitle)}</h1>
        <p>
          You are viewing a historical version of{" "}
          <Link href={`/${guild.id}/wiki/${page?.title}`}>{page?.title}</Link>.
        </p>
        {page?.date && <p>Last edited on {page.date}</p>}
        {page?.content && (
          <article id="article">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeToc]}
            >
              {enhanceWikiLinks(page.content)}
            </ReactMarkdown>
          </article>
        )}
      </main>
    </>
  );
};

export default WikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
  versionId: query["version-id"] as string,
});

export const getServerSideProps: GetServerSideProps<WikiPageProps> = async ({
  query,
  req,
  res,
}) => {
  const { guildId, pageTitle, versionId } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const guilds = await fetchSessionGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const pages = (await dbConnection()).collection<PageDb>("pages");
  const [pageDoc] = await pages
    .find({ _id: new ObjectId(versionId) })
    .toArray();

  const page: Page | null = pageDoc
    ? {
        ...pageDoc,
        _id: pageDoc._id.toString(),
        date: pageDoc.date?.toISOString() ?? null,
      }
    : null;

  return {
    props: {
      pageTitle,
      page,
      guild,
    },
  };
};
