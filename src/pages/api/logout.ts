import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  if (cookies.has("auth")) {
    cookies.delete("auth", { path: "/" });
  }

  return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
};
