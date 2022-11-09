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

  @media (max-width: 840px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Header: FC<{ guild: Guild }> = ({ guild }) => {
  return (
    <header>
      <TopNav>
        <h1 style={{ margin: 0 }}>{guild.name} wiki</h1>
        <Link href={`/${guild.id}/wiki/Home_Page`}>Home page</Link>
        <Link href={`/${guild.id}`}>Wiki Summary</Link>
        <Link href="/guilds">My servers</Link>
        <SearchBar guild={guild} query="" />
      </TopNav>
    </header>
  );
};

export default Header;
