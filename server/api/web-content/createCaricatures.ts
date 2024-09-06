import WebCaricatures from "~/server/models/WebCaricatures.model";

export default defineEventHandler(async (event:any) => {
	const body = await readBody(event);
	try {
		await WebCaricatures.create(body);
		return { message: "WebContent created" };
	} catch (e) {
		throw createError({
			message: e.message,
		});
	}
});