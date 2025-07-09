import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real(),
  long: real(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

const _baseLocationInsertSchema = createInsertSchema(location, {
  name: field => field.min(1).max(100).trim(),
  description: field => field.max(1000).trim(),
  lat: field => field.min(-90).max(90),
  long: field => field.min(-180).max(180),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Recreate the schema using z.object to ensure proper typing
export const locationInsertSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(1000).trim().optional(),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
});

export type LocationInsertSchema = z.infer<typeof locationInsertSchema>;
