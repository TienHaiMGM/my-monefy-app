// app/transactions/edit/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/lib/types';
import TransactionForm from '@/components/TransactionForm';
import { updateTransaction } from '@/lib/api';

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();
      if (data) setTransaction(data);
    };
    fetchTransaction();
  }, [id]);

  const handleUpdate = async (updatedData: Transaction) => {
    await updateTransaction(id as string, updatedData);
    router.push('/transactions');
  };

  if (!transaction) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Chỉnh sửa giao dịch</h1>
      <TransactionForm initialData={transaction} onSubmit={handleUpdate} />
    </div>
  );
}
