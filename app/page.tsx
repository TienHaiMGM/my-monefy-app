"use client";
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/types';
import { getTransactionsByMonth, getBudgetByMonth } from '@/lib/api';
import EmotionTimeline from '@/components/EmotionTimeline';
import { getAIPersonalAdvice } from '@/lib/aiAdvisor';

export default function DashboardPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<{ budget_limit: number; saving_goal: number } | null>(null);

  const aiAdvice = getAIPersonalAdvice(transactions, budget?.budget_limit);

  useEffect(() => {
    const fetchData = async () => {
      const txs = await getTransactionsByMonth(selectedMonth);
      setTransactions(txs);

      const budgetData = await getBudgetByMonth(selectedMonth);
      if (budgetData) {
        setBudget({
          budget_limit: budgetData.budget_limit,
          saving_goal: budgetData.saving_goal,
        });
      } else {
        setBudget(null);
      }
    };
    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByDate: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!expenseByDate[t.date]) expenseByDate[t.date] = 0;
      expenseByDate[t.date] += t.amount;
    });

  const expenseEntries = Object.entries(expenseByDate).sort((a, b) => a[0].localeCompare(b[0]));
  let cumulativeExpense = 0;
  const dailyRows = expenseEntries.map(([date, expense]) => {
    cumulativeExpense += expense;
    return {
      date,
      expense,
      income: totalIncome,
      diff: totalIncome - cumulativeExpense,
    };
  }).reverse();

  const spentPercent = budget ? (totalExpense / budget.budget_limit) * 100 : 0;
  const savedAmount = totalIncome - totalExpense;
  const savedPercent = budget ? (savedAmount / budget.saving_goal) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Bộ chọn tháng */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Tổng quan chi tiêu</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Gợi ý từ AI */}
      <div className="bg-white shadow p-4 rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">🤖 Gợi ý từ AI của bạn</h2>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          {aiAdvice.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Thống kê tài chính */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
        <span className="font-medium text-lg">Tổng thu nhập tháng:</span>
        <span className="text-green-600 font-bold text-xl">{totalIncome.toLocaleString()}₫</span>
      </div>
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
        <span className="font-medium text-lg">Tổng chi tiêu tháng:</span>
        <span className="text-red-600 font-bold text-xl">{totalExpense.toLocaleString()}₫</span>
      </div>

      {/* Chi tiêu từng ngày */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">🗓️ Chi tiêu từng ngày</h2>
        <table className="w-full table-auto text-sm md:text-base">
          <thead>
            <tr className="text-left border-b pb-2">
              <th className="py-2">Ngày</th>
              <th className="py-2 text-red-500">Chi tiêu</th>
              <th className="py-2 text-blue-600">Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            {dailyRows.map(({ date, expense, diff }) => (
              <tr key={date} className="border-b">
                <td className="py-2">{new Date(date).toLocaleDateString('vi-VN')}</td>
                <td className="py-2 text-red-500">{expense.toLocaleString()}₫</td>
                <td className={`py-2 font-semibold ${diff >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {diff.toLocaleString()}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline cảm xúc */}
      <h2 className="text-lg font-bold mt-6">📜 Lịch sử giao dịch theo cảm xúc</h2>
      <EmotionTimeline transactions={transactions} />

      {/* Tiến độ ngân sách */}
      {budget && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">📊 Tiến độ ngân sách & tiết kiệm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>💼 Ngân sách: {budget.budget_limit.toLocaleString()}₫</p>
              <p>🧾 Chi tiêu: {totalExpense.toLocaleString()}₫</p>
              <div className="h-3 bg-gray-200 rounded mt-2">
                <div
                  className={`h-3 rounded ${spentPercent > 100 ? 'bg-red-600' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(spentPercent, 100)}%` }}
                />
              </div>
              <p className="text-sm mt-1">{spentPercent.toFixed(1)}% ngân sách đã sử dụng</p>
            </div>

            <div>
              <p>🎯 Mục tiêu tiết kiệm: {budget.saving_goal.toLocaleString()}₫</p>
              <p>💰 Đã tiết kiệm: {savedAmount.toLocaleString()}₫</p>
              <div className="h-3 bg-gray-200 rounded mt-2">
                <div
                  className="h-3 bg-blue-500 rounded"
                  style={{ width: `${Math.min(savedPercent, 100)}%` }}
                />
              </div>
              <p className="text-sm mt-1">{savedPercent.toFixed(1)}% mục tiêu tiết kiệm đã đạt</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
