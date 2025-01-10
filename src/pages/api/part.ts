import type { APIRoute } from "astro";
import CMMController from "../controller";

export const POST: APIRoute = async ({ request }) => {
  const { part } = await request.json();
  CMMController.getInstance().addPart(part);
  console.log(part);
  return new Response(null, { status: 204 });
};
