"use client";
import { useState, useEffect } from "react";
import { getBudgetByMonth, upsertBudget } from "@/lib/api";

export default function BudgetForm({ month }: { month: string }) {
  const [budget, setBudget] = useState('');
  const [saving, setSaving] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBudget = async () => {
      const data = await getBudgetByMonth(month);
      if (data) {
        setBudget(data.budget_limit.toString());
        setSaving(data.saving_goal.toString());
      }
    };
    fetchBudget();
  }, [month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertBudget(month, parseFloat(budget), parseFloat(saving));
    setStatus("✅ Đã lưu ngân sách!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">📋 Đặt ngân sách cho tháng {month}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>Ngân sách chi tiêu (₫)</label>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Mục tiêu tiết kiệm (₫)</label>
          <input
            value={saving}
            onChange={(e) => setSaving(e.target.value)}
            type="number"
            className="w-full border rounded p-2"
          />
        </div>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
      {status && <p className="text-green-600">{status}</p>}
    </form>
  );
}
