import NewsletterModel from "~/server/models/Newsletter.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const imageId = query.imageId;

  if (!imageId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID gereklidir'
    });
  }

  try {
    const newsletter = await NewsletterModel.findOne({ imageId });
    if (!newsletter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Newsletter bulunamadı'
      });
    }
    return newsletter;
  } catch (error) {
    console.error('Newsletter getirilirken hata oluştu:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Sunucu hatası'
    });
  }
});