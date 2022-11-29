import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { AuthorizationCode } from "simple-oauth2";

export default function Bye() {
  return <p>Redirecting...</p>;
}

const getQuery = (query) => ({ redirect: query.redirect as string });

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { redirect } = getQuery(query);
  const { serverRuntimeConfig } = getConfig();

  const discordClient = new AuthorizationCode({
    client: {
      id: serverRuntimeConfig.discord.clientId,
      secret: serverRuntimeConfig.discord.clientSecret,
    },
    auth: {
      tokenHost: "https://discord.com/",
      authorizePath: "/oauth2/authorize",
    },
  });

  const authUrl = discordClient.authorizeURL({
    redirect_uri: serverRuntimeConfig.discord.redirectUri,
    state: redirect,
    scope: ["guilds", "identify"],
  });

  return { redirect: { permanent: false, destination: authUrl } };
};
