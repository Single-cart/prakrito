import { format, parseISO } from "date-fns";

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @param formatStr - Optional format string
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr = "MMMM dd, yyyy") {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, length: number) {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}
