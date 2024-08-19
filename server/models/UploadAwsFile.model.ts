import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    newsUuid: {
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

export default mongoose.model("UploadAwsFile", schema);
