// middleware/errorHandler.mjs

export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Logs error to console
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
