import { Guild } from "discord.js";

export type GuildDb = {
  guild_id: string;
  alias: string;
};

export type GuildData = {
  alias: string | null;
  guild: Guild;
};
