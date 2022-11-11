import { Db } from "mongodb";
import { AccessToken } from "simple-oauth2";
import fetchSessionGuilds from "./fetchSessionGuilds";
import { GuildData, GuildDb } from "./types/Guild";

const findGuildById = async (
  db: Db,
  session: AccessToken,
  guildId: string
): Promise<GuildData | undefined> => {
  const guildsDb = db.collection<GuildDb>("guilds");
  const guilds = await fetchSessionGuilds(session);
  const guildsWithConfig = await guildsDb
    .find({ guild_id: { $in: guilds.map((g) => g.id) } })
    .map(({ alias, guild_id }) => ({ alias, guild_id }))
    .toArray();

  const guildConfig = guildsWithConfig.find((g) => g.alias === guildId);
  const findId = guildConfig?.guild_id || guildId;

  const guild = guilds.find((g) => g.id === findId);

  return guild && { guild, alias: guildConfig?.alias ?? null };
};

export default findGuildById;
