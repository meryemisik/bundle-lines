import UploadAwsFile from "~/server/models/UploadAwsFile.model";

export default defineEventHandler(async (event:any) => {
	const body = await readBody(event);
	try {
		await UploadAwsFile.create(body);
		return { message: "Newsletter created" };
	} catch (e) {
		throw createError({
			message: e.message,
		});
	}
});