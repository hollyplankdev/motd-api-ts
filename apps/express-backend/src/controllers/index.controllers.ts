import { MessageOfTheDay } from "@motd-ts/models";
import { RequestHandler } from "express";

export const create: RequestHandler = async (req, res) => {
  // Use the given message to create a new MOTD object
  const newMOTD: Partial<MessageOfTheDay> = {
    message: req.body.message,
  };

  // TODO - create the MOTD in the DB

  console.log(`CREATE:\n\t${JSON.stringify(newMOTD)}`);
  res.status(200).send(newMOTD);
};

export const readLatest: RequestHandler = async (req, res) => {};

export const read: RequestHandler = async (req, res) => {
  res.status(200).send("Hello World!");
};

export const update: RequestHandler = async (req, res) => {};

export const remove: RequestHandler = async (req, res) => {};
