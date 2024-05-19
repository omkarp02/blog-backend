import _ from "lodash";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Blog } from "../modals/blogModal.js";
import { sendResponse } from "../utils/helper.js";
import { ErrorHander } from "../utils/errorHander.js";

export const createBlog = catchAsyncErrors(async (req, res, next) => {
  const { title, subTitle, categories, description } = req.body;
  const imgLink = req.file.location;

  console.log(req.user)
  const newBlog = await Blog.create({
    title,
    subTitle,
    categories,
    description,
    imgLink,
    userId: req.user.id,
  });

  sendResponse(req, res, 200, newBlog);
});

export const findOneBlog = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);

  sendResponse(req, res, 200, blog);
});

export const findAllBlog = catchAsyncErrors(async (req, res, next) => {
  const query = _.pick(["title", "categories"], req.query);

  const blogs = await Blog.find(query);

  sendResponse(req, res, 200, blogs);
});

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { title, subTitle, description, id } = req.body;

  const user = await Blog.findByIdAndUpdate(id, {
    title,
    subTitle,
    description,
  });

  sendResponse(req, res, 200, user);
});

export const deleteOneBlog = catchAsyncErrors(async (req, res, next) => {
  const data = await Blog.deleteOne({ _id: req.params.id });
  if (data.deletedCount === 0) {
    return next(new ErrorHander("Blog not found", 400));
  }

  sendResponse(req, res, 200, { msg: "Blog Deleted Successfully" });
});
