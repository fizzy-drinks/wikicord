import { MongoClient } from "mongodb";
import getConfig from "next/config";

const dbConnection = async () => {
  const { serverRuntimeConfig } = getConfig();
  const mongo = new MongoClient(serverRuntimeConfig.mongodb.uri);
  await mongo.connect();
  return mongo.db(serverRuntimeConfig.mongodb.db);
};

export default dbConnection;
