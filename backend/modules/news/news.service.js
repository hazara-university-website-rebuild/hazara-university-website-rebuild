import News from "../../models/News.model.js";
import {
  NotFoundError,
  DatabaseError,
  ValidationError
} from "../../errors/index.js";


/**
 * Create news
 */
export const createNews = async (newsData, authorId) => {

  if (!authorId)
    throw new ValidationError("Author ID is required");

  const news = await News.create({
    ...newsData,
    author: authorId
  });

  if (!news)
    throw new DatabaseError("Failed to create news");

  return news;
};


/**
 * Fetch news
 */
export const fetchNews = async (category) => {

  const filter = category ? { category } : {};

  const news = await News
    .find(filter)
    .sort({ createdAt: -1 });

  return news;

};
