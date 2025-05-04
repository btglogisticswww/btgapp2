/**
 * Форматирует дату в локальный формат
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Форматирует цену с валютой
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '-';
  
  try {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${price} ₽`;
  }
}
