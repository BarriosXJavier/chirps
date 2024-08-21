import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
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

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError("Conversation not found!");
    }

    const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", (q) =>
      q.eq("conversationId", args.conversationId)
    ).collect();

    if (!memberships || memberships.length !== 2) {
      throw new ConvexError("This conversation does not have members yet!");
    }

    const friendship = await ctx.db.query("friends").withIndex("conversationId", q =>
      q.eq("conversationId", args.conversationId)
    ).unique();

    if (!friendship) {
      throw new ConvexError("Friend not found!");
    }

    const messages = await ctx.db.query("messages").withIndex("by_conversationId", q =>
      q.eq("conversationId", args.conversationId)
    ).collect();

    await ctx.db.delete(args.conversationId);
    await ctx.db.delete(friendship._id);

    await Promise.all(memberships.map(async (membership) => {
      await ctx.db.delete(membership._id);
    }));

    return message;
  },
});