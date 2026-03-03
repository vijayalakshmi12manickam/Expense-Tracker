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
        $sort: { _id: 1 }, // 1 = ASC, -1 = DESC
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
      result[0].totalAmount = Number.parseFloat(
        result[0].totalAmount.toFixed(2),
      );
      result[0].categories = result[0].categories.map((c) => ({
        ...c,
        total: Number.parseFloat(c.total.toFixed(2)),
      }));
      return result[0];
    } else {
      return { categories: [], totalAmount: 0 };
    }
  };

  //🔹 Fetch both summaries
  const [currentMonth, previousMonth] = await Promise.all([
    getSummary(startOfMonth, endOfMonth),
    getSummary(startOfPrevMonth, endOfPrevMonth),
  ]);

  // 🔹 Merge categories
  const allCategories = new Set([
    ...currentMonth.categories.map((c) => c.category),
    ...previousMonth.categories.map((c) => c.category),
  ]);

  const merged = Array.from(allCategories).map((cat) => {
    const current =
      currentMonth.categories.find((c) => c.category === cat)?.total || 0;
    const previous =
      previousMonth.categories.find((c) => c.category === cat)?.total || 0;
    const difference = Number.parseFloat((current - previous).toFixed(2));
    const percentageChange = previous
      ? Number.parseFloat((Math.abs(difference / previous) * 100).toFixed(2))
      : current > 0
        ? 100
        : 0;

    const trend =
      difference > 0 ? "Increased" : difference < 0 ? "Decreased" : "No change";

    return {
      category: cat,
      current,
      previous,
      difference,
      percentageChange,
      trend,
    };
  });

  const overallDifference = Number.parseFloat(
    (currentMonth.totalAmount - previousMonth.totalAmount).toFixed(2),
  );
  const overallTrend =
    overallDifference > 0
      ? "Increased"
      : overallDifference < 0
        ? "Decreased"
        : "No change";

  return new Response(
    JSON.stringify({
      insights: merged,
      summary: {
        currentMonthTotal: currentMonth.totalAmount,
        previousMonthTotal: previousMonth.totalAmount,
        overallDifference,
        overallTrend,
      },
    }),
    { status: 200 },
  );
}
