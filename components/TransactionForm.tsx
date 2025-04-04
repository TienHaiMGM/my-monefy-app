// components/TransactionForm.tsx
"use client";
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/api';
import { TransactionType, Category, Transaction } from '@/lib/types';
import { formatCurrency, parseCurrency } from '@/lib/utils';

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
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'sad'>('neutral');


  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setNote(initialData.note || '');
      setDate(initialData.date);
      setCategory(initialData.category);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      type,
      category,
      amount: parseFloat(amount),
      date,
      note,
      emotion,
    });
    resetForm();
  };

  const filteredCategories = categories.filter(cat => cat.type === type);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700">Loại giao dịch</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className="w-full border rounded-md p-2"
        >
          <option value="income">Thu nhập 💰</option>
          <option value="expense">Chi tiêu 💸</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Danh mục</label>
        <select
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="">Chọn danh mục</option>
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
      <label className="block font-medium text-gray-700">Số tiền (₫)</label>
      <input
        required
        inputMode="numeric"
        value={formatCurrency(amount)}
        onChange={(e) => setAmount(parseCurrency(e.target.value))}
        placeholder="Ví dụ: 500,000"
        className="w-full border rounded-md p-2"
      />
      {/* Gợi ý nhập nhanh */}
      <div className="flex flex-wrap gap-2 mt-2">
        {[20000, 30000, 50000, 100000, 500000].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setAmount(suggestion.toString())}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full"
          >
            {suggestion.toLocaleString('vi-VN')}₫
          </button>
        ))}
      </div>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Ngày giao dịch</label>
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700">Ghi chú</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú thêm (nếu có)..."
          className="w-full border rounded-md p-2"
        />
      </div>
    </div>

    <div>
      <label className="block font-medium text-gray-700">Cảm xúc</label>
      <div className="flex gap-3 mt-1">
        {[
          { label: '😄 Vui vẻ', value: 'happy' },
          { label: '😐 Bình thường', value: 'neutral' },
          { label: '😞 Hối hận', value: 'sad' }
        ].map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setEmotion(value as any)}
            className={`px-3 py-1 rounded-full border ${
              emotion === value ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md flex-1">
        {initialData ? "Cập nhật giao dịch" : "Thêm giao dịch"}
      </button>
      {initialData && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md flex-1"
        >
          Hủy
        </button>
      )}
    </div>
  </form>
);
}
