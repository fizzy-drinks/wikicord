import axios from "axios";
import Header from "components/Header";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import dbConnection from "utils/dbConnection";
import findGuildById from "utils/findGuildById";
import getSession from "utils/getSession";
import { GuildData } from "utils/types/Guild";

type GuildPreferencesPageProps = {
  guildData: GuildData;
};

const GuildPreferencesPage: NextPage<GuildPreferencesPageProps> = ({
  guildData,
}) => {
  const [status, setStatus] = useState<
    | "inactive"
    | "checking"
    | "available"
    | "not-available"
    | "saving"
    | "error"
    | "success"
  >("inactive");
  const [serverAlias, setServerAlias] = useState(guildData.alias ?? "");

  const verifyAlias = async () => {
    if (!serverAlias || serverAlias === guildData.alias) return;

    setStatus("checking");
    const {
      data: { available },
    } = await axios.get<{ available: boolean }>("/api/alias/" + serverAlias);

    setStatus(available ? "available" : "not-available");
  };

  const router = useRouter();
  const changeServerAlias: FormEventHandler = async (event) => {
    event.preventDefault();

    setStatus("saving");
    try {
      await axios.put(`/api/${guildData.guild.id}/preferences/alias`, {
        alias: serverAlias,
      });
      setStatus("success");
      router.replace(`/${serverAlias}/preferences`);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const canChangeAlias = ["inactive", "available", "not-available"].includes(
    status
  );

  return (
    <>
      <NextSeo title={`${guildData.guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <section>
          <h1>Preferences</h1>
          <form onSubmit={changeServerAlias}>
            <label>
              Server alias
              <input
                value={serverAlias}
                onChange={(e) => setServerAlias(e.target.value)}
                onBlur={verifyAlias}
                disabled={!canChangeAlias}
              />
            </label>
            <small>
              {status === "checking" && "Verifying availability..."}
              {status === "available" && "Available!"}
              {status === "not-available" && "This alias is already in use."}
              {status === "saving" && "Saving..."}
              {status === "error" &&
                "There was an error updating the server alias."}
              {status === "success" && "Alias set!"}
            </small>
            <button type="submit" disabled={status !== "available"}>
              Save
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default GuildPreferencesPage;

const parseQuery = (query) => ({ guildId: query["guild-id"] as string });

export const getServerSideProps: GetServerSideProps<
  GuildPreferencesPageProps
> = async ({ req, res, query }) => {
  const { guildId } = parseQuery(query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const db = await dbConnection();
  const guildData = await findGuildById(db, session, guildId);
  if (!guildData) {
    return {
      redirect: {
        permanent: false,
        destination: "/guilds",
      },
    };
  }

  return {
    props: {
      guildData,
    },
  };
};
