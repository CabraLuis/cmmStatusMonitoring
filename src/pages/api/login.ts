import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { user } = await request.json();
  console.log(user);
  const authorizedUser = await prisma.authorizedUser.findUnique({
    where: { email: user.email, password: user.password },
  });

  if (!authorizedUser) {
    return new Response(null, { status: 401 });
  }

  cookies.set("auth", "1", { path: "/" });
  return new Response(JSON.stringify({message:"OK"}), { status: 200 });
};
