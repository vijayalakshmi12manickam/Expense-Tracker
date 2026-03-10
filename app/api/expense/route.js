import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function POST(request) {
  try {
    await connectDB(); //conect to db
    const data = await request.json(); //parse the request body

    console.log("SERVER RECEIVED DATA:", data);

    const expense = await Expense.create({
      item: data.item,
      bank: data.bank,
      txnType: data.txnType,
      category: data.category,
      date: new Date(data.date),
      amount: Number(data.amount),
      tags: data.tags || [],
      isShared: data.isShared,
      paidBy: data.paidBy || "You",
      splitType: data.splitType || "",
      participants: data.participants || [],
      totalAmount: data.totalAmount || 0,
    }); //Create new expense
    return new Response(JSON.stringify(expense), { status: 201 }); //Return created expense
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create expense" }), {
      status: 500,
    });
  }
}

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  await connectDB();

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
      total: summary?.total || 0,
      count: summary?.count || 0,
    }),
    { status: 200 },
  );
}
