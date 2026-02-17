import Highlight from "../../models/Highlight.model.js";
import { DatabaseError,NotFoundError } from "../../errors/index.js";

/**
 * Create highlight
 */
export const createHighlight = async (data) => {

  const highlight = await Highlight.create(data);

  if (!highlight)
    throw new DatabaseError("Failed to create highlight");

  return highlight;

};
/**
 * Get all visible highlights
 */
export const getVisibleHighlights = async () => {

  const highlights = await Highlight
    .find({ isActive: true })
    .sort({ order: 1 });

  return highlights;

};


/**
 * Delete highlight
 */
export const deleteHighlight = async (id) => {

  const highlight = await Highlight.findByIdAndDelete(id);

  if (!highlight)
    throw new NotFoundError("Highlight not found");

  return highlight;

};