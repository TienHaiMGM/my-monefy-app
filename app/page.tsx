// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">👋 Chào mừng đến MyFinance!</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/transactions" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h2 className="text-xl font-semibold">💳 Giao dịch</h2>
          <p>Quản lý thu nhập và chi tiêu của bạn.</p>
        </Link>
        <Link href="/categories" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h2 className="text-xl font-semibold">📂 Danh mục</h2>
          <p>Quản lý các danh mục thu nhập và chi tiêu.</p>
        </Link>
      </div>
    </div>
  );
}
