import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event: any) => {
  const query = getQuery(event);
  const creator = query.creator;

  if (!creator) {
    throw createError({
      statusCode: 400,
      statusMessage: "creator is required",
    });
  }

  try {
    const caricatures = await CaricaturesModel.find({ creator: creator });

    if (caricatures.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "No caricatures found for the given creator",
      });
    }

    return { caricatures };
  } catch (error) {
    console.error(error); 
    throw createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }
});
