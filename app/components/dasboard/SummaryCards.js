export default function SummaryCards({ total }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-gray-500">Total Amount</h3>
        <p className="text-2xl font-bold">
          ₹ {total?.total?.toLocaleString() || 0}
        </p>
      </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-gray-500">Transactions</h3>
        <p className="text-2xl font-bold">{total?.count || 0}</p>
      </div>
    </div>
  );
}
