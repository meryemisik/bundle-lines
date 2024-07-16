import mongoose from "mongoose";

const connectDB = async () => {
  const runtimeConfig = useRuntimeConfig();
  try {
    await mongoose.connect(runtimeConfig.mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
