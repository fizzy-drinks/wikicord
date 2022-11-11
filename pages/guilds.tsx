import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Guilds from "components/Guilds";
import getSession from "utils/getSession";
import dbConnection from "utils/dbConnection";
import { PageDb } from "utils/types/Page";
import Header from "components/Header";
import findGuildsWithAliases from "utils/findGuildsWithAliases";

type GuildsPageProps = {
  guilds: { guild: Guild; alias: string | null; articleCount: number }[];
};

const GuildsPage: NextPage<GuildsPageProps> = ({ guilds }) => {
  return (
    <>
      <Header />
      <main>
        <h1>Servers</h1>
        <Guilds guilds={guilds} />
      </main>
    </>
  );
};

export default GuildsPage;

export const getServerSideProps: GetServerSideProps<GuildsPageProps> = async ({
  req,
  res,
}) => {
  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  const db = await dbConnection();
  const pages = db.collection<PageDb>("pages");
  const guilds = await findGuildsWithAliases(db, session);
  const guildArticleData = await pages
    .aggregate<{
      _id: string;
      articleCount: number;
    }>([
      { $match: { guild_id: { $in: guilds.map((g) => g.guild.id) } } },
      { $group: { _id: { article: "$title", guild: "$guild_id" } } },
      { $group: { _id: "$_id.guild", articleCount: { $sum: 1 } } },
    ])
    .toArray();

  return {
    props: {
      guilds: guilds
        .map(({ guild, alias = null }) => ({
          guild,
          alias,
          articleCount:
            guildArticleData.find(({ _id }) => _id === guild.id)
              ?.articleCount ?? 0,
        }))
        .sort((a, b) => b.articleCount - a.articleCount),
    },
  };
};
