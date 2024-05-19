import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export { Blog };
