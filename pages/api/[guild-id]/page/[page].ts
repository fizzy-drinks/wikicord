import Cookies from "cookies";
import { NextApiHandler } from "next";
import dbConnection from "utils/dbConnection";
import fetchSessionUser from "utils/fetchSessionUser";
import findGuildById from "utils/findGuildById";
import getSession from "utils/getSession";
import { PageDb } from "utils/types/Page";

const parseQuery = (query) => ({
  guildId: query["guild-id"] as string,
  page: query.page as string,
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PUT") return res.status(400);

  if (!("content" in req.body)) return res.status(400);

  const { guildId, page } = parseQuery(req.query);

  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);
  if (!session) return res.status(401);

  const db = await dbConnection();
  const guild = await findGuildById(db, session, guildId);
  if (!guild) {
    return res.status(403);
  }

  const user = await fetchSessionUser(session);
  const pages = db.collection<PageDb>("pages");
  await pages.insertOne({
    guild_id: guildId,
    title: page.toLowerCase().replace(/\s/g, "_"),
    content: req.body.content,
    date: new Date(),
    author: `${user.username}#${user.discriminator}`,
  });

  res.status(200).send("Success!");
};

export default handler;
