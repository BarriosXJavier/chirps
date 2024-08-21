import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { ConvexError, v } from "convex/values";
// import getLastMessageDetails from "./conversations";

export const get = query({
  args: {},
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

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);

        if (!conversation) {
          throw new ConvexError("conversation could not be found");
        }
        return conversation;
      })
    );

    // Get all conversations that a user is a member of

    // const conversionsWithDetails = await Promise.all(
    //   conversations.map(async (conversation, index) => {
    //     const allconversationsMemberships = await ctx.db
    //       .query("conversationMembers")
    //       .withIndex("conversationId", (q) =>
    //         q.eq("conversationId", conversation?._id)
    //       )
    //       .collect();

    //     const lastMessage = await getLastMessageDetails({
    //       ctx,
    //       id: conversation.lastMessageId,
    //     });

    //     if (conversation.isGroup) {
    //       return { conversation, lastMessage };
    //     } else {
    //       const otherMembership = allconversationsMemberships.filter(
    //         (membership) => membership.memberId !== currentUser._id
    //       )[0];
    //       const otherMember = await ctx.db.get(otherMembership.memberId);

    //       return {
    //         conversation,
    //         otherMember,
    //         lastMessage,
    //       };
    //     }
    //   })
    // );

    // return conversionsWithDetails;

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await ctx.db.get(
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1
        );

        if (!friend) {
          throw new ConvexError("friend not found");
        }
        return friend;
      })
    );

    return friends;
  },
});

// export const createGroup = mutation({
//   args: {
//     members: v.array(v.id("users")),
//     name: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Unauthorized!");
//     }

//     const currentUser = await getUserByClerkId({
//       ctx,
//       clerkId: identity.subject,
//     });
//     if (!currentUser) {
//       throw new ConvexError("User not found!");
//     }

//     const conversationId = await ctx.db.insert("conversations", {
//       isGroup: true,
//       name: args.name,
//     });

//     await Promise.all(
//       [...args.members, currentUser._id].map(async (memberId) =>
//         ctx.db.insert("conversationMembers", {
//           conversationId,
//           memberId,
//         })
//       )
//     );
//   },
// });
