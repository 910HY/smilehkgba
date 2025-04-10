import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 * @param dateString ISO 格式日期字符串
 * @returns 格式化後的日期字符串（例如：2023年4月10日）
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // 如果日期無效，則返回原始字符串
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // 格式化為中文風格日期
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } catch (error) {
    console.error('日期格式化錯誤:', error);
    return dateString;
  }
}
