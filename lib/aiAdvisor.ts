import { Transaction } from './types';

export function getAIPersonalAdvice(transactions: Transaction[], budget?: number): string[] {
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const foodExpense = transactions
    .filter(tx => tx.category.toLowerCase().includes('ăn'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const shoppingExpense = transactions
    .filter(tx => tx.category.toLowerCase().includes('mua'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const suggestions: string[] = [];

  if (budget && totalExpense > budget) {
    suggestions.push('🚨 Bạn đã vượt ngân sách tháng này. Hãy kiểm tra lại các khoản chi lớn.');
  }

  if (foodExpense > totalExpense * 0.3) {
    suggestions.push('🍜 Bạn đang chi quá nhiều cho ăn uống. Hãy cân nhắc nấu ăn ở nhà.');
  }

  if (shoppingExpense > totalExpense * 0.25) {
    suggestions.push('🛍️ Mua sắm chiếm phần lớn chi tiêu. Hãy ưu tiên những thứ thực sự cần thiết.');
  }

  if (suggestions.length === 0) {
    suggestions.push('🎉 Bạn đang quản lý tài chính rất tốt! Tiếp tục phát huy nhé.');
  }

  return suggestions;
}
