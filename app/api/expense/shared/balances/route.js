import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import Settlement from "@/app/models/Settlement";

export async function GET() {
  await connectDB();

  const balances = await Expense.aggregate([
    { $match: { isShared: true } },

    { $unwind: "$participants" },

    {
      $match: {
        $expr: { $ne: ["$participants.name", "$paidBy"] },
      },
    },

    {
      $project: {
        from: "$participants.name",
        to: "$paidBy",
        amount: "$participants.amount",
      },
    },

    {
      $unionWith: {
        coll: "settlements",
        pipeline: [
          {
            $project: {
              from: "$from",
              to: "$to",
              amount: { $multiply: ["$amount", -1] },
            },
          },
        ],
      },
    },

    {
      $group: {
        _id: {
          from: "$from",
          to: "$to",
        },
        amount: { $sum: "$amount" },
      },
    },

    // 🔹 Fix negative direction
    {
      $project: {
        from: {
          $cond: [{ $lt: ["$amount", 0] }, "$_id.to", "$_id.from"],
        },
        to: {
          $cond: [{ $lt: ["$amount", 0] }, "$_id.from", "$_id.to"],
        },
        amount: { $abs: "$amount" },
      },
    },

    { $match: { amount: { $gt: 0 } } },

    {
      $sort: {
        from: 1,
        to: 1,
      },
    },
  ]);

  return new Response(
    JSON.stringify({
      settlements: balances,
      count: balances.length,
    }),
    { status: 200 },
  );
}
