import Slider from "../../models/Slider.model.js";

export const createSlide = async (slideData) => {
  return await Slider.create(slideData);
};

export const getActiveSlides = async () => {
  return await Slider.find({ isActive: true }).sort({ order: 1 });
};

export const updateSlide = async (id, updateData) => {
  return await Slider.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteSlide = async (id) => {
  return await Slider.findByIdAndDelete(id);
};