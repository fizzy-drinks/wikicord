import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getSession from "utils/getSession";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import { Page, PageDb } from "utils/types/Page";
import Header from "components/Header";
import serialisePage from "utils/mappers/serialisePage";
import ArticleNavigation from "components/ArticleNavigation";
import capitalise from "utils/capitalise";
import formatDateTime from "utils/formatDateTime";
import { NextSeo } from "next-seo";
import findGuildById from "utils/findGuildById";
import { GuildData } from "utils/types/Guild";

type VersionHistoryPageProps = {
  pageTitle: string;
  guildData: GuildData;
  versions: Page[];
};

const VersionHistoryPage: NextPage<VersionHistoryPageProps> = ({
  pageTitle,
  versions,
  guildData,
}) => {
  const { guild, alias } = guildData;
  return (
    <>
      <NextSeo
        title={`Version history of ${capitalise(pageTitle)} - ${
          guild.name
        } wiki`}
      />
      <Header guildData={guildData} />
      <main>
        <ArticleNavigation guildData={guildData} pageTitle={pageTitle} />
        <p>
          Version history of{" "}
          <Link href={`/${alias || guild.id}/wiki/${pageTitle}`}>
            {capitalise(pageTitle)}
          </Link>
          .
        </p>
        <ul>
          {versions.map((version) => (
            <li key={version._id}>
              <Link
                href={`/${alias || guild.id}/wiki/${pageTitle}/${version._id}`}
              >
                {version.date ? formatDateTime(version.date) : "(no date)"}
              </Link>
              {version.author && ` by ${version.author}`}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default VersionHistoryPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
});

export const getServerSideProps: GetServerSideProps<
  VersionHistoryPageProps
> = async ({ query, req, res }) => {
  const { guildId, pageTitle } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/${guildId}/wiki/${pageTitle}/version-history`,
        permanent: false,
      },
    };
  }

  const db = await dbConnection();
  const guildData = await findGuildById(db, session, guildId);
  if (!guildData) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const pages = db.collection<PageDb>("pages");
  const versions = await pages
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
    .limit(50)
    .map(serialisePage)
    .toArray();

  return {
    props: {
      pageTitle,
      versions,
      guildData,
    },
  };
};
