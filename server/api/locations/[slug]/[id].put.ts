import { z } from "zod";

import { findLocation } from "~/lib/db/queries/location";
import { updateLocationLog } from "~/lib/db/queries/location-log";
import { locationLogInsertSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const result = await readValidatedBody(event, locationLogInsertSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    });
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid id.",
    });
  }

  const locationLog = await updateLocationLog(result.data, Number(id), event.context.user.id);

  if (!locationLog) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location log not found.",
    });
  }

  return locationLog;
});
