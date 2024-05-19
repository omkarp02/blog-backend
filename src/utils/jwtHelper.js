import { readFileSync } from "fs";
import { TOKEN_TYPE } from "./constants/jwt.js";
import jwt from "jsonwebtoken";
import { config } from "../config/configuration.js";

//keys for jwttoken
const jwtPrivateKey = readFileSync("src/config/keys/jwt-private.key", "utf8");
const jwtPublicKey = readFileSync("src/config/keys/jwt-public.key", "utf8");

//keys for refresh token
const refreshPrivateKey = readFileSync(
  "src/config/keys/refresh-private.key",
  "utf8"
);
const refreshPublicKey = readFileSync(
  "src/config/keys/refresh-public.key",
  "utf8"
);

export const signToken = (data, tokenType, signOptions) => {
  const key = tokenType === TOKEN_TYPE.jwt ? jwtPrivateKey : refreshPrivateKey;
  const expiry =
    tokenType === TOKEN_TYPE.jwt
      ? config.jwtTokenExpiry
      : config.refreshTokenExpiry;

  if (!signOptions) {
    signOptions = {
      issuer: "Omkar",
      expiresIn: expiry,
      algorithm: "RS256",
    };
  }

  return jwt.sign(data, key, signOptions);
};

export const validateToken = (tokenType, token, signOptions) => {
  const key = tokenType === TOKEN_TYPE.jwt ? jwtPublicKey : refreshPublicKey;
  const expiry =
    tokenType === TOKEN_TYPE.jwt
      ? config.jwtTokenExpiry
      : config.refreshTokenExpiry;

  if (!signOptions) {
    signOptions = {
      issuer: "Omkar",
      expiresIn: expiry,
      algorithm: "RS256",
    };
  }

  return jwt.verify(token, key, signOptions);
};

export const generateRefreshToken = async (refreshToken) => {
  const tokenData = validateToken(TOKEN_TYPE.refresh, refreshToken);

  const id = new Types.ObjectId(tokenData._id);
};
