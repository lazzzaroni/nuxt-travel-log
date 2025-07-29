import type { LocationLogInsertSchema } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function insertLocationLog(insertable: LocationLogInsertSchema, locationId: number, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return inserted;
}
