import Header from "components/Header";
import SearchBar from "components/SearchBar";
import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dbConnection from "utils/dbConnection";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import Page from "utils/types/Page";

type WikiSearchPageProps = {
  guild: Guild;
  results: Page[];
  searchQuery: string;
};

const WikiSearchPage: NextPage<WikiSearchPageProps> = ({
  guild,
  results,
  searchQuery,
}) => {
  return (
    <>
      <Header guild={guild} />
      <main>
        <SearchBar query={searchQuery} guild={guild} />
        <ul>
          {results.map((page) => (
            <li key={page.title}>
              <Link href={`/${guild.id}/wiki/${page.title}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default WikiSearchPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  q: query.q || "",
});

export const getServerSideProps: GetServerSideProps<
  WikiSearchPageProps
> = async ({ req, res, query }) => {
  const { guildId, q: searchQuery } = parseQuery(query);

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
  const pageDocs = await pagesDb
    .find({
      guild_id: guildId,
      title: { $regex: new RegExp(searchQuery.replace(" ", "_"), "i") },
      content: { $regex: new RegExp(searchQuery.replace(" ", "_"), "i") },
    })
    .toArray();
  const pages = pageDocs.map((page) => ({ ...page, _id: page._id.toString() }));

  return {
    props: {
      guild,
      searchQuery,
      results: pages,
    },
  };
};
