import Header from "components/Header";
import SearchBar from "components/SearchBar";
import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import capitalise from "utils/capitalise";
import dbConnection from "utils/dbConnection";
import getSession from "utils/getSession";
import serialisePage from "utils/mappers/serialisePage";
import { Page, PageDb } from "utils/types/Page";
import { NextSeo } from "next-seo";
import findGuildById from "utils/findGuildById";

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
      <NextSeo title={`Search - ${guild.name} wiki`} />
      <Header guild={guild} />
      <main>
        <SearchBar query={searchQuery} guild={guild} />
        <ul>
          {results.map((page) => (
            <li key={page._id}>
              <Link href={`/${guild.id}/wiki/${page.title}`}>
                {capitalise(page.title)}
              </Link>
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

  const db = await dbConnection();
  const guild = await findGuildById(db, session, guildId);
  if (!guild) {
    return {
      redirect: {
        permanent: false,
        destination: "/guilds",
      },
    };
  }

  const pagesDb = db.collection<PageDb>("pages");
  const pages = await pagesDb
    .find({
      guild_id: guild.id,
      $or: [
        {
          title: {
            $regex: new RegExp(searchQuery.replace(/\s/g, "[_\\s]"), "i"),
          },
        },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    })
    .map(serialisePage)
    .toArray();

  return {
    props: {
      guild,
      searchQuery,
      results: pages,
    },
  };
};
