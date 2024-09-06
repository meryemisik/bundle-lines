import WebContent from "~/server/models/WebContent.model";

export default defineEventHandler(async (event:any) => {
  return await WebContent.find().sort({ createdAt: -1 }).limit(1);  // En son eklenen kaydı bul ve 1 kayıt döndür
});