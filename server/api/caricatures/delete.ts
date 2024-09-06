import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;

  const result = await CaricaturesModel.updateOne(
    { _id: id },
    { $set: { isDeleted: true } }
  );

  if (result.deletedCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' });
  }

  return { message: 'Document deleted successfully' };
});
