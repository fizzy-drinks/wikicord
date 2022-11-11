import { Db } from "mongodb";
import { AccessToken } from "simple-oauth2";
import fetchSessionGuilds from "./fetchSessionGuilds";
import { GuildData, GuildDb } from "./types/Guild";

const findGuildsWithAliases = async (
  db: Db,
  session: AccessToken
): Promise<GuildData[]> => {
  const guildsDb = db.collection<GuildDb>("guilds");
  const guilds = await fetchSessionGuilds(session);
  const guildsWithConfig = await guildsDb
    .find({ guild_id: { $in: guilds.map((g) => g.id) } })
    .map(({ alias, guild_id }) => ({ alias, guild_id }))
    .toArray();

  return guilds.map((g) => ({
    guild: g,
    alias:
      guildsWithConfig.find((dbGuild) => dbGuild.guild_id === g.id)?.alias ??
      null,
  }));
};

export default findGuildsWithAliases;
