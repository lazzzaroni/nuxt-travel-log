import type { LocationLogImageInsertSchema } from "../schema";

import db from "..";
import { locationLogImage } from "../schema";

export async function insertLocationLogImage(
  insertable: LocationLogImageInsertSchema,
  locationLogId: number,
  userId: number,
) {
  const [inserted] = await db.insert(locationLogImage).values({
    ...insertable,
    userId,
    locationLogId,
  }).returning();

  return inserted;
}
