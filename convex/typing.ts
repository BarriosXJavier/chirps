import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Track user typing status
export const update = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Get the membership to check if the user is in this conversation
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

    // Track typing status with expiration
    // First delete any existing typing indicators from this user
    const existingIndicators = await ctx.db
      .query("typing_indicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .collect();

    for (const indicator of existingIndicators) {
      await ctx.db.delete(indicator._id);
    }

    if (args.isTyping) {
      // Add new typing indicator
      await ctx.db.insert("typing_indicators", {
        userId: currentUser._id,
        username: currentUser.username,
        conversationId: args.conversationId,
        expiresAt: Date.now() + 5000, // 5 seconds from now
      });
    }

    return { success: true };
  },
});

// Get users who are currently typing in a conversation
export const get = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Get all typing indicators for this conversation, except the current user's
    const currentTime = Date.now();
    const typingUsers = await ctx.db
      .query("typing_indicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(
          q.neq(q.field("userId"), currentUser._id),
          q.gt(q.field("expiresAt"), currentTime)
        )
      )
      .collect();

    // Return just the usernames of people typing
    return typingUsers.map((user) => user.username);
  },
});
