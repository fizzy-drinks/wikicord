import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import Guilds from "components/Guilds";
import getGuilds from "utils/getGuilds";
import getSession from "utils/getSession";

type GuildsPageProps = {
  guilds: Guild[];
};

const GuildsPage: NextPage<GuildsPageProps> = ({ guilds }) => {
  return <Guilds guilds={guilds} />;
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

  const guilds = await getGuilds(session);

  return {
    props: {
      guilds,
    },
  };
};
