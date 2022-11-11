import { NextApiHandler } from "next";
import dbConnection from "utils/dbConnection";
import { GuildDb } from "utils/types/Guild";

const parseQuery = (query) => ({ alias: query.alias as string });

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.status(400);

  const { alias } = parseQuery(req.query);
  if (!alias) return res.status(400);

  const db = await dbConnection();
  const guildsDb = db.collection<GuildDb>("guilds");
  const guild = await guildsDb.findOne({ alias });

  res.status(200).send({ available: !guild });
};

export default handler;
