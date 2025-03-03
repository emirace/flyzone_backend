import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Booking from "@/model/booking";
import Seat from "@/model/seat";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      return createBooking(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// POST /api/bookings → Create a booking
const createBooking = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId, flightId, seatId } = req.body;

    if (!userId || !flightId || !seatId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the seat is available
    const seat = await Seat.findById(seatId);
    if (!seat || seat.isBooked) {
      return res
        .status(400)
        .json({ message: "Seat is already booked or does not exist" });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      flightId,
      seatId,
      status: "pending",
      paymentStatus: "pending",
    });

    // Mark seat as booked
    await Seat.findByIdAndUpdate(seatId, { isBooked: true });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};
