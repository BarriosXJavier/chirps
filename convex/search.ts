import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { v } from "convex/values";

export const searchMessages = query({
  args: {
    conversationId: v.id("conversations"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found!");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this conversation!");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "text"),
          q.or(
            ...args.query
              .toLowerCase()
              .split(" ")
              .map((term) => q.contains(q.lower(q.field("content")), term))
          )
        )
      )
      .order("desc")
      .take(20);

    const results = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);

        // Skip messages with no sender
        if (!sender) {
          return null;
        }

        const isCurrentUser = sender._id === currentUser._id;

        return {
          message,
          senderName: sender.username,
          senderImage: sender.imageUrl,
          isCurrentUser,
          preview:
            message.content[0].substring(0, 50) +
            (message.content[0].length > 50 ? "..." : ""),
        };
      })
    );

    // Filter out any null results
    return results.filter(Boolean);
  },
});
