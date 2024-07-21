import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    imgSrc: {
      type: String,
      required: true,
    },
    fullPostId: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SharedNewsletter", schema);
