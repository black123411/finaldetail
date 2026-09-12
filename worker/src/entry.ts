import baseWorker from "./index";
import {
  handleSquareBookingWebhook,
  squareBookingTrackingStatus,
  type SquareBookingTrackingEnv,
} from "./squareBookingTracking";

interface Env extends SquareBookingTrackingEnv {
  SQUARE_ACCESS_TOKEN: string;
  SQUARE_LOCATION_ID: string;
  SQUARE_ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
  CONTENT_DB: D1Database;
}

const WEBHOOK_PATH = "/api/webhooks/square/bookings";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === WEBHOOK_PATH) {
      if (request.method === "GET") return squareBookingTrackingStatus(env);
      if (request.method === "POST") return handleSquareBookingWebhook(request, env);
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Allow": "GET, POST",
        },
      });
    }

    return baseWorker.fetch(request, env as any);
  },
};
