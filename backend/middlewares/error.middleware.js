// src/middlewares/errorMiddleware.js

import { AppError } from "../errors/index.js";

export const errorMiddleware = (err, req, res, next) => {

  if (!(err instanceof AppError)) {
    err = new AppError({
      message: err.message || "Internal Server Error",
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      isOperational: false
    });
  }

  const response = {
    success: false,
    error: {
      message: err.message,
      code: err.errorCode,
      statusCode: err.statusCode,
      timestamp: err.timestamp
    }
  };

  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
    response.error.details = err.details;
  }

  res.status(err.statusCode).json(response);
};
