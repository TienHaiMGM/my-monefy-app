// app/transactions/page.tsx
"use client";
import { useEffect, useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Transaction } from '@/lib/types';
import { getTransactionsByMonth, addTransaction, deleteTransaction, updateTransaction } from '@/lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const data = await getTransactionsByMonth(month);
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [month]);

  const handleAddOrUpdate = async (tx: Transaction) => {
    if (editTransaction) {
      await updateTransaction(editTransaction.id, tx);
      setEditTransaction(null);
    } else {
      await addTransaction(tx);
    }
    fetchTransactions();
  };

  const handleEditClick = (tx: Transaction) => {
    setEditTransaction(tx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditTransaction(null);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        {editTransaction ? 'Cập nhật giao dịch' : 'Thêm giao dịch mới'}
      </h1>
      <TransactionForm
        initialData={editTransaction || undefined}
        onSubmit={handleAddOrUpdate}
        onCancel={handleCancelEdit}
      />
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded p-2"
      />
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEditClick}
      />
    </div>
  );
}
