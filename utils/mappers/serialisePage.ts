import { WithId } from "mongodb";
import { Page, PageDb } from "utils/types/Page";

const serialisePage = (pageDoc: WithId<PageDb>): Page => ({
  ...pageDoc,
  _id: pageDoc._id.toString(),
  date: pageDoc.date?.toISOString() ?? null,
});

export default serialisePage;
