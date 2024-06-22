import { get } from "./users";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

// Webhook

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response("Could not validate Clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });
      if (user) {
        console.log(`Updating user ${event.data.id} with ${event.data}`);
      }

    case "user.updated":
      console.log("Creating/Updating user ", event.data.id);

      await ctx.runMutation(internal.users.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event?.data.id,
        email: event?.data.email_addresses[0].email_address,
      });

      break;

    default:
      console.log("Clerk webhook not supported", event.type);
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
