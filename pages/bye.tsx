import Cookies from "cookies";
import { GetServerSideProps } from "next";

export default function Bye() {
  return <p>Redirecting...</p>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  cookies.set("discord_token", null, { path: "/" });
  return { redirect: { permanent: false, destination: "/" } };
};
