"use client";

import { useState } from 'react';
import { TransactionType } from '../lib/types';

export default function TransactionForm({ onAdd }: { onAdd: (transaction: any) => void }) {
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      type,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      note,
    });
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
      <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="w-full border rounded p-2 mb-3">
        <option value="income">Thu nhập</option>
        <option value="expense">Chi tiêu</option>
      </select>

      <input
        required
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Danh mục"
        className="w-full border rounded p-2 mb-3"
      />

      <input
        required
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Số tiền"
        className="w-full border rounded p-2 mb-3"
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú (không bắt buộc)"
        className="w-full border rounded p-2 mb-3"
      />

      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Thêm giao dịch
      </button>
    </form>
  );
}
