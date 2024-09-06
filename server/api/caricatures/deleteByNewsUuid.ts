import CaricaturesModel from "~/server/models/Caricatures.model";
import { createError, defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const uuid = query.uuid;

  if (!uuid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'UUID is required',
    });
  }

  try {
    const result = await CaricaturesModel.updateOne(
      { 'news.content.uuid': uuid }, 
      { $pull: { 'news.$.content': { uuid } } } 
    );

    if (result.modifiedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News item with this UUID not found',
      });
    }

    return { message: 'News item removed successfully' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    });
  }
});
