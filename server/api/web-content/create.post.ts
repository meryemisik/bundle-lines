import WebContent from "~/server/models/WebContent.model";

export default defineEventHandler(async (event:any) => {
	const body = await readBody(event);
	try {
		await WebContent.create(body);
		return { message: "WebContent created" };
	} catch (e) {
		throw createError({
			message: e.message,
		});
	}
});