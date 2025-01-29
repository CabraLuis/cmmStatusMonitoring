import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";

export const GET: APIRoute = async () => {
  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};
