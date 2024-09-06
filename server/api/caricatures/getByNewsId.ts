import CaricaturesModel from "~/server/models/Caricatures.model";

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
    // İç içe geçmiş alanları aramak için `news.content.uuid` olarak sorgu yapıyoruz
    const newsletter = await CaricaturesModel.findOne({
      'news.content.uuid': newsUuid
    });

    if (!newsletter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Newsletter bulunamadı'
      });
    }

    // İlgili news içeriğini filtreleyelim
    const filteredNews = newsletter.news.map((newsItem) => {
      const filteredContent = newsItem.content.filter(
        (content) => content.uuid === newsUuid
      );

      // Sadece ilgili content varsa newsItem'a ekliyoruz
      if (filteredContent.length > 0) {
        return {
          ...newsItem,
          content: filteredContent
        };
      }
    }).filter(Boolean); // Boş olanları temizle

    // Yanıt olarak sadece filtrelenmiş news öğelerini döndürüyoruz
    return {
      ...newsletter._doc, // Diğer alanları da döndürmek için newsletter'ın geri kalanını koruyoruz
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
