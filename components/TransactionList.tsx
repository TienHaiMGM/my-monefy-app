"use client";

import { Transaction } from '@/lib/types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const incomes = transactions.filter(tx => tx.type === 'income');
  const expenses = transactions.filter(tx => tx.type === 'expense');

  const totalIncome = incomes.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);

  const renderList = (list: Transaction[]) => (
    <ul>
      {list.map(tx => (
        <li key={tx.id} className="flex justify-between items-center border-b py-2">
          <div>
            <p className="font-medium">{tx.category}</p>
            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span>{tx.amount.toLocaleString()}₫</span>
            <button
              onClick={() => onDelete(tx.id)}
              className="text-red-500 hover:text-red-700"
            >
              Xóa
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột Thu nhập */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Thu nhập</h2>
        {renderList(incomes)}
        <div className="border-t pt-4 mt-4 text-green-600 font-semibold text-right">
          Tổng Thu nhập: {totalIncome.toLocaleString()}₫
        </div>
      </div>

      {/* Cột Chi tiêu */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Chi tiêu</h2>
        {renderList(expenses)}
        <div className="border-t pt-4 mt-4 text-red-500 font-semibold text-right">
          Tổng Chi tiêu: {totalExpense.toLocaleString()}₫
        </div>
      </div>
    </div>
  );
}
