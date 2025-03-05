import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Payment from "@/model/payment";
import corsMiddleware from "@/utils/middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getPaymentById(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// GET /api/payments/:id → Get payment details
const getPaymentById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const payment = await Payment.findById(id)
      .populate("bookingId")
      .populate("userId");

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment details", error });
    console.log(error);
  }
};
