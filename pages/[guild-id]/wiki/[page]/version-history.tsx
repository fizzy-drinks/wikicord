import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import { Page, PageDb } from "utils/types/Page";
import Header from "components/Header";
import serialisePage from "utils/mappers/serialisePage";
import ArticleNavigation from "components/ArticleNavigation";
import capitalise from "utils/capitalise";

type VersionHistoryPageProps = {
  pageTitle: string;
  guild: Guild;
  versions: Page[];
};

const VersionHistoryPage: NextPage<VersionHistoryPageProps> = ({
  pageTitle,
  versions,
  guild,
}) => {
  return (
    <>
      <Header guild={guild} />
      <main>
        <ArticleNavigation guild={guild} pageTitle={pageTitle} edit={false} />
        <p>
          Version history of{" "}
          <Link href={`/${guild.id}/wiki/${pageTitle}`}>
            {capitalise(pageTitle)}
          </Link>
          .
        </p>
        <ul>
          {versions.map((version) => (
            <li key={version._id}>
              <Link href={`/${guild.id}/wiki/${pageTitle}/${version._id}`}>
                {version.date && `(${version.date})`}
              </Link>
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
    return { redirect: { destination: "/", permanent: false } };
  }

  const guilds = await fetchSessionGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const pages = (await dbConnection()).collection<PageDb>("pages");
  const versions = await pages
    .find({
      guild_id: guildId,
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
      guild,
    },
  };
};
