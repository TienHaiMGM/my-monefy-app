'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/lib/types'

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')

      if (error) {
        console.error('Lỗi Supabase:', error)
        return
      }

      if (data) {
        setTransactions(data as Transaction[])
      }
    }

    fetchData()
  }, [])

  const month = new Date().toISOString().slice(0, 7)
  const monthlyTransactions = transactions.filter(tx => tx.date.startsWith(month))

  const totalIncome = monthlyTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = monthlyTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard tháng {month}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded-lg">
          <p className="text-xl">💰 Thu nhập tháng này</p>
          <p className="text-2xl font-semibold">{totalIncome.toLocaleString()}₫</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-xl">💸 Chi tiêu tháng này</p>
          <p className="text-2xl font-semibold">{totalExpense.toLocaleString()}₫</p>
        </div>
      </div>
    </div>
  )
}
