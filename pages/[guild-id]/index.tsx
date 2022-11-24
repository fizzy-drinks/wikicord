import Header from "components/Header";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import capitalise from "utils/capitalise";
import dbConnection from "utils/dbConnection";
import formatDateTime from "utils/formatDateTime";
import getSession from "utils/getSession";
import { PageDb } from "utils/types/Page";
import { NextSeo } from "next-seo";
import findGuildById from "utils/findGuildById";
import { GuildData } from "utils/types/Guild";
import TitleNavigation, {
  TitleNavigationMenu,
} from "components/TitleNavigation";

type GuildSummaryPageProps = {
  guildData: GuildData;
  latestEdits: { title: string; date: string | null; author: string | null }[];
};

const GuildSummaryPage: NextPage<GuildSummaryPageProps> = ({
  guildData,
  latestEdits,
}) => {
  const { guild, alias } = guildData;

  return (
    <>
      <NextSeo title={`${guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <TitleNavigation>
          <h1>{guild.name}</h1>
          <TitleNavigationMenu>
            <Link href={`/${alias || guild.id}/preferences`}>Preferences</Link>
          </TitleNavigationMenu>
        </TitleNavigation>
        <section>
          <h1>Recent articles</h1>
          <ul>
            {latestEdits.map((page) => (
              <li key={page.title}>
                <Link href={`/${alias || guild.id}/wiki/${page.title}`}>
                  {capitalise(page.title)}
                </Link>{" "}
                {page.date && <small>({formatDateTime(page.date)})</small>}{" "}
                {page.author && <small>by {page.author}</small>}
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
        destination: `/login?redirect=/${guildId}`,
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
    .aggregate<{
      title: string;
      date?: Date;
      author?: string;
    }>([
      {
        $match: {
          guild_id: guildData.guild.id,
        },
      },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$title",
          date: { $first: "$date" },
          author: { $first: "$author" },
        },
      },
      { $limit: 50 },
      { $sort: { date: -1 } },
      {
        $project: {
          title: "$_id",
          date: 1,
          author: 1,
        },
      },
    ])
    .map((obj) => ({
      ...obj,
      date: obj.date?.toISOString() ?? null,
      author: obj.author ?? null,
    }))
    .toArray();

  return {
    props: {
      guildData,
      latestEdits: pages,
    },
  };
};
