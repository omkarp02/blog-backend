import express, { application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();
import userRouter from "./routes/userRoutes.js";
import { errorMiddleware } from "./middleware/handleError.js";
import { connectToDatabase } from "./config/database.js";
import cors from 'cors'
import './utils/jwtHelper.js'
import blogRouter from "./routes/blogRoutes.js";
import { isAuthenticatedUser } from "./middleware/decodeToken.js";

console.log(process.env.DB_URI);

const app = express();

app.use(cors())
app.use(bodyParser.json());


//defining routes
app.use("/api/user", userRouter);

app.use(isAuthenticatedUser)

app.use("/api/blog", blogRouter);

//error middleware
app.use(errorMiddleware);

connectToDatabase.then(() => {
  app.listen(process.env.APP_PORT, () => {
    console.log(`connected to port ${process.env.APP_PORT}`);
  });
});

export { app };
