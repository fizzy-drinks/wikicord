import Header from "components/Header";
import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import capitalise from "utils/capitalise";
import dbConnection from "utils/dbConnection";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import { PageDb } from "utils/types/Page";

type GuildSummaryPageProps = {
  guild: Guild;
  latestEdits: { title: string; date: string | null }[];
};

const GuildSummaryPage: NextPage<GuildSummaryPageProps> = ({
  guild,
  latestEdits,
}) => {
  return (
    <>
      <Header guild={guild} />
      <main>
        <section>
          <h1>Recently updated articles</h1>
          <ul>
            {latestEdits.map((page) => (
              <li key={page.title}>
                <Link href={`/${guild.id}/wiki/${page.title}`}>
                  {capitalise(page.title)}
                </Link>{" "}
                {page.date && `(${page.date})`}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default GuildSummaryPage;

const parseQuery = (query) => ({ guildId: query["guild-id"] as string });

export const getServerSideProps: GetServerSideProps<
  GuildSummaryPageProps
> = async ({ req, res, query }) => {
  const { guildId } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const guilds = await fetchSessionGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return {
      redirect: {
        permanent: false,
        destination: "/guilds",
      },
    };
  }

  const pagesDb = (await dbConnection()).collection<PageDb>("pages");
  const pages = await pagesDb
    .aggregate<{
      title: string;
      date?: Date;
    }>([
      {
        $match: {
          guild_id: guildId,
        },
      },
      { $sort: { date: -1 } },
      { $group: { _id: "$title", date: { $first: "$date" } } },
      { $limit: 50 },
      { $sort: { date: -1 } },
      {
        $project: {
          title: "$_id",
          date: 1,
        },
      },
    ])
    .map((obj) => ({ ...obj, date: obj.date?.toISOString() ?? null }))
    .toArray();

  return {
    props: {
      guild,
      latestEdits: pages,
    },
  };
};
