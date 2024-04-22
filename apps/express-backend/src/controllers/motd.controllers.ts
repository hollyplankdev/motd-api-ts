import { RequestHandler } from "express";
import { MessageOfTheDayModel } from "../models/messageOfTheDay";

export const create: RequestHandler = async (req, res) => {
  // Use the given message to create a new MOTD object
  const motd = await MessageOfTheDayModel.create({ message: req.body.message });

  console.log(`CREATE:\n\t${JSON.stringify(motd)}`);
  res.status(200).send(motd);
};

export const readLatest: RequestHandler = async (req, res) => {};

export const read: RequestHandler = async (req, res) => {
  const motd = await MessageOfTheDayModel.findById(req.params.id).lean();

  // If there's no MOTD... EXIT EARLY!
  if (!motd) {
    res.status(404).send();
    return;
  }

  // Send the found MOTD!
  res.status(200).send(motd);
};

export const update: RequestHandler = async (req, res) => {};

export const remove: RequestHandler = async (req, res) => {};
