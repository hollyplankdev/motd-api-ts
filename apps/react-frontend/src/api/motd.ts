import { MessageOfTheDay, inflateMessageOfTheDay } from "@motd-ts/models";
import axios from "axios";

const address: string = "http://localhost:30330";

/**
 * Get the latest known MOTD from the API.
 *
 * @returns The latest MOTD as an inflated object. undefined if there are no MOTDs.
 */
export async function getLatestMotd(): Promise<MessageOfTheDay | undefined> {
  const response = await axios.get(`${address}/`);
  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}

/** Get a page of all known MOTDs from the API. */
export async function getMotdHistory({
  previousLastId,
  pageSize,
}: {
  previousLastId?: string;
  pageSize?: number;
}): Promise<{ lastId?: string; items: MessageOfTheDay[] } | undefined> {
  // Request MOTD history from the backend. If there's an error, EXIT EARLY
  const queryParams = { previousLastId, pageSize };
  const response = await axios.get(`${address}/history`, { params: queryParams });
  if (response.status !== 200) return undefined;

  // Format our result data
  return {
    lastId: response.data.lastId,
    items: response.data.items.map((item: MessageOfTheDay) => inflateMessageOfTheDay(item)),
  };
}

/** Get every known MOTD from the API. */
export async function getAllMotdHistory(): Promise<MessageOfTheDay[]> {
  let previousLastId: string | undefined;
  const foundItems: MessageOfTheDay[] = [];

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await getMotdHistory({ previousLastId });
    if (!response) break;

    previousLastId = response.lastId;
    foundItems.push(...response.items);
  } while (previousLastId);

  return foundItems;
}

/** Update the properties of a MOTD in the API. */
export async function updateMotd(
  id: string,
  newProps: { message?: string },
): Promise<MessageOfTheDay | undefined> {
  const response = await axios.patch(`${address}/${id}`, newProps);
  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}

/** Create a new MOTD in the API. */
export async function createMotd(properties: {
  message: string;
}): Promise<MessageOfTheDay | undefined> {
  const response = await axios.post(`${address}`, properties);
  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}
