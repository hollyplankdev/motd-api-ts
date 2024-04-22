import { MessageOfTheDay } from "@motd-ts/models";
import { Schema, model } from "mongoose";

export const MessageOfTheDaySchema = new Schema<MessageOfTheDay>(
  {
    message: { type: String, required: true },
  },
  { _id: true, timestamps: true },
);

export const MessageOfTheDayModel = model("MOTD", MessageOfTheDaySchema);
