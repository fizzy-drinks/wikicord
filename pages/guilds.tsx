import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Guilds from "components/Guilds";
import fetchSessionGuilds from "utils/fetchSessionGuilds";
import getSession from "utils/getSession";
import dbConnection from "utils/dbConnection";
import { PageDb } from "utils/types/Page";

type GuildsPageProps = {
  guilds: { guild: Guild; articleCount: number }[];
};

const GuildsPage: NextPage<GuildsPageProps> = ({ guilds }) => {
  return (
    <main>
      <h1>Servers</h1>
      <Guilds guilds={guilds} />
    </main>
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

  const pages = (await dbConnection()).collection<PageDb>("pages");
  const guilds = await fetchSessionGuilds(session);
  const guildArticleData = await pages
    .aggregate<{
      _id: string;
      articleCount: number;
    }>([
      { $group: { _id: { article: "$title", guild: "$guild_id" } } },
      { $group: { _id: "$_id.guild", articleCount: { $sum: 1 } } },
    ])
    .toArray();

  return {
    props: {
      guilds: guilds
        .map((g) => ({
          guild: g,
          articleCount:
            guildArticleData.find(({ _id }) => _id === g.id)?.articleCount ?? 0,
        }))
        .sort((a, b) => b.articleCount - a.articleCount),
    },
  };
};
