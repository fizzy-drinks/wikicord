import Cookies from "cookies";
import { Guild } from "discord.js";
import { GetServerSideProps, NextPage } from "next";
import getGuilds from "../../../utils/getGuilds";
import getSession from "../../../utils/getSession";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import dbConnection from "../../../utils/dbConnection";
import Page from "../../../utils/types/Page";

type WikiPageProps = {
  pageTitle: string;
  guild: Guild;
  page: Page | null;
  edit: boolean;
};

const WikiPage: NextPage<WikiPageProps> = ({
  pageTitle,
  page,
  guild,
  edit,
}) => {
  const router = useRouter();
  const [pageContent, setPageContent] = useState<string>(page?.content || "");
  const updatePage = async () => {
    await axios.put(`/api/${guild.id}/page/${pageTitle}`, {
      content: pageContent,
    });
    router.push({ pathname: router.asPath, query: {} });
  };

  return (
    <main>
      <h1>
        {edit && "Editing "}
        {pageTitle}
      </h1>
      <p>{guild.name} wiki</p>
      <p>
        {!edit && (
          <Link href={{ pathname: router.asPath, query: { edit: true } }}>
            edit
          </Link>
        )}
      </p>
      {edit && (
        <div>
          <textarea
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
          />
          <button type="button" onClick={updatePage}>
            Save
          </button>
        </div>
      )}
      <ReactMarkdown>{pageContent}</ReactMarkdown>
    </main>
  );
};

export default WikiPage;

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  pageTitle: query.page as string,
  edit: "edit" in query,
});

export const getServerSideProps: GetServerSideProps<WikiPageProps> = async ({
  query,
  req,
  res,
}) => {
  const { guildId, pageTitle, edit } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const guilds = await getGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return { redirect: { destination: "/guilds", permanent: false } };
  }

  const pages = (await dbConnection()).collection<Page>("pages");
  const pageDoc = await pages.findOne({ guild_id: guildId, title: pageTitle });

  const page = pageDoc
    ? {
        ...pageDoc,
        _id: pageDoc._id.toString(),
      }
    : null;

  return {
    props: {
      pageTitle,
      page,
      guild,
      edit,
    },
  };
};
