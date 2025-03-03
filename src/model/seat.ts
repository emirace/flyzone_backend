import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  flightId: mongoose.Schema.Types.ObjectId;
  seatNumber: string;
  class: "economy" | "business" | "first";
  price: number;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    seatNumber: { type: String, required: true },
    class: {
      type: String,
      enum: ["economy", "business", "first"],
      required: true,
    },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Seat = mongoose.models.Seat || mongoose.model<ISeat>("Seat", SeatSchema);
export default Seat;
