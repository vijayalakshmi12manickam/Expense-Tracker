import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Budget from "@/app/models/Budget";
import Expense from "@/app/models/Expense";

// export async function getBudgetSpent(budget) {
//   const matchStage =
//     budget.type === "category"
//       ? { category: budget.name }
//       : { tags: budget.name };

//   // Filter expenses within the budget date range
//   matchStage.date = { $gte: budget.startDate, $lte: budget.endDate };

//   const result = await Expense.aggregate([
//     { $match: matchStage },
//     { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
//   ]);

//   return result[0]?.totalSpent || 0;
// }

// export async function GET() {
//   await connectDB();
//   const budgets = await Budget.find();

//   const result = [];

//   for (const b of budgets) {
//     const spent = await getBudgetSpent(b);
//     const percentUsed = (spent / b.limit) * 100;

//     result.push({
//       ...b.toObject(),
//       spent,
//       remaining: b.limit - spent,
//       percentUsed: Math.min(percentUsed, 100),
//     });
//   }

//   return NextResponse.json(result);
// }

export async function GET() {
  try {
    await connectDB();

    const summary = await Budget.aggregate([
      // Join budgets with expenses
      {
        $lookup: {
          from: "expenses",
          let: {
            budgetType: "$type",
            budgetName: "$name",
            start: "$startDate",
            end: "$endDate",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ["$date", "$$start"] },
                    { $lte: ["$date", "$$end"] },
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$$budgetType", "category"] },
                            { $eq: ["$category", "$$budgetName"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$$budgetType", "tag"] },
                            {
                              $in: ["$$budgetName", { $ifNull: ["$tags", []] }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "matchedExpenses",
        },
      },
      // Compute total spent
      {
        $addFields: {
          spent: { $sum: "$matchedExpenses.amount" },
        },
      },
      // Calculate remaining & percent
      {
        $addFields: {
          remaining: { $subtract: ["$limit", "$spent"] },
          percentUsed: {
            $multiply: [{ $divide: ["$spent", "$limit"] }, 100],
          },
        },
      },
      // Cleanup unnecessary fields
      {
        $project: {
          matchedExpenses: 0,
          __v: 0,
        },
      },
    ]);

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
