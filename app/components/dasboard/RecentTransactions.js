export default function RecentTransactions({ data }) {
  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h3 className="mb-4 font-semibold">Recent Transactions</h3>

      <div className="space-y-3">
        {data.map((txn) => (
          <div key={txn._id} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">{txn.item}</p>
              <p className="text-sm text-gray-500">
                {txn.category} • {txn.bank}
              </p>
            </div>
            <p className="font-semibold">₹ {txn.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
