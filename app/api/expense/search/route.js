import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month"); // e.g. "2026-02"
  console.log("sea", monthParam);
  let startOfMonth, endOfMonth;

  if (monthParam) {
    // Parse month input (YYYY-MM)
    const [year, month] = monthParam.split("-").map(Number);
    startOfMonth = new Date(year, month - 1, 1);
    endOfMonth = new Date(year, month, 1);
    // console.log("start", startOfMonth, endOfMonth);
  }

  const [summary] = await Expense.aggregate([
    { $match: { date: { $gte: startOfMonth, $lt: endOfMonth } } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const expenses = await Expense.find({
    date: { $gte: startOfMonth, $lt: endOfMonth },
  }).sort({ date: -1 });
  return new Response(
    JSON.stringify({
      expenses,
      total: summary.total || 0,
      count: summary.count || 0,
    }),
    { status: 200 },
  );
}
