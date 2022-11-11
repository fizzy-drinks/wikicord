import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import capitalise from "utils/capitalise";
import { GuildData } from "utils/types/Guild";

const StyledNavigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const Options = styled.div`
  font-size: 0.9em;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ArticleNavigation: FC<{
  guildData: GuildData;
  pageTitle: string;
  edit: boolean;
}> = ({ pageTitle, guildData: { guild, alias }, edit }) => {
  return (
    <StyledNavigation>
      <h1>
        {edit && "Editing "}
        {capitalise(pageTitle)}
      </h1>
      <Options>
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
      </Options>
    </StyledNavigation>
  );
};

export default ArticleNavigation;
