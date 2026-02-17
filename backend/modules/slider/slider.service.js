import Slider from "../../models/Slider.model.js";
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../../errors/index.js";


/**
 * Create slide
 */
export const createSlide = async (slideData) => {

  if (!slideData)
    throw new ValidationError("Slide data is required");

  const slide = await Slider.create(slideData);

  if (!slide)
    throw new DatabaseError("Failed to create slide");

  return slide;
};


/**
 * Get all active slides
 */
export const getActiveSlides = async () => {

  const slides = await Slider
    .find({ isActive: true })
    .sort({ order: 1 });

  return slides; // empty array is valid
};


/**
 * Update slide
 */
export const updateSlide = async (id, updateData) => {

  if (!id)
    throw new ValidationError("Slide ID is required");

  const slide = await Slider.findByIdAndUpdate(
    id,
    updateData,
    {
      returnDocument: "after", // production safe (no deprecated warning)
      runValidators: true
    }
  );

  if (!slide)
    throw new NotFoundError("Slide not found");

  return slide;
};


/**
 * Delete slide
 */
export const deleteSlide = async (id) => {

  if (!id)
    throw new ValidationError("Slide ID is required");

  const slide = await Slider.findByIdAndDelete(id);

  if (!slide)
    throw new NotFoundError("Slide not found");

  return slide;
};
