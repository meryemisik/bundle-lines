import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event:any) => {
	return await CaricaturesModel.find();
});
