import Cookies from "cookies";
import getConfig from "next/config";
import { AuthorizationCode } from "simple-oauth2";

const getSession = async (cookies: Cookies) => {
  const tokenCookie = cookies.get("discord_token");
  if (!tokenCookie) return null;

  const { serverRuntimeConfig } = getConfig();

  const discordClient = new AuthorizationCode({
    client: {
      id: serverRuntimeConfig.discord.clientId,
      secret: serverRuntimeConfig.discord.clientSecret,
    },
    auth: {
      tokenHost: "https://discord.com/",
      authorizePath: "/oauth2/authorize",
      tokenPath: "/api/oauth2/token",
    },
  });

  const token = discordClient.createToken(JSON.parse(tokenCookie));
  if (token.expired()) {
    try {
      const refreshed = await token.refresh();
      cookies.set("discord_token", JSON.stringify(refreshed), { path: "/" });
      return refreshed;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return token;
};

export default getSession;
