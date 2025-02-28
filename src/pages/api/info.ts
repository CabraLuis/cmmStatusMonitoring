import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async () => {
  const parts = await prisma.part.findMany();
  const steps = await prisma.step.findMany();
  const areas = await prisma.area.findMany();
  const status = await prisma.status.findMany();
  const beepers = await prisma.beeperAsignee.findMany();

  return new Response(
    JSON.stringify({
      info: {
        parts,
        steps,
        areas,
        status,
        beepers
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
