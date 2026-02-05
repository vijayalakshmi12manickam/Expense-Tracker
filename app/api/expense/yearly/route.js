import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year")) || new Date().getFullYear();
    const category = searchParams.get("category") || "all";

    // 🎯 Build match condition dynamically
    const matchStage = {
      date: {
        $gte: new Date(`${year}-01-01T00:00:00Z`),
        $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
      },
    };

    if (category !== "all") {
      matchStage.category = category;
    }

    const result = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $month: "$date" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Fill missing months
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalAmount: 0,
    }));
    result.forEach((m) => (allMonths[m.month - 1] = m));

    return NextResponse.json(allMonths);
  } catch (err) {
    console.error("Error fetching yearly data:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
