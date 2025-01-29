import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";

export const GET: APIRoute = async () => {
  let sendEvent: () => void;
  let ping: () => void;
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      sendEvent = () => {
        const data = `data: UPDATED\n\n`;
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
      "X-Accel-Buffering": "no",
    },
  });
};
