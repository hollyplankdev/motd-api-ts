/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";

const read: RequestHandler = async (req, res) => {
  res.status(200).send("Hello World!");
};

export default {
  read,
};
