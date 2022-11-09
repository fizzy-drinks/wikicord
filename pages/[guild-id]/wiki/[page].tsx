import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import dbConnection from "utils/dbConnection";
import Page from "utils/types/Page";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";
import Header from "components/Header";
import remarkGfm from "remark-gfm";

type WikiPageProps = {
  pageTitle: string;
  guild: Guild;
  page: Page | null;
  edit: boolean;
};

const WikiPage: NextPage<WikiPageProps> = ({
  pageTitle,
  page,
  guild,
  edit,
}) => {
  const router = useRouter();
  const [pageContent, setPageContent] = useState<string>(page?.content || "");
  useEffect(() => {
    setPageContent(page?.content || "");
  }, [page]);

  const [loading, setLoading] = useState(false);
  const updatePage = async () => {
    setLoading(true);
    await axios.put(`/api/${guild.id}/page/${pageTitle}`, {
      content: pageContent,
    });
    router.push({
      pathname: `/${guild.id}/wiki/${pageTitle}`,
      query: { edit: "false" },
    });
    setLoading(false);
  };

  return (
    <>
      <Header guild={guild} />
      <main>
        <nav>
          {edit ? (
            <Link href={`/${guild.id}/wiki/${pageTitle}`}>Article</Link>
          ) : (
            <Link
              href={{
                pathname: `/${guild.id}/wiki/${pageTitle}`,
                query: { edit: "true" },
              }}
            >
              Source
            </Link>
          )}
        </nav>
        <h1>
          {edit && "Editing "}
          {pageTitle}
        </h1>
        {edit && (
          <div>
            <textarea
              style={{
                width: "100%",
                minHeight: 400,
                fontFamily: "sans-serif",
                borderRadius: 2,
              }}
              value={pageContent}
              onChange={(e) => setPageContent(e.target.value)}
            />
            <button disabled={loading} type="button" onClick={updatePage}>
              Save
            </button>
          </div>
        )}
        <article id="article">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeToc]}
          >
            {pageContent.replace(/\[\[(.+)\]\]/g, "[$1]($1)")}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
};

export default WikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
  edit: query.edit === "true",
});

export const getServerSideProps: GetServerSideProps<WikiPageProps> = async ({
  query,
  req,
  res,
}) => {
  const { guildId, pageTitle, edit } = parseQuery(query);

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

  const pages = (await dbConnection()).collection<Page>("pages");
  const pageDoc = await pages.findOne({
    guild_id: guildId,
    title: pageTitle.toLowerCase(),
  });

  const page = pageDoc
    ? {
        ...pageDoc,
        _id: pageDoc._id.toString(),
      }
    : null;

  return {
    props: {
      pageTitle,
      page,
      guild,
      edit,
    },
  };
};
