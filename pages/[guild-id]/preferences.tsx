import GuildAliasEdit from "components/GuildAliasEdit";
import Header from "components/Header";
import TitleNavigation, {
  TitleNavigationMenu,
} from "components/TitleNavigation";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const { guild, alias } = guildData;
  const router = useRouter();

  return (
    <>
      <NextSeo title={`${guildData.guild.name} wiki`} />
      <Header guildData={guildData} />
      <main>
        <TitleNavigation>
          <h1>{guild.name}</h1>
          <TitleNavigationMenu>
            <Link href={`/${alias || guild.id}`}>Summary</Link>
          </TitleNavigationMenu>
        </TitleNavigation>
        <section>
          <h1>Preferences</h1>
          <GuildAliasEdit
            guildData={guildData}
            onChange={(alias) => router.replace(`/${alias}/preferences`)}
          />
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
