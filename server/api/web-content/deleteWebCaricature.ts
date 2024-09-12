import WebCaricatures from "~/server/models/WebCaricatures.model";
import { createError, defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const newsId = query.newsId;

  if (!newsId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'newsId is required',
    });
  }

  try {
    const result = await WebCaricatures.updateOne(
      { 'news.newsId': newsId }, 
      { $set: { 'news.$[elem].isDeleted': true } },
      { arrayFilters: [{ 'elem.newsId': newsId }] }
    );

    if (result.modifiedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News item with this newsId not found',
      });
    }

    return { message: 'News item updated successfully' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    });
  }
});
