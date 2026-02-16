import * as vcService from "./vc.service.js";

/**
 * Update or Create the VC Message
 * Uses upsert logic to ensure there is always exactly one active message
 */
export const updateVC = async (req, res) => {
  try {
    const vcData = await vcService.upsertVCMessage(req.body);
    
    res.status(200).json({
      success: true,
      message: "Vice Chancellor message updated successfully",
      data: vcData,
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

/**
 * Get the active VC Message for the Home Page
 * Publicly accessible for the frontend display
 */
export const getVC = async (req, res) => {
  try {
    const vcData = await vcService.getActiveVCMessage();
    
    if (!vcData) {
      return res.status(404).json({ 
        success: false, 
        message: "No active Vice Chancellor message found" 
      });
    }

    res.status(200).json({
      success: true,
      data: vcData,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not fetch VC message" 
    });
  }
};