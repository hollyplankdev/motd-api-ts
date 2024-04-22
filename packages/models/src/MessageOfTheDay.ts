/** An object representing some message of the day, or MOTD. */
export interface MessageOfTheDay {
  /** The MongoDB ID that identifies this MOTD. */
  id: string;

  /** The actual message text contained in this MOTD. */
  message: string;

  /** When this MOTD was initially created. */
  createdAt: Date;

  /** When this MOTD was last updated. */
  updatedAt: Date;
}
