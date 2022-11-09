import axios from "axios";
import { User } from "discord.js";
import { AccessToken } from "simple-oauth2";

const fetchSessionUser = async (session: AccessToken) => {
  const { data } = await axios.get<User>("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${session.token.access_token}`,
    },
  });

  return data;
};

export default fetchSessionUser;
