import { NextApiHandler } from "next";
import dbConnection from "utils/dbConnection";
import { GuildDb } from "utils/types/Guild";

const parseQuery = (query) => ({ guildId: query["guild-id"] as string });
const parseBody = (body) => ({ alias: body.alias as string });

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PUT") return res.status(400);

  const { guildId } = parseQuery(req.query);
  const { alias } = parseBody(req.body);
  if (!guildId || !alias) return res.status(400);

  const db = await dbConnection();
  const guildsDb = db.collection<GuildDb>("guilds");
  const guild = await guildsDb.findOne({ alias });
  if (guild) {
    return res.status(409);
  }

  await guildsDb.findOneAndUpdate(
    { guild_id: guildId },
    { $set: { alias } },
    { upsert: true }
  );
  res.status(200).send({ success: true });
};

export default handler;
