import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Payment from "@/model/payment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getUserPayments(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// GET /api/payments/user/:userId → Get user's payments
const getUserPayments = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const payments = await Payment.find({ userId }).populate("bookingId");

    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this user" });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user payments", error });
  }
};
