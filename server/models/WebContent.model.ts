import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    sponsor: {
      type: String,
      required: false,
    },
    sponsorImage: {
      type: String,
      required: false,
    },
    isDeleted: {  
      type: Boolean,
      default: false,
    },
    sponsorIsDeleted: {  
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WebContent", schema);
