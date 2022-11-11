import Link from "next/link";
import { FC } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import { GuildData } from "utils/types/Guild";

const TopNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
  padding: 0.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavbarTitle = styled.h1`
  font-size: 1.3em;
`;

const Header: FC<{ guildData?: GuildData; isSignedIn?: boolean }> = ({
  guildData,
  isSignedIn = true,
}) => {
  if (!guildData) {
    return (
      <header>
        <TopNav>
          <Link href="/">
            <NavbarTitle>Wikicord</NavbarTitle>
          </Link>
          <Link href="/guilds">My servers</Link>
          {isSignedIn ? (
            <Link href="/bye">Sign out</Link>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </TopNav>
      </header>
    );
  }

  const { guild, alias } = guildData;

  return (
    <header>
      <TopNav>
        <Link href={`/${alias || guild.id}/wiki/Home_Page`}>
          <NavbarTitle>{guild.name} wiki</NavbarTitle>
        </Link>
        <Link href={`/${alias || guild.id}`}>Wiki summary</Link>
        <SearchBar guildData={guildData} query="" />
        <Link href="/guilds">My servers</Link>
        <Link href="/bye">Sign out</Link>
      </TopNav>
    </header>
  );
};

export default Header;
