import WebCaricatures from "~/server/models/WebCaricatures.model";

export default defineEventHandler(async (event: any) => {
  return await WebCaricatures.find({ isDeleted: false }).sort({ createdAt: -1 });
});
