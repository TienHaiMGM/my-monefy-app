
"use client";
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/types';
import { getTransactionsByMonth,getBudgetByMonth  } from '@/lib/api';
import BudgetForm from "@/components/BudgetForm";
import { formatCurrencyNumber } from '@/lib/utils';

export default function BudgetPage(){
      const [transactions, setTransactions] = useState<Transaction[]>([]);
      const month = new Date().toISOString().slice(0, 7);
      const [budget, setBudget] = useState<{ budget_limit: number; saving_goal: number } | null>(null);
             useEffect(() => {
        const fetchData = async () => {
        const txs = await getTransactionsByMonth(month);
        setTransactions(txs);
    
        const budgetData = await getBudgetByMonth(month);
        if (budgetData) {
            setBudget({
            budget_limit: budgetData.budget_limit,
            saving_goal: budgetData.saving_goal,
            });
        }
        };
        fetchData();
    }, [month]);
    
    useEffect(() => {
        const fetchData = async () => {
        const data = await getTransactionsByMonth(month);
        setTransactions(data);
        };
        fetchData();
    }, [month]);
    
    // Tổng thu nhập của tháng
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
        // Tổng chi tiêu của tháng
    const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

    const spentPercent = budget ? (totalExpense / budget.budget_limit) * 100 : 0;
    const savedAmount = totalIncome - totalExpense;
    const savedPercent = budget ? (savedAmount / budget.saving_goal) * 100 : 0;
    return(
        <div>  <BudgetForm month={month}/>
        {budget && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">📊 Tiến độ ngân sách & tiết kiệm</h2>
      
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>💼 Ngân sách: {formatCurrencyNumber(budget.budget_limit)}</p>
                  <p>🧾 Chi tiêu: {formatCurrencyNumber(totalExpense)}</p>
                  <div className="h-3 bg-gray-200 rounded mt-2">
                    <div
                      className={`h-3 rounded ${spentPercent > 100 ? 'bg-red-600' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(spentPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    {spentPercent.toFixed(1)}% ngân sách đã sử dụng
                  </p>
                </div>
      
                <div>
                  <p>🎯 Mục tiêu tiết kiệm: {formatCurrencyNumber(budget.saving_goal)}</p>
                  <p>💰 Đã tiết kiệm: {formatCurrencyNumber(savedAmount)}</p>
                  <div className="h-3 bg-gray-200 rounded mt-2">
                    <div
                      className="h-3 bg-blue-500 rounded"
                      style={{ width: `${Math.min(savedPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    {savedPercent.toFixed(1)}% mục tiêu tiết kiệm đã đạt
                  </p>
                </div>
              </div>
            </div>
          )}</div>
       
        
    )
}
