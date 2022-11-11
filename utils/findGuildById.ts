import { Guild } from "discord.js";
import { Db } from "mongodb";
import { AccessToken } from "simple-oauth2";
import fetchSessionGuilds from "./fetchSessionGuilds";
import { GuildDb } from "./types/Guild";

const findGuildById = async (
  db: Db,
  session: AccessToken,
  guildId: string
): Promise<Guild | undefined> => {
  const guildsDb = db.collection<GuildDb>("guilds");
  const guilds = await fetchSessionGuilds(session);
  const guildsWithConfig = await guildsDb
    .find({ guild_id: { $in: guilds.map((g) => g.id) } })
    .map(({ alias, guild_id }) => ({ alias, guild_id }))
    .toArray();

  const findId =
    guildsWithConfig.find((g) => g.alias === guildId)?.guild_id || guildId;

  return guilds.find((g) => g.id === findId);
};

export default findGuildById;
