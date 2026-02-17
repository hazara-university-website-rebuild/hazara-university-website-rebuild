import * as vcService from "./vc.service.js";
import { NotFoundError } from "../../errors/index.js";

/**
 * Update or Create the VC Message
 * Uses upsert logic to ensure there is always exactly one active message
 */
export const updateVC = async (req, res) => {
  const vcData = await vcService.upsertVCMessage(req.body);

  if (!vcData) {
    // Should rarely happen, but handled for safety
    throw new Error("Failed to upsert VC message"); 
  }

  res.status(200).json({
    success: true,
    message: "Vice Chancellor message updated successfully",
    data: vcData,
  })
}


/**
 * Get the active VC Message for the Home Page
 * Publicly accessible for the frontend display
 */
export const getVC = async (req, res) => {
  const vcData = await vcService.getActiveVCMessage();

  if (!vcData) {
    throw new NotFoundError("No active Vice Chancellor message found");
  }

  res.status(200).json({
    success: true,
    data: vcData,
  })
}
