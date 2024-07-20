import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event:any) => {
	const body = await readBody(event);
	try {
		await CaricaturesModel.create(body);
		return { message: "CaricaturesModel created" };
	} catch (e) {
		throw createError({
			message: e.message,
		});
	}
});
