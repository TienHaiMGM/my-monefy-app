// components/TransactionList.tsx
"use client";
import { useMemo, useState } from 'react';
import { Transaction } from '@/lib/types';
import Modal from './Modal';
import { formatCurrency, formatCurrencyNumber } from '@/lib/utils';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

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


   // ✅ Lọc giao dịch dựa trên từ khóa và điều kiện
   const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchKeyword =
        tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'all' || tx.type === typeFilter;

      const matchMin = minAmount ? tx.amount >= parseFloat(minAmount) : true;
      const matchMax = maxAmount ? tx.amount <= parseFloat(maxAmount) : true;

      return matchKeyword && matchType && matchMin && matchMax;
    });
  }, [transactions, searchTerm, typeFilter, minAmount, maxAmount]);
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
                      <span>{formatCurrencyNumber(val.total)}₫</span>
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
      <div className="space-y-4">
        {/* 🔍 Bộ lọc tìm kiếm */}
        <div className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Tìm theo ghi chú hoặc danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded col-span-2"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="border p-2 rounded"
          >
            <option value="all">Tất cả</option>
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Từ ₫"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Đến ₫"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Danh sách giao dịch đã lọc */}
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy giao dịch phù hợp.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTransactions.map(tx => (
              <li
                key={tx.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{tx.category}</p>
                  <p className="text-sm text-gray-500">{tx.note}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.amount.toLocaleString()}₫
                  </p>
                  <div className="flex gap-2 mt-1 justify-end">
                    <button onClick={() => onEdit(tx)} className="text-indigo-500">Sửa</button>
                    <button onClick={() => onDelete(tx.id)} className="text-red-500">Xóa</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
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
