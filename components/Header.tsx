import { Guild } from "discord.js";
import Link from "next/link";
import { FC } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";

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

const Header: FC<{ guild?: Guild; isSignedIn?: boolean }> = ({
  guild,
  isSignedIn = true,
}) => {
  return (
    <header>
      <TopNav>
        <Link href={guild ? `/${guild.id}/wiki/Home_Page` : "/"}>
          <h1 style={{ fontSize: "1.3rem" }}>
            {guild ? `${guild.name} wiki` : "Wikicord"}
          </h1>
        </Link>
        {guild && (
          <>
            <Link href={`/${guild.id}`}>Wiki summary</Link>
            <SearchBar guild={guild} query="" />
          </>
        )}
        {isSignedIn ? (
          <>
            <Link href="/guilds">My servers</Link>
            <Link href="/bye">Sign out</Link>
          </>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </TopNav>
    </header>
  );
};

export default Header;
