import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { tag } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 0;

    const [summary] = await Expense.aggregate([
      { $match: { tags: tag } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    const expense = await Expense.find({ tags: tag })
      .sort({ date: -1 })
      .limit(limit);

    if (!expense) {
      return NextResponse.json({ message: "Expense not found", status: 404 });
    }

    return new Response(
      JSON.stringify({
        expense,
        total: summary.total || 0,
        count: summary.count || 0,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.log("edi expense errror", err);
    return NextResponse.json({ message: "Server Error", status: 500 });
  }
}
