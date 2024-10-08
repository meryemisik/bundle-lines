import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event: any) => {
  const query = getQuery(event);
  const id = query.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    });
  }

  try {
    const caricature = await CaricaturesModel.findById(id);
    if (!caricature) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Caricature not found'
      });
    }

    const filteredNews = caricature.news.filter((item: any) => item.isDeleted === false);

    const response = {
      ...caricature._doc, 
      news: filteredNews   
    };

    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    });
  }
});
