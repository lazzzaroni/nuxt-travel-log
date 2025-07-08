import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  // Skip auth checks for API routes to avoid infinite loops
  if (event.path.startsWith("/api/"))
    return;

  if (event.path.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });

    if (!session) {
      await sendRedirect(event, "/", 302);
    }
  }
});
