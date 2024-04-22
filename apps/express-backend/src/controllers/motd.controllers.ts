import { RequestHandler } from "express";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";

export const create: RequestHandler = async (req, res) => {
  console.log(`Trying create MOTD...`);
  const motd = await MessageOfTheDayModel.create({ message: req.body.message });

  // Turn into an object without the verison key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
  console.log(`...Created MOTD w/ id ${motd._id}`);
};

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
