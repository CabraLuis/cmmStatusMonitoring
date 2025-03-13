import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";

export const GET: APIRoute = async () => {
  CMMController.getInstance().addOrUpdate();
  console.log("-----------------------------");
  console.log("UPDATE CLIENTS");
  console.log("-----------------------------");
  return new Response("OK", { status: 200 });
};
