import mongoose from "mongoose";

/**
 * Ensure that a given variable is _actually_ an ObjectId type. If the ID is formatted wrong, any
 * exceptions are swallowed and this returns null.
 *
 * @param id The ID to try and cast. If this is already an ObjectId, this will be returned. If this
 *   is an ObjectId formatted as a hex string, it will be converted to an ObjectId.
 * @returns The ObjectId object for this id if correctly formatted, null otherwise.
 */
export default function castObjectId(
  id: string | mongoose.Types.ObjectId | undefined,
): mongoose.Types.ObjectId | null {
  if (!id) return null;

  // If the ID is already the ObjectId type, RETURN IT
  if (typeof id !== "string") return id;

  // OTHERWISE - we for sure have a string. Let's try to parse it as a HEX string.
  // If it's not, we'll just assume this ID is badly formatted
  try {
    return mongoose.Types.ObjectId.createFromHexString(id);
  } catch (e) {
    return null;
  }
}
