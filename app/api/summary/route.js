import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET() {
  await connectDB();
  const now = new Date();
  // current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // 🔹 Previous month range
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getSummary = async (start, end) => {
    const result = await Expense.aggregate([
      {
        $match: { date: { $gte: start, $lt: end } },
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
    ]);

    if (result.length > 0) {
      result[0].totalAmount = parseFloat(result[0].totalAmount.toFixed(2));
      result[0].categories = result[0].categories.map((c) => ({
        ...c,
        total: parseFloat(c.total.toFixed(2)),
      }));
      return result[0];
    } else {
      return { categories: [], totalAmount: 0 };
    }
  };

  //🔹 Fetch both summaries
  const [currentMonthSummary, previousMonthSummary] = await Promise.all([
    getSummary(startOfMonth, endOfMonth),
    getSummary(startOfPrevMonth, endOfPrevMonth),
  ]);

  // 🔹 Merge categories
  const allCategories = new Set([
    ...currentMonthSummary.categories.map((c) => c.category),
    ...previousMonthSummary.categories.map((c) => c.category),
  ]);

  const merged = Array.from(allCategories).map((cat) => ({
    category: cat,
    currentTotal:
      currentMonthSummary.categories.find((c) => c.category === cat)?.total ||
      0,
    previousTotal:
      previousMonthSummary.categories.find((c) => c.category === cat)?.total ||
      0,
  }));

  return new Response(
    JSON.stringify({
      mergedCategories: merged,
      currentMonthTotal: currentMonthSummary.totalAmount,
      previousMonthTotal: previousMonthSummary.totalAmount,
    }),
    { status: 200 },
  );
}
