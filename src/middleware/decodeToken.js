import { TOKEN_TYPE } from "../utils/constants/jwt.js";
import { ErrorHander } from "../utils/errorHander.js";
import { validateToken } from "../utils/jwtHelper.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }
  token = token.replace(/bearer/gim, "").trim();

  const decodedData = validateToken(TOKEN_TYPE.jwt, token);

  req.user = decodedData;

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
