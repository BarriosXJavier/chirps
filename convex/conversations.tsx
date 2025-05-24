import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
          console.error("Conversation not found:", membership.conversationId);
          // Return null instead of throwing error to prevent UI crashes
          return null;
        }
        return conversation;
      })
    );

    // Get all conversations that a user is a member of

    // Filter out null conversations
    const validConversations = conversations.filter(
      (conversation) => conversation !== null
    );

    const conversionsWithDetails = await Promise.all(
      validConversations.map(async (conversation, index) => {
        // Make sure conversation exists and has an _id before proceeding
        if (!conversation || !conversation._id) {
          console.error("Invalid conversation found:", conversation);
          return { conversation: null };
        }

        const allconversationsMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conversation.lastMessageId,
        });

        try {
          if (conversation.isGroup) {
            return { conversation, lastMessage };
          } else {
            const otherMemberships = allconversationsMemberships.filter(
              (membership) => membership.memberId !== currentUser._id
            );

            // Handle case where there are no other memberships
            if (!otherMemberships.length) {
              console.error(
                "No other members found in conversation:",
                conversation._id
              );
              return { conversation, otherMember: null, lastMessage };
            }

            const otherMembership = otherMemberships[0];
            const otherMember = await ctx.db.get(otherMembership.memberId);

            return {
              conversation,
              otherMember,
              lastMessage,
            };
          }
        } catch (error) {
          console.error("Error processing conversation:", error);
          // Return a minimal safe object
          return { conversation };
        }
      })
    );

    return conversionsWithDetails;
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) {
    return null;
  }

  const message = await ctx.db.get(id);

  if (!message) {
    return null;
  }

  const sender = await ctx.db.get(message.senderId);

  if (!sender) {
    return null;
  }
  const content = getMessageContent(
    message.type,
    message.content as unknown as string
  );

  return {
    content,
    sender: sender.username,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    default:
      return "[Unsupported message type]";
  }
};

export default getLastMessageDetails;
