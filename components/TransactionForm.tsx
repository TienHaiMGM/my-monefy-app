"use client";

import { useState, useEffect } from 'react';
import { TransactionType, Category } from '@/lib/types';
import { getCategories } from '@/lib/api';

export default function TransactionForm({ onAdd }: { onAdd: (transaction: any) => void }) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);


 // Lấy danh mục từ Supabase mỗi khi chọn type (income/expense)
 useEffect(() => {
  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };
  fetchCategories();
}, []);

// Lọc danh mục theo type
const filteredCategories = categories.filter(cat => cat.type === type);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onAdd({
    id: crypto.randomUUID(),
    type,
    category,
    amount: parseFloat(amount),
    date,
    note,
  });
  setAmount('');
  setNote('');
  setCategory('');
};


  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
      <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="w-full border rounded p-2 mb-3">
        <option value="income">Thu nhập</option>
        <option value="expense">Chi tiêu</option>
      </select>

      <select value={category} required onChange={(e) => setCategory(e.target.value)} className="w-full border rounded p-2 mb-3">
        <option value="">Chọn danh mục</option>
        {filteredCategories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

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
        placeholder="Ghi chú"
        className="w-full border rounded p-2 mb-3"
      />
      <input
        required
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />
      <button className="w-full bg-blue-500 text-white py-2 rounded">Thêm giao dịch</button>
    </form>
  );
}
