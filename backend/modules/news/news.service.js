import News from "../../models/News.model.js";

export const createNews = async (newsData, authorId) => {
  return await News.create({ ...newsData, author: authorId });
};

export const fetchNews = async (category) => {
  const filter = category ? { category } : {};
  return await News.find(filter).sort({ createdAt: -1 }); // Latest first
};