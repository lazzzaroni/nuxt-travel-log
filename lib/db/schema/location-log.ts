import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schemas";

import { user } from "./auth";
import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real(),
  long: real(),
  locationId: int().notNull().references(() => location.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

export const locationLogInsertSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: z.number().int().min(0),
  endedAt: z.number().int().min(0),
}).superRefine((values, context) => {
  if (values.startedAt >= values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Date must be after Start Date.",
      path: ["endedAt"],
    });
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Started Date must be before End Date.",
      path: ["startedAt"],
    });
  }
});

export type LocationLogInsertSchema = z.infer<typeof locationLogInsertSchema>;

export type SelectLocationLog = typeof locationLog.$inferSelect;
