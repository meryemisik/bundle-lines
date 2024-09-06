import WebContent from "~/server/models/WebContent.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;

  const result = await WebContent.updateOne(
    { _id: id },  
    { 
      $set: { 
        sponsorIsDeleted: true,       
      } 
    }
  );
  if (result.matchedCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' });
  }

  return { message: 'Sponsor information deleted successfully' };
});
