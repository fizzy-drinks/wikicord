import Link from "next/link";
import { FC } from "react";
import capitalise from "utils/capitalise";
import { GuildData } from "utils/types/Guild";
import TitleNavigation, { TitleNavigationMenu } from "./TitleNavigation";

const ArticleNavigation: FC<{
  guildData: GuildData;
  pageTitle: string;
  edit: boolean;
}> = ({ pageTitle, guildData: { guild, alias }, edit }) => {
  return (
    <TitleNavigation>
      <h1>
        {edit && "Editing "}
        {capitalise(pageTitle)}
      </h1>
      <TitleNavigationMenu>
        <Link href={`/${alias || guild.id}/wiki/${pageTitle}`}>Article</Link>
        <Link
          href={{
            pathname: `/${alias || guild.id}/wiki/${pageTitle}`,
            query: { edit: "true" },
          }}
        >
          Source
        </Link>
        <Link href={`/${alias || guild.id}/wiki/${pageTitle}/version-history`}>
          Version history
        </Link>
      </TitleNavigationMenu>
    </TitleNavigation>
  );
};

export default ArticleNavigation;
