import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getSession from "utils/getSession";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import { Page, PageDb } from "utils/types/Page";
import Header from "components/Header";
import { ObjectId } from "mongodb";
import serialisePage from "utils/mappers/serialisePage";
import WikiParser from "components/WikiParser";
import ArticleNavigation from "components/ArticleNavigation";
import capitalise from "utils/capitalise";
import formatDateTime from "utils/formatDateTime";
import { NextSeo } from "next-seo";
import findGuildById from "utils/findGuildById";
import { GuildData } from "utils/types/Guild";

type VersionPageProps = {
  pageTitle: string;
  guildData: GuildData;
  page: Page;
};

const VersionPage: NextPage<VersionPageProps> = ({
  pageTitle,
  page,
  guildData,
}) => {
  const { guild, alias } = guildData;
  return (
    <>
      <NextSeo title={`${capitalise(pageTitle)} - ${guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <ArticleNavigation
          guildData={guildData}
          pageTitle={pageTitle}
          edit={false}
        />
        <p>
          You are viewing a historical version of{" "}
          <Link href={`/${alias || guild.id}/wiki/${page?.title}`}>
            {capitalise(pageTitle)}
          </Link>{" "}
          from {page.date && formatDateTime(page.date)}, edited by{" "}
          {page.author || "someone"}.
        </p>
        {page?.date && <p>Last edited on {page.date}</p>}
        {page?.content && (
          <article id="article">
            <WikiParser wikiSubpath={`${alias || guild.id}/wiki`}>
              {page.content}
            </WikiParser>
          </article>
        )}
      </main>
    </>
  );
};

export default VersionPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
  versionId: query["version-id"] as string,
});

export const getServerSideProps: GetServerSideProps<VersionPageProps> = async ({
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

  const db = await dbConnection();
  const guildData = await findGuildById(db, session, guildId);
  if (!guildData) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const pages = (await dbConnection()).collection<PageDb>("pages");
  const [page] = await pages
    .find({
      _id: new ObjectId(versionId),
      guild_id: guildData.guild.id,
    })
    .map(serialisePage)
    .toArray();

  if (!page) {
    return {
      redirect: {
        destination: `/${guildId}/wiki/${pageTitle}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      pageTitle,
      page,
      guildData,
    },
  };
};
