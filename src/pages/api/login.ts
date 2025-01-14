import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { user } = await request.json();

  const authorizedUser = await prisma.authorizedUser.findUnique({
    where: { email: user.email, password: user.password },
  });

  if (!authorizedUser) {
    return new Response(null, { status: 200 });
  }
  cookies.set("auth", "1");
  return new Response(null, { status: 401 });
};
