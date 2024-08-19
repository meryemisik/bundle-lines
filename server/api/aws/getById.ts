import UploadAwsFile from "~/server/models/UploadAwsFile.model";

export default defineEventHandler(async (event: any) => {
  const query = getQuery(event);
  const newsUuid = query.newsUuid;
  console.log('newsUuid',newsUuid)

  if (!newsUuid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    });
  }

  try {
    const caricature = await UploadAwsFile.findOne({newsUuid});
    if (!caricature) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Caricature not found'
      });
    }
    return caricature;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    });
  }
});