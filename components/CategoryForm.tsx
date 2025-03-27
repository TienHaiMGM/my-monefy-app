"use client";

import { useState } from 'react';
import { Category } from '@/lib/types';

export default function CategoryForm({ onAdd }: { onAdd: (category: Category) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      type,
    });

    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
      <input
        type="text"
        required
        placeholder="Tên danh mục"
        className="w-full border rounded p-2 mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="w-full border rounded p-2 mb-3"
        value={type}
        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
      >
        <option value="income">Danh mục Thu nhập</option>
        <option value="expense">Danh mục Chi tiêu</option>
      </select>
      <button className="w-full bg-indigo-500 text-white py-2 rounded">
        Thêm danh mục
      </button>
    </form>
  );
}
