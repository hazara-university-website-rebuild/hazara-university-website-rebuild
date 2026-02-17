import * as sliderService from "./slider.service.js";

export const addSlide = async (req, res) => {
  const slide = await sliderService.createSlide(req.body);
  res.status(201).json({ success: true, data: slide });
}

export const fetchSlides = async (req, res) => {
  const slides = await sliderService.getActiveSlides();
  res.status(200).json({ success: true, data: slides });
}