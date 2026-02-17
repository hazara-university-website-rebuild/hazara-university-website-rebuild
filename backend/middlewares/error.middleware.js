import { AppError } from "../errors/index.js";

export const errorMiddleware = (err, req, res, next) => {

   let error = err;

  /*
  ============================================
  Convert Mongoose Validation Error
  ============================================
  */
  if (err.name === "ValidationError") {

    const message = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");

    error = new ValidationError(message);
  }

  /*
  ============================================
  Invalid MongoDB ObjectId
  ============================================
  */
  if (err.name === "CastError") {

    error = new ValidationError(`Invalid ${err.path}: ${err.value}`);
  }

  /*
  ============================================
  Duplicate key error
  ============================================
  */
  if (err.code === 11000) {

    const field = Object.keys(err.keyValue)[0];

    error = new ConflictError(
      `${field} already exists`
    );
  }

  /*
  ============================================
  MongoDB connection errors
  ============================================
  */
  if (err.name === "MongoNetworkError") {

    error = new DatabaseError("Database connection failed");
  }


  if (!(err instanceof AppError)) {
    error = new AppError({
      message: err.message || "Internal Server Error",
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      isOperational: false
    });
  }

  const response = {
    success: false,
    error: {
      message: error.message,
      code: error.errorCode,
      statusCode: error.statusCode,
      timestamp: error.timestamp
    }
  };

  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
    response.error.details = err.details;
  }

  res.status(err.statusCode).json(response);
};
