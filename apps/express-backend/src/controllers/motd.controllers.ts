import { RequestHandler } from "express";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";

export const create: RequestHandler = async (req, res) => {
  // Use the given message to create a new MOTD object
  const motd = await MessageOfTheDayModel.create({ message: req.body.message });
  console.log(`Created MOTD w/ id ${motd._id}`);

  // Turn into an object without the verison key and SEND!
  const plainMotd = motd.toObject({ versionKey: false });
  res.status(200).contentType("json").send(plainMotd);
};

export const readLatest: RequestHandler = async (req, res) => {};

export const read: RequestHandler = async (req, res) => {
  const motd = await MessageOfTheDayModel.findById(req.params.id);

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Turn into an object without the verison key and SEND!
  console.log(`Read MOTD w/ id ${motd._id}`);
  const plainMotd = motd.toObject({ versionKey: false });
  res.status(200).send(plainMotd);
};

export const update: RequestHandler = async (req, res) => {};

export const remove: RequestHandler = async (req, res) => {};
