import { MessageOfTheDay, inflateMessageOfTheDay } from "@motd-ts/models";
import axios from "axios";

const address: string = "http://localhost:30330";

export async function getLatestMotd(): Promise<MessageOfTheDay | undefined> {
  const response = await axios.get(`${address}/`);
  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}

export function getMotd() {}
