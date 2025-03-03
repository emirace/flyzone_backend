import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Booking from "@/model/booking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getUserBookings(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// GET /api/bookings/user/:userId → Get all bookings of a user
const getUserBookings = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = req.query;
    const bookings = await Booking.find({ userId }).populate("flightId seatId");

    if (!bookings.length)
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};
