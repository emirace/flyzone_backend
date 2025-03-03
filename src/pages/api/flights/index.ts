/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Flight from "@/model/flight";
import corsMiddleware, { isAdmin } from "@/utils/middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getFlights(req, res);
    case "POST":
      return addFlight(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// GET /flights → Search flights with filters
const getFlights = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { date, origin, destination } = req.query;
    const query: any = {};

    if (date) query.departureTime = { $gte: new Date(date as string) };
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    const flights = await Flight.find(query).populate("origin destination");
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST /flights → Add a new flight (Admin only)
const addFlight = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: "Error creating flight", error });
  }
};
