import { Id } from "./_generated/dataModel.d";
import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { v } from "convex/values";

export const get = query({
  args: {
    id: v.id("conversations"),
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

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError("Conversation not found!");
    }
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("User is not a member of this conversation!");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("conversationId", q => q.eq("conversationId", args.id)).collect();

      if (!conversation.isGroup) {
        const otherMembership = allConversationMemberships.filter(membership => membership.memberId !== currentUser._id)[0];

        const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

        return {
            ...conversation, 
            otherMember: {
                ...otherMemberDetails,
                lastSeenMessageId: otherMembership.lastSeenMessage,
            },
            otherMembers: null,
        }
      }
    // return conversation;
  },
});
