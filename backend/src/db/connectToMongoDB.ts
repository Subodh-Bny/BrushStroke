import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    if (process.env.MONGO_DB_URI) {
      await mongoose.connect(process.env.MONGO_DB_URI);
      console.log("Connected to database");
    } else {
      throw new Error("Database URI not found");
    }
  } catch (error: any) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;
