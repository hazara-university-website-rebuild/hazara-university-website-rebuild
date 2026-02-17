import * as newsService from "./news.service.js";

export const addNews = async (req, res) => {
  const news = await newsService.createNews(req.body, req.user.id);
  res.status(201).json({ success: true, data: news });
};

export const getAllNews = async (req, res) => {
  const news = await newsService.fetchNews(req.query.category);
  res.status(200).json({ success: true, data: news });
};