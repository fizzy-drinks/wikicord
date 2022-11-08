import axios from "axios";
import { Guild } from "discord.js";
import { AccessToken } from "simple-oauth2";

const getGuilds = async (session: AccessToken) => {
  const { data } = await axios.get<Guild[]>(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        authorization: `Bearer ${session.token.access_token}`,
      },
    }
  );

  return data;
};

export default getGuilds;
