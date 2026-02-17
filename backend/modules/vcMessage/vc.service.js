import VCMessage from "../../models/VCMessage.model.js";

export const upsertVCMessage = async (data) => {
  // We can choose to update the existing one or create a new one
  return await VCMessage.findOneAndUpdate(
    { isActive: true }, 
      data, 
    { 
      upsert: true,
      returnDocument: "after" 
    }
  );
};

export const getActiveVCMessage = async () => {
  return await VCMessage.findOne({ isActive: true });
};