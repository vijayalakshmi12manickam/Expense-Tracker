import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month"); // e.g. "2026-02"
  console.log("monthParam", monthParam);

  // Default to current month if none provided
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-based for Date()

  if (monthParam) {
    // Expecting YYYY-MM format
    const parts = monthParam.split("-");
    if (parts.length === 2) {
      year = Number(parts[0]);
      month = Number(parts[1]) - 1; // JS Date months are 0-indexed
    } else {
      console.warn("⚠️ Invalid monthParam format. Expected 'YYYY-MM'");
    }
  }

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 1);

  console.log("startOfMonth", startOfMonth, "endOfMonth", endOfMonth);

  // Defensive check: Ensure both are valid
  if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
    return new Response(
      JSON.stringify({ error: "Invalid date range. Use format YYYY-MM." }),
      { status: 400 },
    );
  }

  // Aggregate summary
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

  // Fetch expenses list
  const expenses = await Expense.find({
    date: { $gte: startOfMonth, $lt: endOfMonth },
  }).sort({ date: -1 });

  return new Response(
    JSON.stringify({
      expenses,
      total: summary?.total || 0,
      count: summary?.count || 0,
      range: { startOfMonth, endOfMonth },
    }),
    { status: 200 },
  );
}
