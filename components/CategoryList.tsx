// components/CategoryList.tsx
"use client";
import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onDelete }: Props) {
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const renderList = (list: Category[]) => (
    <ul>
      {list.map(cat => (
        <li key={cat.id} className="flex justify-between items-center py-2 border-b">
          <span>{cat.name}</span>
          <button
            onClick={() => onDelete(cat.id)}
            className="text-red-500 hover:text-red-700"
          >
            Xóa
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột danh mục thu nhập */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-green-600 font-semibold mb-4">Danh mục Thu nhập</h2>
        {renderList(incomeCategories)}
      </div>

      {/* Cột danh mục chi tiêu */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-red-500 font-semibold mb-4">Danh mục Chi tiêu</h2>
        {renderList(expenseCategories)}
      </div>
    </div>
  );
}
