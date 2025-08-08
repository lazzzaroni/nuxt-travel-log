import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";

import type { SelectLocationLogImage } from "./location-log-image";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "../../zod-schemas";
import { user } from "./auth";
import { location } from "./location";
import { locationLogImage } from "./location-log-image";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImage),
}));

export const locationLogInsertSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: z.number().int().min(0),
  endedAt: z.number().int().min(0),
}).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
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
export type SelectLocationLogWithImages = SelectLocationLog & {
  images: SelectLocationLogImage[];
};
