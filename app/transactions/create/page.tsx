import TransactionForm from "@/components/TransactionForm";


export default function CreateTransactionPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Thêm giao dịch mới</h1>
      <TransactionForm />
    </div>
  );
}
