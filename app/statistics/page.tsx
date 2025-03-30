"use client";
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { getTransactionsByMonth } from '@/lib/api';
import { Transaction } from '@/lib/types';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels);


const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const type = context.label === 'Thu nhập' ? '💰 Thu nhập' : '💸 Chi tiêu';
          return `${type}: ${context.raw.toLocaleString('vi-VN')}₫`;
        },
      },
    },
    datalabels: {
      color: '#000',
      anchor: 'end',
      align: 'top',
      font: {
        weight: 'bold',
      },
      formatter: (value: number) => value.toLocaleString('vi-VN') + '₫',
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value: any) => value.toLocaleString('vi-VN') + '₫',
      },
    },
  },
};


const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.label}: ${context.raw.toLocaleString('vi-VN')}₫`;
        },
      },
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold',
      },
      formatter: (value: number, context: any) => {
        const total = context.chart.data.datasets[0].data.reduce((sum: number, v: number) => sum + v, 0);
        const percent = ((value / total) * 100).toFixed(1);
        return `${value.toLocaleString('vi-VN')}₫\n(${percent}%)`;
      },
    },
  },
};

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function StatisticsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactionsByMonth(month);
      setTransactions(data);
    };
    fetchData();
  }, [month]);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Bar Chart với màu sắc rõ ràng
  const barData = {
    labels: ['Thu nhập', 'Chi tiêu'],
    datasets: [
      {
        label: 'Số tiền (VND)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#4ade80', '#f87171'],
        borderRadius: 6,
      },
    ],
  };

  // Pie Chart với màu sắc đa dạng
  const pieColors = [
    '#f87171', '#facc15', '#60a5fa', '#34d399', '#a78bfa',
    '#fb923c', '#22d3ee', '#f472b6', '#94a3b8', '#84cc16'
  ];

  const pieData = {
    labels: expenseTransactions.map(t => t.category),
    datasets: [
      {
        label: 'Chi tiêu theo danh mục',
        data: expenseTransactions.map(t => t.amount),
        backgroundColor: pieColors.slice(0, expenseTransactions.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Thống kê chi tiêu & thu nhập</h1>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded p-2"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold mb-4">Tổng quan thu nhập và chi tiêu</h2>
          <Bar data={barData} options={barOptions}/>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold mb-4">Phân tích chi tiêu theo danh mục</h2>
          <Pie data={pieData} options={pieOptions}/>
        </div>
      </div>
    </div>
  );
}
