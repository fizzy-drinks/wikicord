import { Guild } from "discord.js";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import styled from "styled-components";

const GuildCard = styled.article`
  border: #eee 1px solid;
  border-radius: 5px;
  height: 64px;
  display: inline-flex;
  overflow-x: hidden;
  display: flex;
`;

const GuildCardBody = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const GuildCardTitle = styled.h1`
  background-color: #eee;
  font-size: 1.3rem;
  margin: 0;
  padding: 0.2rem;
  overflow: hidden;
  white-space: nowrap;
  width: 315px;
  text-overflow: ellipsis;
`;

const GuildCardDescription = styled.div`
  padding: 0 0.2rem;
`;

const Guilds: FC<{ guilds: { guild: Guild; articleCount: number }[] }> = ({
  guilds,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        flexWrap: "wrap",
      }}
    >
      {guilds.map(({ guild, articleCount }) => (
        <Link href={`/${guild.id}/wiki/Home_Page`} key={guild.id}>
          <GuildCard>
            <Image
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
              width={64}
              height={64}
              quality={100}
              alt={guild.name}
            />
            <GuildCardBody>
              <GuildCardTitle>{guild.name}</GuildCardTitle>
              <GuildCardDescription>
                {articleCount} articles
              </GuildCardDescription>
            </GuildCardBody>
          </GuildCard>
        </Link>
      ))}
    </div>
  );
};

export default Guilds;
