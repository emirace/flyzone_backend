import Setting from "@/model/setting";
import dbConnect from "@/utils/dbConnect";
import corsMiddleware, { isAdmin } from "@/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);
  await dbConnect();

  try {
    if (req.method === "GET") {
      let settings = await Setting.findOne();

      // If no settings exist, create default settings
      if (!settings) {
        settings = await Setting.create({
          bankingInfo: {
            accountNumber: "000000000",
            accountName: "Default Account",
            bankName: "Default Bank",
          },
          cryptoInfo: [{
            name: "Bitcoin",
            network: "BTC",
            address: "1BitcoinAddressExample123",
            rate: 1,
          }],
          mail: {
            name: "example@gmail.com",
            password: "1234567890",
          },
        });
      }
      return res.status(200).json(settings);
    }

    if (req.method === "PUT") {
      if (!(await isAdmin(req))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { bankingInfo, cryptoInfo, mail } = req.body;

      if (!bankingInfo || !cryptoInfo || !mail) {
        return res
          .status(400)
          .json({ message: "Banking and Crypto info are required" });
      }

      const updatedSettings = await Setting.findOneAndUpdate(
        {}, // Find first document
        { bankingInfo, cryptoInfo, mail }, // Update fields
        { new: true, upsert: true } // Return updated doc & create if not exists
      );

      return res.status(200).json(updatedSettings);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling settings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
