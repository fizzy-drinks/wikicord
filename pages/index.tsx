import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getConfig from "next/config";
import { AuthorizationCode } from "simple-oauth2";
import getSession from "utils/getSession";

type HomePageProps = {
  authUrl: string;
};

const HomePage: NextPage<HomePageProps> = ({ authUrl }) => {
  return (
    <div>
      <a href={authUrl}>sign in</a>
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  req,
  res,
}) => {
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
    },
  });

  const authUrl = discordClient.authorizeURL({
    redirect_uri: serverRuntimeConfig.discord.redirectUri,
    scope: ["guilds", "identify"],
  });

  return {
    props: {
      authUrl,
    },
  };
};
