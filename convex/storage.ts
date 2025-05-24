import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getUserByClerkId } from "./_utils";
import { storage } from "./_generated/server";

// Generate a URL to upload an image or file
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Generate a URL for uploading
    // The URL will be short-lived, typically 60 minutes
    return await ctx.storage.generateUploadUrl();
  },
});

// Save a storage ID to a file
export const saveStorageId = mutation({
  args: {
    fileId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
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

    // Check if the user is part of the conversation
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

    // Create a message for the image/file
    const messageType = args.fileType.startsWith("image/") ? "image" : "file";

    // Create a new message with the file URL
    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      type: messageType,
      content: [
        args.fileId,
        args.fileName,
        args.fileType,
        args.fileSize.toString(),
      ],
    });

    // Update the conversation's lastMessageId
    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});

// Get a URL to download a file from storage
export const getStorageUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    try {
      return await ctx.storage.getUrl(args.storageId);
    } catch (error) {
      console.error("Error getting storage URL:", error);
      return null;
    }
  },
});
