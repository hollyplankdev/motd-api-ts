import { MessageOfTheDay, inflateMessageOfTheDay } from "@motd-ts/models";
import makeRequest from "../utils/makeRequest";

/** URL constructor functions. */
const urls = {
  base: () => "motd",
  getLatest: () => `${urls.base()}/`,
  getHistory: () => `${urls.base()}/history`,
  update: (id: string) => `${urls.base()}/${id}`,
  create: () => `${urls.base()}/`,
};

/**
 * Get the latest known MOTD from the API.
 *
 * @returns The latest MOTD as an inflated object. undefined if there are no MOTDs.
 */
export async function getLatestMotd(): Promise<MessageOfTheDay | undefined> {
  const response = await makeRequest("GET", urls.getLatest());

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
  const response = await makeRequest("GET", urls.getHistory(), {
    queryParams: { previousLastId, pageSize },
  });
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
  config: {
    accessToken: string;
  },
): Promise<MessageOfTheDay | undefined> {
  const response = await makeRequest("PATCH", urls.update(id), {
    data: newProps,
    authToken: config.accessToken,
  });

  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}

/** Create a new MOTD in the API. */
export async function createMotd(
  newMotd: { message: string },
  config: {
    accessToken: string;
  },
): Promise<MessageOfTheDay | undefined> {
  const response = await makeRequest("POST", urls.create(), {
    data: newMotd,
    authToken: config.accessToken,
  });

  if (response.status !== 200) return undefined;
  return inflateMessageOfTheDay(response.data);
}
