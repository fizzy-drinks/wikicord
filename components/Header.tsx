import { Guild } from "discord.js";
import Link from "next/link";
import { FC } from "react";
import SearchBar from "./SearchBar";

const Header: FC<{ guild: Guild }> = ({ guild }) => {
  return (
    <header>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#eee",
          padding: "0.5rem",
        }}
      >
        <h1 style={{ margin: 0 }}>{guild.name} wiki</h1>
        <Link href={`/${guild.id}/wiki/Home_Page`}>Home page</Link>
        <Link href={`/${guild.id}`}>Summary</Link>
        <SearchBar guild={guild} query="" />
      </nav>
    </header>
  );
};

export default Header;
