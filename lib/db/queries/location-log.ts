import { and, eq } from "drizzle-orm";

import type { LocationLogInsertSchema } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function findLocationLog(id: number, userId: number) {
  const foundLog = await db.query.locationLog.findFirst({
    where: and(
      eq(locationLog.id, id),
      eq(locationLog.userId, userId),
    ),
  });

  return foundLog;
}

export async function insertLocationLog(insertable: LocationLogInsertSchema, locationId: number, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return inserted;
}
