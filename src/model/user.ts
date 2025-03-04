import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
