export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string; // ISO string
    note?: string;
  }

 export type TransactionType = 'income' | 'expense';
  
 export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
  }
  