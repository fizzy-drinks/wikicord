import { Guild } from "discord.js";
import Link from "next/link";
import { FC } from "react";

const Guilds: FC<{ guilds: Guild[] }> = ({ guilds }) => {
  return (
    <ul>
      {guilds.map((guild) => (
        <li key={guild.id}>
          <Link href={`/${guild.id}`}>{guild.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Guilds;
