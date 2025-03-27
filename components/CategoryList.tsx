"use client";

import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Danh sách danh mục</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center border-b py-2">
            <span>{cat.name} ({cat.type === 'income' ? "Thu nhập" : "Chi tiêu"})</span>
            <button
              onClick={() => onDelete(cat.id)}
              className="text-red-500 hover:text-red-700"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
