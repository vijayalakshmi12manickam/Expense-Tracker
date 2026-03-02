import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Budget from "@/app/models/Budget";
import Expense from "@/app/models/Expense";

export async function getBudgetSpent(budget) {
  const matchStage =
    budget.type === "category"
      ? { category: budget.name }
      : { tags: budget.name };

  // Filter expenses within the budget date range
  matchStage.date = { $gte: budget.startDate, $lte: budget.endDate };

  const result = await Expense.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
  ]);

  return result[0]?.totalSpent || 0;
}

export async function GET() {
  await connectDB();
  const budgets = await Budget.find();

  const result = [];

  for (const b of budgets) {
    const spent = await getBudgetSpent(b);
    const percentUsed = (spent / b.limit) * 100;

    result.push({
      ...b.toObject(),
      spent,
      remaining: b.limit - spent,
      percentUsed: Math.min(percentUsed, 100),
    });
  }

  return NextResponse.json(result);
}
