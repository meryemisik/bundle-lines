import WebCaricatures from "~/server/models/WebCaricatures.model";
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { newsId, likeCount, id } = await readBody(event);
    if (!newsId || !id) {
      throw new Error("Missing newsId or id in request body");
    }
    const caricature = await WebCaricatures.findOneAndUpdate(
      { "news.newsId": newsId }, 
      { $set: { "news.$.likeCount": likeCount } }, 
      { new: true } 
    );

    if (!caricature) {
      throw new Error("Caricature not found");
    }
    return { message: "Like count updated", data: caricature };
  } catch (error) {
    throw createError({
      message: error.message || "An error occurred while updating the like count",
    });
  }
});
