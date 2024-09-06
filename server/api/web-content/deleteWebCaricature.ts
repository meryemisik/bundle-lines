import WebCaricatures from "~/server/models/WebCaricatures.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;

  const result = await WebCaricatures.updateOne(
    { _id: id },  
    { 
      $set: { 
        isDeleted: true,       
      } 
    }
  );
  if (result.matchedCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' });
  }

  return { message: 'Caricature deleted successfully' };
});