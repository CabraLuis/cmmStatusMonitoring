import type { APIRoute } from "astro";
import CMMController from "../controller";

export const GET: APIRoute = async ({ request }) => {
  let sendEvent: (part: any) => void;
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      sendEvent = (part: any) => {
        console.log(JSON.stringify(part));
        const data = `data: ${JSON.stringify(part)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      CMMController.getInstance().unsub(sendEvent);
      CMMController.getInstance().sub(sendEvent);
    },
    cancel() {
      CMMController.getInstance().unsub(sendEvent);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
};
