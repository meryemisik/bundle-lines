import WebCaricatures from "~/server/models/WebCaricatures.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const newsUuid = query.newsUuid;

  if (!newsUuid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID gereklidir'
    });
  }

  try {
    const newsletter = await WebCaricatures.findOne({
      'news.content.uuid': newsUuid
    });

    if (!newsletter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Newsletter bulunamadı'
      });
    }

    const filteredNews = newsletter.news.map((newsItem) => {
      const filteredContent = newsItem.content.filter(
        (content) => content.uuid === newsUuid
      );

      if (filteredContent.length > 0) {
        return {
          ...newsItem,
          content: filteredContent
        };
      }
    }).filter(Boolean); 

    return {
      ...newsletter._doc, 
      news: filteredNews
    };
  } catch (error) {
    console.error('Newsletter getirilirken hata oluştu:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Sunucu hatası'
    });
  }
});
