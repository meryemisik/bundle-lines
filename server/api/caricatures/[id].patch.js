import CaricaturesModel from "~/server/models/Caricatures.model";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params; 
  const { likeCount } = await readBody(event);

  try {
    const updatedCaricature = await CaricaturesModel.findByIdAndUpdate(
      id,
      { likeCount },
      { new: true }
    );

    if (!updatedCaricature) {
      throw new Error("Caricature not found");
    }

    return { message: "Like count updated", data: updatedCaricature };
  } catch (e) {
    console.error("Error updating like count:", e);
    throw createError({
      message: e.message || "An error occurred while updating the like count",
    });
  }
});
