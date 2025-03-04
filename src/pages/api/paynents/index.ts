import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
// import { v4 as uuidv4 } from "uuid";
import Booking from "@/model/booking";
import Payment from "@/model/payment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getAllPayments(req, res);
    case "POST":
      return processPayment(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// POST /api/payments → Process a payment
const processPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { bookingId, userId, amount, currency, paymentMethod } = req.body;

    if (!bookingId || !userId || !amount || !currency || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Generate a unique transaction ID
    const transactionId = "1234";

    // Create the payment record
    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      currency,
      paymentMethod,
      transactionId,
      status: "pending", // Assume payment is pending until confirmed
    });

    // Simulate payment processing (In a real app, integrate with Stripe, PayPal, etc.)
    const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate simulation
    if (isPaymentSuccessful) {
      payment.status = "successful";
      await payment.save();

      // Update booking status to confirmed
      await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

      return res.status(201).json({ message: "Payment successful", payment });
    } else {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ message: "Payment failed", payment });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
  }
};

const getAllPayments = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payments = await Payment.find().populate("bookingId userId");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};
