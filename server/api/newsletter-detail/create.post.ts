import NewsletterModel from "~/server/models/Newsletter.model";

export default defineEventHandler(async (event:any) => {
	const body = await readBody(event);
	try {
		await NewsletterModel.create(body);
		return { message: "Newsletter created" };
	} catch (e) {
		throw createError({
			message: e.message,
		});
	}
});