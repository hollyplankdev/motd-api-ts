import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  // Spin up then spindown so that we force the memory server binaries to get downloaded
  const dbInMemory = await MongoMemoryServer.create();
  await dbInMemory.stop();
}
