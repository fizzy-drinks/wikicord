import Header from "components/Header";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import getSession from "utils/getSession";

type HomePageProps = {
  isSignedIn: boolean;
};

const HomePage: NextPage<HomePageProps> = ({ isSignedIn }) => {
  return <Header isSignedIn={isSignedIn} />;
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  req,
  res,
}) => {
  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);

  return {
    props: {
      isSignedIn: !!session,
    },
  };
};
