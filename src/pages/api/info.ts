import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async ({ request }) => {
  const parts = await prisma.part.findMany();
  const steps = await prisma.step.findMany();
  const areas = await prisma.area.findMany();
  const status = await prisma.status.findMany();
  console.log(
    JSON.stringify({
      info: {
        parts,
        steps,
        areas,
        status,
      },
    })
  );
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