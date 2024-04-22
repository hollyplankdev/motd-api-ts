import { RequestHandler } from "express";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";
import { FilterQuery } from "mongoose";
import { MessageOfTheDay } from "@motd-ts/models";

/**
 * Creates a new MOTD with a given message.
 *
 * @param req.body.message The actual message contents for the new MOTD
 */
export const create: RequestHandler = async (req, res) => {
  console.log(`Trying create MOTD...`);
  const motd = await MessageOfTheDayModel.create({ message: req.body.message });

  // Turn into an object without the verison key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
  console.log(`...Created MOTD w/ id ${motd._id}`);
};

/** Gets the most recently created MOTD. */
export const readLatest: RequestHandler = async (req, res) => {
  console.log(`Trying read latest MOTD...`);
  const motd = await MessageOfTheDayModel.findOne().sort({ createdAt: "descending" });

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Turn into an object without the version key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
  console.log(`...Read latest MOTD (${motd?._id})`);
};

/**
 * Gets an existing MOTD by its id.
 *
 * @param req.params.id The id of the MOTD to read.
 */
export const read: RequestHandler = async (req, res) => {
  console.log(`Trying read MOTD w/ id ${req.params.id}...`);
  const motd = await MessageOfTheDayModel.findById(req.params.id);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Turn into an object without the version key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
  console.log(`...Read MOTD w/ id ${req.params.id}`);
};

/**
 * Updates the contents of an existing MOTD.
 *
 * @param req.params.id The id of the MOTD to update.
 * @param req.body.message The updated message for this MOTD.
 */
export const update: RequestHandler = async (req, res) => {
  console.log(`Trying update MOTD w/ id ${req.params.id}...`);
  const motd = await MessageOfTheDayModel.findById(req.params.id);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Update the object, save it, and SEND!
  motd.message = req.body.message;
  await motd.save();
  res.status(200).send(motd.toObject({ versionKey: false }));
  console.log(`...Updated MOTD w/ id ${req.params.id}...`);
};

/**
 * Deletes an existing MOTD.
 *
 * @param req.params.id The id of the MOTD to delete.
 */
export const remove: RequestHandler = async (req, res) => {
  console.log(`Trying remove MOTD w/ id ${req.params.id}...`);
  const result = await MessageOfTheDayModel.deleteOne({ _id: req.params.id });

  // If there's no MOTD... EXIT EARLY!
  if (result.deletedCount <= 0) {
    res.status(404).send();
    return;
  }

  // OTHERWISE - we did delete one!
  res.status(200).send();
  console.log(`...Removed MOTD w/ id ${req.params.id}`);
};

/**
 * Lists existing MOTDs, sorted by date in descending order. Results are paginated.
 *
 * @param req.query.lastPageKey OPTIONAL - The page key to start at, if paginating. This should be
 *   the value of `pageKey` from a previous call.
 * @param req.query.pageSize OPTIONAL - The max number of entries per-page.
 */
export const list: RequestHandler = async (req, res) => {
  console.log(`Trying to list MOTDs...`);

  // Create the search query depending on if we have a starting page key
  const searchQuery: FilterQuery<MessageOfTheDay> = {};
  if (req.query.lastPageKey) {
    // Last page key is actually just the createdAt date of the last processed
    // document, encoded as an integer - so that's why we parse it here.
    searchQuery.createdAt = { $lt: new Date(parseInt(req.query.lastPageKey as string, 10)) };
  }

  // Search for MOTDs, making sure to search in order and start/stop in a paginated way.
  const pageSize: number = parseInt(req.query.pageSize as string, 10);
  const foundItems = await MessageOfTheDayModel.find(searchQuery)
    .limit(pageSize)
    .sort("-createdAt")
    .select("-__v")
    .lean();

  // Calculate the lastPageKey of THIS REQUEST. The page key is just the createdAt date of the
  // last processed document, encoded as an integer.
  const rawPageKey =
    foundItems.length > 0 ? foundItems[foundItems.length - 1].createdAt : undefined;
  const pageKey = rawPageKey ? rawPageKey.valueOf() : undefined;

  // RESPOND!
  res
    .status(200)
    .contentType("json")
    .send(
      JSON.stringify({
        pageKey,
        items: foundItems,
      }),
    );
  console.log(`...Listed ${foundItems.length} MOTDs`);
};
