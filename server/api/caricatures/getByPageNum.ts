import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pageNum = parseInt(query.pageNum, 10) || 1; // Sayfa numarası
  const pageSize = 10; // Her sayfada gösterilecek haber sayısı
  const skipCount = (pageNum - 1) * pageSize; // Atlanacak haber sayısı

  try {
    // MongoDB aggregate pipeline
    const caricatures = await CaricaturesModel.aggregate([
      // Objeleri `createdAt` alanına göre tersten sıralama
      { $sort: { createdAt: -1 } }, // -1 tersten sıralama için
      { $unwind: "$news" },
      // Gerekli haberleri atlamak için
      { $skip: skipCount },

      // Sonraki haberleri almak için
      { $limit: pageSize },
     
   
    ]);

    return caricatures;
  } catch (e) {
    console.error("Error fetching paginated caricatures:", e);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
