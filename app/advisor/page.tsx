'use client';
import { useEffect, useState } from 'react';
import { getAdviceHistory, saveAdvice, deleteAdvice} from '@/lib/api';

type AdviceItem = {
    id: string;
    prompt: string;
    response: string;
    created_at: string;
  };
  
export default function AdvisorPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AdviceItem[]>([]);

  useEffect(() => {
    getAdviceHistory().then(setHistory).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
  
    setLoading(true);
    setResult('');
  
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult('❌ Lỗi khi gọi AI local');
    } finally {
      setLoading(false);
    }
  };

const lichSuTuVan = async () => {
    await saveAdvice(prompt, result);
    const updated = await getAdviceHistory();
    setHistory(updated);
    setPrompt('');
    setResult('');
}

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">🤖 Tư vấn tài chính AI</h1>

      <textarea
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Nhập thông tin giao dịch, thắc mắc hoặc mục tiêu tài chính..."
        className="w-full p-3 border rounded-md"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Đang phân tích...' : 'Gửi cho AI'}
      </button>

      {result && (
            <div className="bg-white border p-4 rounded shadow whitespace-pre-line space-y-4">
                <div>
                <h2 className="text-lg font-semibold mb-2">📋 Lời khuyên:</h2>
                <p>{result}</p>
                </div>
                <button
                onClick={lichSuTuVan}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                💾 Lưu tư vấn này
                </button>
            </div>
            )}
         <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">🕓 Lịch sử tư vấn tài chính</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">Chưa có lời khuyên nào được lưu.</p>
      ) : (
        <div className="space-y-4">
         {history.map((item: any) => (
            <div key={item.id} className="bg-white p-4 shadow rounded space-y-2">
                <p className="text-sm text-gray-400">
                {new Date(item.created_at).toLocaleString('vi-VN')}
                </p>
                <p className="font-semibold">🧠 Bạn: {item.prompt}</p>
                <p className="text-gray-800 whitespace-pre-line">🤖 AI: {item.response}</p>

                <button
                onClick={async () => {
                    await deleteAdvice(item.id);
                    const updated = await getAdviceHistory();
                    setHistory(updated);
                }}
                className="text-red-500 hover:text-red-700 text-sm"
                >
                🗑️ Xóa tư vấn này
                </button>
            </div>
            ))}
        </div>
      )}
    </div>
    </div>
    
  );
}
