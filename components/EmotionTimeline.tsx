import { Transaction } from '@/lib/types';

const emotionMap = {
  happy: '😄',
  neutral: '😐',
  sad: '😞',
};

export default function EmotionTimeline({ transactions }: { transactions: Transaction[] }) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {sorted.map(tx => (
        <div key={tx.id} className="border-l-4 border-blue-300 pl-4 relative">
          <div className="absolute left-[-20px] top-[2px] text-2xl">{emotionMap[tx.emotion as keyof typeof emotionMap]}</div>
          <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('vi-VN')}</div>
          <div className="font-semibold">{tx.category} - {tx.amount.toLocaleString('vi-VN')}₫</div>
          {tx.note && <div className="text-gray-600 text-sm">📝 {tx.note}</div>}
        </div>
      ))}
    </div>
  );
}
