import express from "express";
import { s3Upload } from "../utils/s3.js";
import {
  createBlog,
  deleteOneBlog,
  findAllBlog,
  findOneBlog,
  updateBlog,
} from "../controller/blogController.js";
import { authorizeRoles } from "../middleware/decodeToken.js";

const blogRouter = express.Router();

blogRouter.route("/create").post(s3Upload.single("file"), createBlog);
blogRouter.route("/update").put(updateBlog);
blogRouter.route("/delete/:id").delete(authorizeRoles("admin"), deleteOneBlog);
blogRouter.route("/find").get(findAllBlog);
blogRouter.route("/find-one/:id").get(findOneBlog);

export default blogRouter;
