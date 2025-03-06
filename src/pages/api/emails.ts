import Setting from "@/model/setting";
import dbConnect from "@/utils/dbConnect";
import sendEmail from "@/utils/email";
import corsMiddleware, { isAdmin } from "@/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);
  await dbConnect();

  try {
    if (req.method === "POST") {
      const { to, message, subject } = req.body;

      if (!to || !message) {
        return res
          .status(200)
          .json({ message: "Receipient and Message info are required" });
      }
      if (to === "self") {
        await sendEmail({ to: process.env.EMAIL_USER, subject, text: message });
      } else {
        await sendEmail({ to, subject, text: message });
      }

      return res.status(200).json({ message: "Email sent successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling settings:", error);
    return res.status(200).json({ message: "Internal Server Error" });
  }
}
