// Helper: format số tiền có dấu ","
export const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/[^\d]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('vi-VN');
  };
  
  export const formatCurrencyNumber = (value: number): string => {
    return value.toLocaleString('vi-VN') + '₫';
  };
  // Helper: chuyển format ngược lại
  export  const parseCurrency = (formatted: string) => {
    return formatted.replace(/[^\d]/g, '');
  };

  