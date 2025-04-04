import "./globals.css";
import NavLink from "@/components/Navlink";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
    <body className="bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center gap-6 px-4 py-4">
          <NavLink  href="/" >💰 MyFinance</NavLink >
          <div className="flex gap-4">
            <NavLink  href="/" >Dashboard</NavLink >
             <NavLink  href="/transactions" >Giao dịch</NavLink >
             <NavLink href="/statistics">Thống kê</NavLink>
             <NavLink  href="/budgets" >Ngân sách chi tiêu</NavLink >
            <NavLink  href="/categories" >Danh mục</NavLink >
            <NavLink  href="/advisor" >AI</NavLink >
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </body>
  </html>
  );
}
