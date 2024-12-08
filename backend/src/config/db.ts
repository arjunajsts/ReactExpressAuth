import { DATABASE_URL } from "@/constants/env.js";
import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Successfully connected to DB");
  } catch (error) {
    console.log("Could not connect to database", error);
  }
};
