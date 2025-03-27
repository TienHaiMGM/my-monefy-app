"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Transaction } from '@/lib/types';
import { getTransactionsByMonth, addTransaction, deleteTransaction } from '@/lib/api';


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchTransactions = async () => {
    const data = await getTransactionsByMonth(month);
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [month]);

  const handleAdd = async (tx: Transaction) => {
    await addTransaction(tx);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <TransactionForm onAdd={handleAdd} />
      <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded p-2" />
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
}
