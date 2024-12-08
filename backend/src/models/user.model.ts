import { compareValue, hashValue } from "@/utils/bycrypt.js";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  ommitPassward(): Pick<
    UserDocument,
    "_id" | "email" | "verified" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashValue(this.password);
  next();
});

// Add method to compare passwords
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.ommitPassward = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create the User model from the schema
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
