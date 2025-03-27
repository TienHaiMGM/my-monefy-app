// components/TransactionForm.tsx
"use client";
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/api';
import { TransactionType, Category, Transaction } from '@/lib/types';

interface Props {
  initialData?: Transaction;
  onSubmit: (data: Transaction) => void;
  onCancel?: () => void;
}

export default function TransactionForm({ initialData, onSubmit, onCancel }: Props) {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [note, setNote] = useState(initialData?.note || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(initialData?.category || '');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md space-y-3">
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value as TransactionType);
          setCategory('');
        }}
        className="w-full border rounded p-2"
      >
        <option value="income">Thu nhập</option>
        <option value="expense">Chi tiêu</option>
      </select>

      <select
        value={category}
        required
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="">Chọn danh mục</option>
        {filteredCategories.map(cat => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        required
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Số tiền"
        className="w-full border rounded p-2"
      />

      <input
        required
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2"
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú"
        className="w-full border rounded p-2"
      />

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded">
          {initialData ? "Cập nhật giao dịch" : "Thêm giao dịch"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
