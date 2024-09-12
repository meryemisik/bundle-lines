import WebCaricatures from "~/server/models/WebCaricatures.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pageNum = parseInt(query.pageNum, 10) || 1;
  const pageSize = 10; 
  const skipCount = (pageNum - 1) * pageSize;

  try {
    const caricatures = await WebCaricatures.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$news" }, 
      { $match: { "news.isDeleted": false } },
      { $sort: { createdAt: -1 } },
      { $skip: skipCount },
      { $limit: pageSize },
    ]);
    return caricatures;
  } catch (e) {
    console.error("Error fetching paginated caricatures:", e);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
