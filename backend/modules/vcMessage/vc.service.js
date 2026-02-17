import VCMessage from "../../models/VCMessage.model.js";
import { ValidationError, DatabaseError } from "../../errors/index.js";

/**
 * Update or Create the VC Message
 * Uses upsert logic to ensure there is always exactly one active message
 */
export const upsertVCMessage = async (data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new ValidationError("VC message data is required");
  }

  const vcMessage = await VCMessage.findOneAndUpdate(
    { isActive: true }, 
    data, 
    { 
      upsert: true,
      returnDocument: "after",
      runValidators: true, // ensure schema validation
    }
  );

  if (!vcMessage) {
    throw new DatabaseError("Failed to upsert VC message");
  }

  return vcMessage;
};


/**
 * Get the active VC Message
 */
export const getActiveVCMessage = async () => {
  const vcMessage = await VCMessage.findOne({ isActive: true });
  return vcMessage; // returning null is fine, controller will throw NotFoundError
};
