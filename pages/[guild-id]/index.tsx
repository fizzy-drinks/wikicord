import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import Page from "utils/types/Page";

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
      <header>
        <h1>{guild.name}</h1>
        <p>{guild.id}</p>
      </header>
      <main>
        <ul>
          {pages.map((page) => (
            <li key={page.title}>
              <Link href={`/${guild.id}/wiki/${page.title}`}>{page.title}</Link>
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

  const pagesDb = (await dbConnection()).collection<Page>("pages");
  const pageDocs = await pagesDb.find({ guild_id: guildId }).toArray();
  const pages = pageDocs.map((page) => ({ ...page, _id: page._id.toString() }));

  return {
    props: {
      guild,
      pages,
    },
  };
};
