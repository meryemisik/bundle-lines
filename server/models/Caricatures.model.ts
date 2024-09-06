import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      requied: false,
    },
    subTitle: {
      type: String,
      requied: false,
    },
    sponsor: {
      type: String,
      requied: false,
    },
    sponsorImage: {
      type: Array,
      requied: false,
    },
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
    creator: {
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
    addSponsorImage: {
      type: Array,
      requied: false,
    },
    addSponsorUrl: {
      type: String,
      requied: false,
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

export default mongoose.model("Caricatures", schema);
