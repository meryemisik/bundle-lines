import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    news: {
      type: Array,
      requied: false,
    },
    analyticsId: {
      type: String,
      requied: false,
    },
    campaignName: {
      type: String,
      requied: false,
    },
    likeCount: {
      type: Number,
      requied: false,
    },
    randomLikeCount: {
      type: Number,
      requied: false,
    },
    caricaturist: {
      type: String,
      requied: false,
    },
    isDeleted: {  
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("WebCaricatures", schema);
