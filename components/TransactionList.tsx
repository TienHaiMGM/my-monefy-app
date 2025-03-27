"use client";
import { Transaction } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (tx:Transaction) => void;
}

export default function TransactionList({ transactions, onDelete,onEdit }: Props) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const filteredTransactions = transactions.filter(tx => tx.date.startsWith(month));

  const incomes = filteredTransactions.filter(tx => tx.type === 'income');
  const expenses = filteredTransactions.filter(tx => tx.type === 'expense');

  const totalIncome = incomes.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);

  const renderList = (list: Transaction[]) => (
    <ul>
      {list.map(tx => (
        <li key={tx.id} className="flex justify-between items-center border-b py-2">
          <div>
            <p>{tx.category}</p>
            <p className="text-xs text-gray-400">{tx.date}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span>{tx.amount.toLocaleString()}₫</span>
            <button onClick={() => onEdit(tx)} className="text-indigo-500 hover:text-indigo-700">Sửa</button>
            <button onClick={() => onDelete(tx.id)} className="text-red-500">Xóa</button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-green-600 font-semibold mb-2">Thu nhập</h2>
          {renderList(incomes)}
          <div className="border-t mt-3 pt-3 font-semibold text-green-600 text-right">
            Tổng: {totalIncome.toLocaleString()}₫
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-red-500 font-semibold mb-2">Chi tiêu</h2>
          {renderList(expenses)}
          <div className="border-t mt-3 pt-3 font-semibold text-red-500 text-right">
            Tổng: {totalExpense.toLocaleString()}₫
          </div>
        </div>
      </div>
    </>
  );
}
