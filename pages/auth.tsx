import Cookies from "cookies";
import add from "date-fns/add";
import { GetServerSideProps, NextPage } from "next";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthorizationCode } from "simple-oauth2";
import getSession from "utils/getSession";

const AuthPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/guilds");
  }, []);

  return <p>Redirecting...</p>;
};

export default AuthPage;

const isValidQuery = (query): query is { code: string } =>
  typeof query.code === "string";

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  if (!isValidQuery(query)) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (session) {
    return { redirect: { permanent: false, destination: "/guilds" } };
  }

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

  const accessToken = await discordClient.getToken({
    code: query.code,
    redirect_uri: serverRuntimeConfig.discord.redirectUri,
    scope: "guilds",
  });
  const expiresAt = add(new Date(), {
    seconds: accessToken.token.expires_in,
  });

  cookies.set(
    "discord_token",
    JSON.stringify({ ...accessToken.token, expires_at: expiresAt }),
    { path: "/" }
  );

  return {
    props: {},
  };
};
