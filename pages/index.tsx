import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getConfig from "next/config";
import Link from "next/link";
import { AuthorizationCode } from "simple-oauth2";
import getSession from "utils/getSession";

type HomePageProps = {
  authUrl: string;
  isSignedIn: boolean;
};

const HomePage: NextPage<HomePageProps> = ({ authUrl, isSignedIn }) => {
  return (
    <div>
      {isSignedIn ? (
        <>
          <Link href="/guilds">My servers</Link> |{" "}
          <Link href="/bye">Sign out</Link>
        </>
      ) : (
        <a href={authUrl}>Sign in</a>
      )}
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
      isSignedIn: !!session,
    },
  };
};
