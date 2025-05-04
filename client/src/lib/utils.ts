import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number or string as a currency
 * @param value The value to format
 * @param currency The currency symbol 
 * @returns A formatted string
 */
export function formatCurrency(value: number | string | null | undefined, currency: string = '₽'): string {
  if (value === null || value === undefined) return '';
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numberValue)) return '';
  
  // Add thousand separators
  const parts = numberValue.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${parts.join('.')} ${currency}`;
}

/**
 * Format a date as a string in Russian format
 * @param date The date to format
 * @returns A date string in DD.MM.YYYY format
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('ru-RU');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Get the status color based on status key
 * @param status The status key
 * @returns An object with background and text color classes
 */
export function getStatusColors(status: string | null | undefined): { bg: string, text: string } {
  if (!status) return { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  switch (status.toLowerCase()) {
    case 'active':
    case 'в пути':
    case 'in_transit':
    case 'accepted':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'pending':
    case 'ожидание':
    case 'waiting':
    case 'pending_approval':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'completed':
    case 'завершен':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'cancelled':
    case 'отменен':
    case 'rejected':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case 'preparing':
    case 'подготовка':
      return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
    case 'available':
    case 'свободен':
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
    case 'maintenance':
    case 'ремонт':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}

/**
 * Calculate progress percentage
 * @param current The current value
 * @param total The total value
 * @returns A number between 0 and 100
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
}

/**
 * Generate a random order number
 * @returns A random order number string
 */
export function generateOrderNumber(): string {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}

/**
 * Extract initials from a name
 * @param name The full name
 * @returns The first letter of each word
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}
