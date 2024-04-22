import { RequestHandler } from "express";

export const create: RequestHandler = async (req, res) => {
  console.log(`CREATE:\n\t${JSON.stringify(req.body)}`);
  res.status(200).send(req.body);
};

export const readLatest: RequestHandler = async (req, res) => {};

export const read: RequestHandler = async (req, res) => {
  res.status(200).send("Hello World!");
};

export const update: RequestHandler = async (req, res) => {};

export const remove: RequestHandler = async (req, res) => {};
