import { MessageOfTheDay } from "@motd-ts/models";
import mongoose, { FilterQuery } from "mongoose";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";
import castObjectId from "../utils/castObjectId";

/**
 * Create a new MOTD in the database.
 *
 * @param message The message text of the new MOTD to create.
 * @returns The newly created MOTD in the database, null if missing a param.
 */
export async function createMotd(message: string): Promise<MessageOfTheDay | null> {
  if (!message) return null;

  return (await MessageOfTheDayModel.create({ message })).toObject({
    versionKey: false,
    flattenObjectIds: true,
  });
}

/**
 * Get the most recently created MOTD.
 *
 * @returns The latest MOTD if there is one, null otherwise.
 */
export async function fetchLatestMotd(): Promise<MessageOfTheDay | null> {
  // Get the newest MOTD. If there is none, EXIT EARLY.
  const motd = await MessageOfTheDayModel.findOne().sort({ createdAt: "descending" });
  if (!motd) return null;

  // Simplify and return the MOTD
  return motd.toObject({ versionKey: false, flattenObjectIds: true });
}

/**
 * Get an existing MOTD.
 *
 * @param id The ID of the MOTD to fetch.
 * @returns The MOTD with the matching id, null if there isn't one.
 */
export async function fetchMotd(
  id: string | mongoose.Types.ObjectId | undefined,
): Promise<MessageOfTheDay | null> {
  const correctedId = castObjectId(id);
  if (!correctedId) return null;

  // Get the existing MOTD. If there is none, EXIT EARLY.
  const motd = await MessageOfTheDayModel.findById(correctedId);
  if (!motd) return null;

  // Simplify and return the MOTD
  return motd.toObject({ versionKey: false, flattenObjectIds: true });
}

/**
 * Update the message text of an existing MOTD.
 *
 * @param id The ID of the MOTD to update.
 * @param newMessage The new message text for the MOTD.
 * @returns The newly updated MOTD if one matched the given id, null if there isn't one.
 */
export async function updateMotd(
  id: string | mongoose.Types.ObjectId | undefined,
  newMessage: string,
): Promise<MessageOfTheDay | null> {
  const correctedId = castObjectId(id);
  if (!correctedId) return null;
  if (!newMessage) return null;

  // Get the existing MOTD. If there is none, EXIT EARLY.
  const motd = await MessageOfTheDayModel.findById(correctedId);
  if (!motd) return null;

  // Update the MOTD
  motd.message = newMessage;
  await motd.save();

  // Simplify and return the updated MOTD
  return motd.toObject({ versionKey: false, flattenObjectIds: true });
}

/**
 * Remove an existing MOTD.
 *
 * @param id The ID of the MOTD to delete.
 * @returns True if a MOTD was found and removed, false otherwise.
 */
export async function removeMotd(
  id: string | mongoose.Types.ObjectId | undefined,
): Promise<boolean> {
  const correctedId = castObjectId(id);
  if (!correctedId) return false;

  // Try to remove the MOTD
  const result = await MessageOfTheDayModel.deleteOne({ _id: correctedId });
  return result.deletedCount > 0;
}

/**
 * Fetch a list of existing MOTDs, sorted in descending order by creation date. Results are
 * paginated.
 *
 * @param args.pageSize The number of items to return per-page. While paginating, this value should
 *   stay the same.
 * @param args.lastPageKey OPTIONAL - The value of `pageKey` from a previous call. Use this while
 *   paginating to progress through pages of results.
 * @returns A single page of listed results.
 */
export async function listMotds(args: {
  lastPageKey?: number;
  pageSize: number;
}): Promise<{ pageKey?: number; items: MessageOfTheDay[] }> {
  // Create the search query depending on if we have a starting page key
  const searchQuery: FilterQuery<MessageOfTheDay> = {};
  if (args.lastPageKey) {
    // Last page key is actually just the createdAt date of the last processed
    // document, encoded as an integer - so that's why we parse it here.
    searchQuery.createdAt = { $lt: new Date(args.lastPageKey) };
  }

  // Search for MOTDs, making sure to search in order and start/stop in a paginated way.
  const foundItems = await MessageOfTheDayModel.find(searchQuery)
    .limit(args.pageSize)
    .sort("-createdAt")
    .select("-__v")
    .lean();

  // Calculate the lastPageKey of THIS REQUEST. The page key is just the createdAt date of the
  // last processed document, encoded as an integer.
  const rawPageKey =
    foundItems.length > 0 ? foundItems[foundItems.length - 1].createdAt : undefined;
  const pageKey = rawPageKey ? rawPageKey.valueOf() : undefined;

  return {
    pageKey,
    items: foundItems,
  };
}
