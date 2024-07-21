import NewsletterModel from "~/server/models/Newsletter.model";

export default defineEventHandler(async (event:any) => {
	return await NewsletterModel.find();
});