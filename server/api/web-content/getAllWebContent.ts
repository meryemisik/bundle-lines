import WebContent from "~/server/models/WebContent.model";

export default defineEventHandler(async (event:any) => {
	return await WebContent.find().sort({ createdAt: -1 });
});