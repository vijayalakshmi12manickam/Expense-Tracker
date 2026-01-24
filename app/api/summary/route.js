import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET() {
  await connectDB();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const summary = await Expense.aggregate([
    {
      $match: { date: { $gte: startOfMonth, $lt: endOfMonth } },
    },
    {
      $group: {
        _id: "$category",
        categoryTotal: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: null,
        categories: {
          $push: { category: "$_id", total: "$categoryTotal" },
        },
        totalAmount: { $sum: "$categoryTotal" },
      },
    },
    { $sort: { total: -1 } },
  ]);
  return new Response(JSON.stringify(summary), { status: 200 });
}
