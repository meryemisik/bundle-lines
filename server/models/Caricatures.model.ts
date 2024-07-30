import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
	{
		title: {
			type: String,
			requied: false,
		},
		sponsor: {
			type: String,
			requied: false,
		},
		sponsorImage:{
			type: Array,
			requied: false,
		},
		news: {
			type: Array,
			requied: false,
		},
		analyticsId:{
			type: String,
			requied: false,
		},
		campaignName:{
			type: String,
			requied: false,
		},
		creator:{
			type: String,
			requied: false,
		},
		likeCount:{
			type: Number,
			requied: false,
		},
	},
	{ timestamps: true }
);


export default mongoose.model("Caricatures", schema);
