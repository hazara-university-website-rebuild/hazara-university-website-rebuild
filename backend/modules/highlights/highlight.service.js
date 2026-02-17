import Highlight from "../../models/Highlight.model.js";

export const createHighlight = async (data) => {
  return await Highlight.create(data);
};

export const getVisibleHighlights = async () => {
  return await Highlight.find({ isActive: true }).sort({ order: 1 });
};

export const deleteHighlight = async (id) => {
  return await Highlight.findByIdAndDelete(id);
};