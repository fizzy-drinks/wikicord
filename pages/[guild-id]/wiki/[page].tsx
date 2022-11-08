import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import getGuilds from "../../../utils/getGuilds";
import getSession from "../../../utils/getSession";

type WikiPageProps = {
  guild: Guild;
  pageName: string;
  edit: boolean;
};

const WikiPage: NextPage<WikiPageProps> = ({ pageName, guild, edit }) => {
  return (
    <main>
      <h1>
        {edit && "Editing "}
        {pageName}
      </h1>
      <p>{guild.name} wiki</p>
    </main>
  );
};

export default WikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"],
  page: query.page,
  edit: "edit" in query,
});

export const getServerSideProps: GetServerSideProps<WikiPageProps> = async ({
  query,
  req,
  res,
}) => {
  const { guildId, page, edit } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const guilds = await getGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  return {
    props: {
      pageName: page,
      guild,
      edit,
    },
  };
};
