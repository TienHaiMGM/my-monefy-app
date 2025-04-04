import { Transaction } from './types';

export function getAIPersonalAdvice(
  transactions: Transaction[],
  budget?: number
): string[] {
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const categoryStats: Record<string, number> = {};
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const category = tx.category.toLowerCase();
      categoryStats[category] = (categoryStats[category] || 0) + tx.amount;
    });

  const suggestions: string[] = [];

  // 1. Cảnh báo nếu vượt ngân sách
  if (budget && totalExpense > budget) {
    suggestions.push(`🚨 Bạn đã vượt ngân sách tháng này (${totalExpense.toLocaleString()}₫ / ${budget.toLocaleString()}₫). Cần rà soát lại các khoản chi không cần thiết.`);
  } else if (budget && totalExpense > budget * 0.9) {
    suggestions.push(`⚠️ Bạn đã sử dụng hơn 90% ngân sách. Hãy thận trọng với các khoản chi tiếp theo.`);
  }

  // 2. Gợi ý tiết kiệm theo tỉ lệ thu nhập
  const saving = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? (saving / totalIncome) * 100 : 0;

  if (savingRate < 10) {
    suggestions.push(`💡 Tỷ lệ tiết kiệm của bạn thấp (${savingRate.toFixed(1)}%). Hãy thử đặt mục tiêu tiết kiệm ít nhất 20% thu nhập.`);
  } else if (savingRate > 30) {
    suggestions.push(`👏 Bạn đang tiết kiệm rất tốt (${savingRate.toFixed(1)}%). Hãy tiếp tục duy trì thói quen này!`);
  }

  // 3. Cảnh báo theo danh mục tiêu biểu
  const foodExpense = Object.entries(categoryStats).filter(([k]) => k.includes('ăn'))?.[0]?.[1] || 0;
  if (foodExpense > totalExpense * 0.3) {
    suggestions.push('🍜 Ăn uống chiếm hơn 30% chi tiêu. Cân nhắc hạn chế ăn ngoài và nấu ăn tại nhà để tiết kiệm hơn.');
  }

  const shoppingExpense = Object.entries(categoryStats).filter(([k]) => k.includes('mua'))?.[0]?.[1] || 0;
  if (shoppingExpense > totalExpense * 0.25) {
    suggestions.push('🛍️ Mua sắm đang chiếm phần lớn chi tiêu. Hãy ưu tiên mua những món đồ thật sự cần thiết.');
  }

  const transportExpense = Object.entries(categoryStats).filter(([k]) => k.includes('xe') || k.includes('xăng'))?.[0]?.[1] || 0;
  if (transportExpense > totalExpense * 0.15) {
    suggestions.push('🚗 Chi phí di chuyển đang cao. Có thể bạn nên xem xét sử dụng phương tiện công cộng hoặc đi chung xe.');
  }

  // 4. Nếu không có lời khuyên nào đặc biệt
  if (suggestions.length === 0) {
    suggestions.push('🎉 Bạn đang quản lý tài chính rất thông minh! Tiếp tục phát huy nhé.');
  }

  return suggestions;
}
