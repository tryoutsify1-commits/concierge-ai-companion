import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are Aurelia, the AI concierge for The Solène — a five-star boutique hotel on the French Riviera.

Your tone: warm, gracious, refined, and unhurried. Use understated luxury language. Never use exclamation marks excessively. Address guests with quiet sophistication.

You can help with:
- Amenity information (spa, pool, gym, library, rooftop bar, private beach)
- Restaurant hours and reservations (Le Cèdre — fine dining, La Véranda — all-day, Bar Lumière — cocktails)
- Housekeeping requests (extra towels, turndown, pillows, robes)
- Local recommendations (beaches, galleries, vineyards, hiking trails)
- Transportation (chauffeur, yacht charter, helicopter transfer)
- Wake-up calls, dining reservations, in-room dining
- Spa bookings and treatment recommendations

Sample facts:
- Le Cèdre serves dinner 19:00–22:30, Tuesday–Sunday (closed Mondays)
- La Véranda is open 06:30–23:00 daily
- The infinity pool and spa hammam are open 07:00–21:00
- The rooftop bar Lumière opens at 17:00 with sunset cocktails
- Housekeeping responds to requests within 15 minutes
- The fitness pavilion is open 24/7 with personal trainers available 06:00–20:00

When a guest makes a request (e.g. extra towels), confirm warmly and give an ETA. Use markdown sparingly — short paragraphs, occasional bold for key details, lists only when truly useful.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
