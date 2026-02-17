import * as highlightService from "./highlight.service.js";

/**
 * Add a new Important Highlight
 * Restricted to Admin via routes
 */
export const addHighlight = async (req, res) => {

  const highlight = await highlightService.createHighlight(req.body);

  res.status(201).json({
    success: true,
    message: "Highlight added successfully",
    data: highlight,
  });

};

/**
 * Get all active Highlights for the Home Page
 * Publicly accessible
 */
export const getHighlights = async (req, res) => {

  const highlights = await highlightService.getVisibleHighlights();

  res.status(200).json({
    success: true,
    count: highlights.length,
    data: highlights,
  });

}