import Header from "components/Header";
import SearchBar from "components/SearchBar";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import capitalise from "utils/capitalise";
import dbConnection from "utils/dbConnection";
import getSession from "utils/getSession";
import serialisePage from "utils/mappers/serialisePage";
import { Page, PageDb } from "utils/types/Page";
import { NextSeo } from "next-seo";
import findGuildById from "utils/findGuildById";
import { GuildData } from "utils/types/Guild";

type WikiSearchPageProps = {
  guildData: GuildData;
  results: Page[];
  searchQuery: string;
};

const WikiSearchPage: NextPage<WikiSearchPageProps> = ({
  guildData,
  results,
  searchQuery,
}) => {
  const { alias, guild } = guildData;

  return (
    <>
      <NextSeo title={`Search - ${guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <SearchBar query={searchQuery} guildData={guildData} />
        <ul>
          {results.map((page) => (
            <li key={page._id}>
              <Link href={`/${alias || guild.id}/wiki/${page.title}`}>
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
        destination: `/login?redirect=/${guildId}/search`,
      },
    };
  }

  const db = await dbConnection();
  const guildData = await findGuildById(db, session, guildId);
  if (!guildData) {
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
      guild_id: guildData.guild.id,
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
      guildData: guildData,
      searchQuery,
      results: pages,
    },
  };
};
