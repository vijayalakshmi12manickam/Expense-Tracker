import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET() {
  await connectDB();

  const currentUser = "You";

  const balances = await Expense.aggregate([
    { $match: { isShared: true } },

    // expand participants
    { $unwind: "$participants" },

    // ignore payer's own share
    {
      $match: {
        $expr: { $ne: ["$participants.name", "$paidBy"] },
      },
    },

    // convert expense to transaction
    {
      $project: {
        from: "$participants.name",
        to: "$paidBy",
        amount: "$participants.amount",
      },
    },

    // merge settlements collection
    {
      $unionWith: {
        coll: "settlements",
        pipeline: [
          {
            $project: {
              from: "$from",
              to: "$to",
              amount: {
                $multiply: ["$amount", -1],
              },
            },
          },
        ],
      },
    },

    // convert relative to current user
    {
      $project: {
        person: {
          $cond: [{ $eq: ["$from", currentUser] }, "$to", "$from"],
        },
        balance: {
          $cond: [
            { $eq: ["$from", currentUser] },
            { $multiply: ["$amount", -1] },
            {
              $cond: [{ $eq: ["$to", currentUser] }, "$amount", 0],
            },
          ],
        },
      },
    },

    { $match: { balance: { $ne: 0 } } },

    {
      $group: {
        _id: "$person",
        balance: { $sum: "$balance" },
      },
    },

    {
      $project: {
        _id: 0,
        person: "$_id",
        balance: 1,
      },
    },
  ]);

  const youAreOwed = balances
    .filter((b) => b.balance > 0)
    .map((b) => ({ person: b.person, amount: b.balance }));

  const youOwe = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({ person: b.person, amount: Math.abs(b.balance) }));

  const owedTotal = youAreOwed.reduce((s, a) => s + a.amount, 0);
  const oweTotal = youOwe.reduce((s, a) => s + a.amount, 0);

  return new Response(
    JSON.stringify({
      summary: {
        totalBalance: owedTotal - oweTotal,
        youOwe: oweTotal,
        youAreOwed: owedTotal,
      },
      youOwe,
      youAreOwed,
    }),
    { status: 200 },
  );
}
