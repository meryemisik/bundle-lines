import WebContent from "~/server/models/WebContent.model";

export default defineEventHandler(async (event:any) => {
  return await WebContent.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(1);
});