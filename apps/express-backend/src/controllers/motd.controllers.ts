import { RequestHandler } from "express";
import {
  createMotd,
  fetchLatestMotd,
  fetchMotd,
  listMotds,
  removeMotd,
  updateMotd,
} from "../services/motd.services";

/**
 * Creates a new MOTD with a given message.
 *
 * @param req.body.message The actual message contents for the new MOTD
 */
export const create: RequestHandler = async (req, res) => {
  console.log(`Trying create MOTD...`);
  const motd = await createMotd(req.body.message);

  res.status(200).send(motd);
  console.log(`...Created MOTD w/ id ${motd._id}`);
};

/** Gets the most recently created MOTD. */
export const readLatest: RequestHandler = async (req, res) => {
  console.log(`Trying read latest MOTD...`);
  const motd = await fetchLatestMotd();

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  res.status(200).send(motd);
  console.log(`...Read latest MOTD (${motd._id})`);
};

/**
 * Gets an existing MOTD by its id.
 *
 * @param req.params.id The id of the MOTD to read.
 */
export const read: RequestHandler = async (req, res) => {
  console.log(`Trying read MOTD w/ id ${req.params.id}...`);
  const motd = await fetchMotd(req.params.id);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  res.status(200).send(motd);
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
  const motd = await updateMotd(req.params.id, req.body.message);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  res.status(200).send(motd);
  console.log(`...Updated MOTD w/ id ${req.params.id}...`);
};

/**
 * Deletes an existing MOTD.
 *
 * @param req.params.id The id of the MOTD to delete.
 */
export const remove: RequestHandler = async (req, res) => {
  console.log(`Trying remove MOTD w/ id ${req.params.id}...`);
  const result = await removeMotd(req.params.id);

  // If there's no MOTD... EXIT EARLY!
  if (result) {
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
  const result = await listMotds({
    lastPageKey: req.query.lastPageKey ? parseInt(req.query.lastPageKey as string, 10) : undefined,
    pageSize: parseInt(req.query.pageSize as string, 10),
  });

  res
    .status(200)
    .contentType("json")
    .send(JSON.stringify({ pageKey: result.pageKey, items: result.items }));
  console.log(`...Listed ${result.items.length} MOTDs`);
};
