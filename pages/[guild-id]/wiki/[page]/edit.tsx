import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getSession from "utils/getSession";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import dbConnection from "utils/dbConnection";
import { Page, PageDb } from "utils/types/Page";
import Header from "components/Header";
import serialisePage from "utils/mappers/serialisePage";
import WikiParser from "components/WikiParser";
import ArticleNavigation from "components/ArticleNavigation";
import formatDateTime from "utils/formatDateTime";
import { NextSeo } from "next-seo";
import capitalise from "utils/capitalise";
import findGuildById from "utils/findGuildById";
import { GuildData } from "utils/types/Guild";

type EditWikiPageProps = {
  pageTitle: string;
  guildData: GuildData;
  page: Page | null;
};

const EditWikiPage: NextPage<EditWikiPageProps> = ({
  pageTitle,
  page,
  guildData,
}) => {
  const { guild, alias } = guildData;
  const router = useRouter();
  const [pageContent, setPageContent] = useState<string>(page?.content || "");
  useEffect(() => {
    setPageContent(page?.content || "");
  }, [page]);

  const [loading, setLoading] = useState(false);
  const updatePage = async () => {
    setLoading(true);
    await axios.put(`/api/${alias || guild.id}/page/${pageTitle}`, {
      content: pageContent,
    });
    router.push({
      pathname: `/${alias || guild.id}/wiki/${pageTitle}`,
    });
  };

  return (
    <>
      <NextSeo title={`${capitalise(pageTitle)} - ${guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <ArticleNavigation guildData={guildData} pageTitle={pageTitle} />
        {page?.date && (
          <small>Last edited on {formatDateTime(page.date)}</small>
        )}
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
        <article id="article">
          <WikiParser wikiSubpath={`${alias || guild.id}/wiki`}>
            {pageContent}
          </WikiParser>
        </article>
      </main>
    </>
  );
};

export default EditWikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
});

export const getServerSideProps: GetServerSideProps<
  EditWikiPageProps
> = async ({ query, req, res }) => {
  const { guildId, pageTitle } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/${guildId}/wiki/${pageTitle}/edit`,
        permanent: false,
      },
    };
  }

  const db = await dbConnection();
  const pages = db.collection<PageDb>("pages");

  const guildData = await findGuildById(db, session, guildId);
  if (!guildData) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const [page] = await pages
    .find({
      guild_id: guildData.guild.id,
      title: {
        $in: [
          pageTitle.toLowerCase().replace(/_/g, " "),
          pageTitle.toLowerCase().replace(/\s/g, "_"),
        ],
      },
    })
    .sort({ date: -1 })
    .limit(1)
    .map(serialisePage)
    .toArray();

  return {
    props: {
      pageTitle,
      page: page ?? null,
      guildData,
    },
  };
};
