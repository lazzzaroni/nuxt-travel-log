import z from "zod";

import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const searchSchema = z.object(
  {
    q: z.string().min(1),
  },
);

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, searchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${result.data.q}}`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "nuxt-travel-log | learning purposes | mpaliakou.dev@gmail.com",
        },
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "Failed to fetch search results from Nominatim.",
        }));
      }

      return await response.json();
    }
    catch {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: "Failed to fetch search results from Nominatim.",
      }));
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim",
    getKey: async (event) => {
      const query = await getQuery(event);
      return query.q?.toString() || "";
    },
  }),
);
