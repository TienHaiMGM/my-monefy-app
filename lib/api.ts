// lib/api.ts
import { supabase } from '@/lib/supabase';
import { Transaction, Category } from '@/lib/types';

// --- CRUD Transactions ---

// Lấy giao dịch theo tháng
export const getTransactionsByMonth = async (month: string): Promise<Transaction[]> => {
  const fromDate = `${month}-01`;
  const toDate = new Date(new Date(fromDate).getFullYear(), new Date(fromDate).getMonth() + 1, 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// Thêm giao dịch
export const addTransaction = async (transaction: Transaction) => {
  const { error } = await supabase.from('transactions').insert(transaction);
  if (error) throw error;
};

// Xóa giao dịch
export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};

// --- CRUD Categories ---

// Lấy danh sách danh mục
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
};

// Thêm danh mục
export const addCategory = async (category: Category) => {
  const { error } = await supabase.from('categories').insert(category);
  if (error) throw error;
};

// Xóa danh mục
export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};

// Chỉnh sửa giao dịch
export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const { error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id);
  
    if (error) throw error;
  };