import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const tags = await Expense.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json(tags);
  } catch (err) {
    console.error("Error fetching tags:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
