import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
	{
		title: {
			type: String,
			requied: true,
		},
		sponsor: {
			type: String,
			requied: true,
		},
		news: {
			type: Array,
			requied: true,
		},
	},
	{ timestamps: true }
);


export default mongoose.model("Caricatures", schema);
