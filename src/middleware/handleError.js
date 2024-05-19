import { ErrorHander } from "../utils/errorHander.js";

const errorMiddleware = (err, req, res, next) => {
  err.status = err.status ?? 500;
  err.message = err.message ?? "Internal Server Error";

  console.log(err.code)

    // Wrong Mongodb Id error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHander(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHander(message, 400);
    }

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again `;
      err = new ErrorHander(message, 400);
    }

    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is Expired, Try again `;
      err = new ErrorHander(message, 400);
    }

    console.log(err.message, err.status)



  res.status(err.status).json({
    success: false,
    msg: err.message,
  });
};

export { errorMiddleware };
