import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async () => {
  const parts = await prisma.part.findMany();
  const steps = await prisma.step.findMany();
  const areas = await prisma.area.findMany();
  const status = await prisma.status.findMany();

  return new Response(
    JSON.stringify({
      info: {
        parts,
        steps,
        areas,
        status,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
