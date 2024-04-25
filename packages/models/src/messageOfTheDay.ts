/** An object representing some message of the day, or MOTD. */
export interface MessageOfTheDay {
  /** The MongoDB ID that identifies this MOTD. */
  _id: string;

  /** The actual message text contained in this MOTD. */
  message: string;

  /** When this MOTD was initially created. */
  createdAt: Date;

  /** When this MOTD was last updated. */
  updatedAt: Date;
}

/**
 * Given a MOTD, create a clone of the MOTD with inflated data types (dates as strings to Date
 * objects)
 *
 * @param motd The potentially un-inflated MOTD.
 * @returns A new MOTD object that contains inflated dates.
 */
export function inflateMessageOfTheDay(motd: MessageOfTheDay): MessageOfTheDay {
  const newMotd: MessageOfTheDay = { ...motd };
  if (typeof newMotd.createdAt === "string") newMotd.createdAt = new Date(newMotd.createdAt);
  if (typeof newMotd.updatedAt === "string") newMotd.updatedAt = new Date(newMotd.updatedAt);
  return newMotd;
}
