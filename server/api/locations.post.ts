import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { location, locationInsertSchema } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, locationInsertSchema.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError(
      {
        statusCode: 422,
        statusMessage,
        data,
      },
    ));
  }

  const existingLocation = await db.query.location.findFirst({
    where: and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "You already have a location with this name.",
    }));
  }

  // TODO: find the way to optimize slug generation to avoid multiple queries to the database
  let slug = slugify(result.data.name);
  let existing = Boolean(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = Boolean(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      userId: event.context.user.id,
      slug,
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as DrizzleError;

    // if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") { // doesn't work
    if (error.message.includes("Failed query: insert into \"location\"")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the location name is used to generate the slug).",
      }));
    }
    throw error;
  }
});
