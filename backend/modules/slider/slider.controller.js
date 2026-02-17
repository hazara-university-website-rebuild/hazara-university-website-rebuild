import * as sliderService from "./slider.service.js";

export const addSlide = async (req, res) => {
  try {
    const slide = await sliderService.createSlide(req.body);
    res.status(201).json({ success: true, data: slide });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const fetchSlides = async (req, res) => {
  try {
    const slides = await sliderService.getActiveSlides();
    res.status(200).json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};