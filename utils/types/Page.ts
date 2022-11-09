export type PageDb = {
  guild_id: string;
  title: string;
  content: string;
  date?: Date;
};

export type Page = {
  _id: string;
  guild_id: string;
  title: string;
  content: string;
  date: string | null;
};
