import * as highlightService from "./highlight.service.js";

/**
 * Add a new Important Highlight
 * Restricted to Admin via routes
 */
export const addHighlight = async (req, res) => {
  try {
    const highlight = await highlightService.createHighlight(req.body);
    
    res.status(201).json({
      success: true,
      message: "Highlight added successfully",
      data: highlight,
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

/**
 * Get all active Highlights for the Home Page
 * Publicly accessible
 */
export const getHighlights = async (req, res) => {
  try {
    const highlights = await highlightService.getVisibleHighlights();
    
    res.status(200).json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not fetch highlights" 
    });
  }
};