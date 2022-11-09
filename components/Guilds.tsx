import { Guild } from "discord.js";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import styled from "styled-components";

const GuildCard = styled.article`
  border: #eee 1px solid;
  border-radius: 5px;
  max-width: 400px;
  width: 400px;
  height: 64px;
  margin: 0.5rem;
  display: inline-flex;
  overflow: hidden;
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
`;

const GuildCardDescription = styled.div`
  padding: 0 0.2rem;
`;

const Guilds: FC<{ guilds: { guild: Guild; articleCount: number }[] }> = ({
  guilds,
}) => {
  return (
    <>
      {guilds.map(({ guild, articleCount }) => (
        <Link href={`/${guild.id}`} key={guild.id}>
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
    </>
  );
};

export default Guilds;
