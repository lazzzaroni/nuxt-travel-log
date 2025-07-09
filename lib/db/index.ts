import { drizzle } from "drizzle-orm/libsql";

import env from "../env";
import * as schema from "./schema";

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL!,
    authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN!,
  },
  casing: "snake_case",
  schema,
});

export default db;

// When we changing schemas, we need to generate new schemas and migrate them to the database.

// pnpm drizzle-kit generate
// pnpm drizzle-kit migrate

// if migration doesn't work, it could mean that it didn't corelate to applied constraints.
