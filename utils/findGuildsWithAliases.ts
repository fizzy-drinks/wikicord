import { Guild } from "discord.js";
import { Db } from "mongodb";
import { AccessToken } from "simple-oauth2";
import fetchSessionGuilds from "./fetchSessionGuilds";
import { GuildDb } from "./types/Guild";

const findGuildsWithAliases = async (
  db: Db,
  session: AccessToken
): Promise<{ guild: Guild; alias?: string }[]> => {
  const guildsDb = db.collection<GuildDb>("guilds");
  const guilds = await fetchSessionGuilds(session);
  const guildsWithConfig = await guildsDb
    .find({ guild_id: { $in: guilds.map((g) => g.id) } })
    .map(({ alias, guild_id }) => ({ alias, guild_id }))
    .toArray();

  return guilds.map((g) => ({
    guild: g,
    alias: guildsWithConfig.find((dbGuild) => dbGuild.guild_id === g.id)?.alias,
  }));
};

export default findGuildsWithAliases;
