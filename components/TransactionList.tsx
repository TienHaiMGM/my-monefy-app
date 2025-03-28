// components/TransactionList.tsx
"use client";
import { useState } from 'react';
import { Transaction } from '@/lib/types';
import Modal from './Modal';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gộp giao dịch theo danh mục
  const groupedTransactions = transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) {
      acc[tx.category] = { total: 0, items: [] as Transaction[], type: tx.type };
    }
    acc[tx.category].total += tx.amount;
    acc[tx.category].items.push(tx);
    return acc;
  }, {} as Record<string, { total: number; items: Transaction[]; type: string }>);

  const openModal = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const totalIncome = Object.values(groupedTransactions)
  .filter(g => g.type === 'income')
  .reduce((sum, g) => sum + g.total, 0);

const totalExpense = Object.values(groupedTransactions)
  .filter(g => g.type === 'expense')
  .reduce((sum, g) => sum + g.total, 0);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {['income', 'expense'].map((type) => (
          <div key={type} className="bg-white rounded-lg shadow-md p-6">
            <h2 className={`text-xl font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-500'} mb-4`}>
              {type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
            </h2>
            <ul>
              {Object.entries(groupedTransactions)
                .filter(([_, val]) => val.type === type)
                .map(([category, val]) => (
                  <li key={category} className="flex justify-between items-center py-2 border-b">
                    <button onClick={() => openModal(category)} className="text-left hover:underline font-medium">
                      {category} ({val.items.length})
                    </button>
                    <div className="flex items-center gap-3">
                      <span>{val.total.toLocaleString()}₫</span>
                      {/* Nút sửa (edit giao dịch đầu tiên) */}
                      <button
                        onClick={() => onEdit(val.items[0])}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        Sửa
                      </button>
                      {/* Nút xóa (xóa tất cả giao dịch thuộc danh mục này) */}
                      <button
                        onClick={() => val.items.forEach(tx => onDelete(tx.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            {/* Tổng cộng ở cuối cột */}
           <div className={`mt-4 pt-3 border-t text-right font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
             Tổng {type === 'income' ? 'thu nhập' : 'chi tiêu'}: {(type === 'income' ? totalIncome : totalExpense).toLocaleString()}₫
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>
        <ul>
          {groupedTransactions[selectedCategory]?.items.map((tx) => (
            <li key={tx.id} className="py-2 border-b">
              <div className="flex justify-between items-center">
                <span className="font-medium">{tx.amount.toLocaleString()}₫</span>
                <div className="flex gap-2">
                  <button  onClick={() => { onEdit(tx);setIsModalOpen(false);}} className="text-indigo-500">Sửa</button>
                  <button onClick={() => onDelete(tx.id)} className="text-red-500">Xóa</button>
                </div>
              </div>
              {tx.note && <p className="text-sm text-gray-500">📝 {tx.note}</p>}
              <p className="text-xs text-gray-400">{tx.date}</p>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
