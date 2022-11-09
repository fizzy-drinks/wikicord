import Header from "components/Header";
import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import capitalise from "utils/capitalise";
import dbConnection from "utils/dbConnection";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import { Page, PageDb } from "utils/types/Page";

type GuildSummaryPageProps = {
  guild: Guild;
  pages: Page[];
};

const GuildSummaryPage: NextPage<GuildSummaryPageProps> = ({
  guild,
  pages,
}) => {
  return (
    <>
      <Header guild={guild} />
      <main>
        <h1>Latest edits</h1>
        <ul>
          {pages.map((page) => (
            <li key={page.title}>
              <Link href={`/${guild.id}/wiki/${page.title}/${page._id}`}>
                {capitalise(page.title)}
              </Link>{" "}
              {page.date && `(${page.date})`}
            </li>
          ))}
        </ul>
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
  const pageDocs = await pagesDb
    .find({ guild_id: guildId })
    .sort({ date: -1 })
    .toArray();
  const pages: Page[] = pageDocs.map((page) => ({
    ...page,
    _id: page._id.toString(),
    date: page.date?.toISOString() ?? null,
  }));

  return {
    props: {
      guild,
      pages,
    },
  };
};
