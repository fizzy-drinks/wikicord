import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getSession from "utils/getSession";
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
import Link from "next/link";

type WikiPageProps = {
  pageTitle: string;
  guildData: GuildData;
  page: Page | null;
};

const WikiPage: NextPage<WikiPageProps> = ({ pageTitle, page, guildData }) => {
  const { guild, alias } = guildData;

  return (
    <>
      <NextSeo title={`${capitalise(pageTitle)} - ${guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <ArticleNavigation guildData={guildData} pageTitle={pageTitle} />
        {!page && (
          <small>
            This page does not exist. You can{" "}
            <Link href={`/${alias || guild.id}/wiki/${pageTitle}/edit`}>
              create
            </Link>{" "}
            it or <Link href={`/${alias || guild.id}/search`}>search</Link> for
            something else.
          </small>
        )}
        {page && (
          <>
            {page.date && (
              <small>Last edited on {formatDateTime(page.date)}</small>
            )}
            <article id="article">
              <WikiParser wikiSubpath={`${alias || guild.id}/wiki`}>
                {page.content}
              </WikiParser>
            </article>
          </>
        )}
      </main>
    </>
  );
};

export default WikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
});

export const getServerSideProps: GetServerSideProps<WikiPageProps> = async ({
  query,
  req,
  res,
}) => {
  const { guildId, pageTitle } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/${guildId}/${pageTitle}`,
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
