import Cookies from "cookies";
import { NextApiHandler } from "next";
import dbConnection from "../../../../utils/dbConnection";
import getGuilds from "../../../../utils/getGuilds";
import getSession from "../../../../utils/getSession";
import Page from "../../../../utils/types/Page";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PUT") return res.status(400);

  if (!("content" in req.body)) return res.status(400);

  const { "guild-id": guildId, page } = req.query;

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) return res.status(401);

  const guilds = await getGuilds(session);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) {
    return res.status(403);
  }

  const pages = (await dbConnection()).collection<Page>("pages");
  await pages.findOneAndUpdate(
    { guild_id: guildId, title: page },
    { $set: { content: req.body.content } },
    { upsert: true }
  );

  res.status(200).send("Success!");
};

export default handler;
