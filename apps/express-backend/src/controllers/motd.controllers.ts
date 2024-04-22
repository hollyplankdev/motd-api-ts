import { RequestHandler } from "express";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";

export const create: RequestHandler = async (req, res) => {
  // Use the given message to create a new MOTD object
  const motd = await MessageOfTheDayModel.create({ message: req.body.message });
  console.log(`Created MOTD w/ id ${motd._id}`);

  // Turn into an object without the verison key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
};

export const readLatest: RequestHandler = async (req, res) => {
  const motd = await MessageOfTheDayModel.findOne().sort({ createdAt: "descending" });
  console.log(`Read latest MOTD (${motd?._id})`);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Turn into an object without the version key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
};

export const read: RequestHandler = async (req, res) => {
  const motd = await MessageOfTheDayModel.findById(req.params.id);
  console.log(`Read MOTD w/ id ${req.params.id}`);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Turn into an object without the version key and SEND!
  res.status(200).send(motd.toObject({ versionKey: false }));
};

export const update: RequestHandler = async (req, res) => {
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
};

export const remove: RequestHandler = async (req, res) => {};
