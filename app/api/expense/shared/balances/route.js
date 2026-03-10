import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET() {
  await connectDB();

  const currentUser = "You";

  const result = await Expense.aggregate([
    {
      $match: { isShared: true },
    },

    {
      $unwind: "$participants",
    },

    // Remove payer's own share
    {
      $match: {
        $expr: { $ne: ["$participants.name", "$paidBy"] },
      },
    },

    // Create transactions
    {
      $project: {
        from: "$participants.name",
        to: "$paidBy",
        amount: "$participants.amount",
      },
    },

    // Normalize pair
    {
      $addFields: {
        pair: {
          $cond: [
            { $lt: ["$from", "$to"] },
            { a: "$from", b: "$to" },
            { a: "$to", b: "$from" },
          ],
        },
        direction: {
          $cond: [{ $lt: ["$from", "$to"] }, 1, -1],
        },
      },
    },

    {
      $project: {
        a: "$pair.a",
        b: "$pair.b",
        signedAmount: { $multiply: ["$amount", "$direction"] },
      },
    },

    // Net balances per pair
    {
      $group: {
        _id: { a: "$a", b: "$b" },
        balance: { $sum: "$signedAmount" },
      },
    },

    {
      $project: {
        _id: 0,
        from: {
          $cond: [{ $gt: ["$balance", 0] }, "$_id.a", "$_id.b"],
        },
        to: {
          $cond: [{ $gt: ["$balance", 0] }, "$_id.b", "$_id.a"],
        },
        amount: { $abs: "$balance" },
      },
    },

    {
      $match: { amount: { $gt: 0 } },
    },

    // Dashboard calculations
    {
      $facet: {
        settlements: [{ $sort: { to: 1, from: 1 } }],

        owedToYou: [
          { $match: { to: currentUser } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ],

        youOwe: [
          { $match: { from: currentUser } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  const data = result[0];

  const owedToYou = data.owedToYou[0]?.total || 0;
  const youOwe = data.youOwe[0]?.total || 0;

  const response = {
    settlements: data.settlements,
    summary: {
      owedToYou,
      youOwe,
      netBalance: owedToYou - youOwe,
    },
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
