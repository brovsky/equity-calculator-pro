// Number formatting utilities

export function formatNumber(value: string | number): string {
  if (typeof value === 'string') {
    // Remove existing commas and format
    const cleaned = value.replace(/,/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US');
  }
  return value.toLocaleString('en-US');
}

export function parseFormattedNumber(value: string): number {
  // Remove commas and parse as number
  const cleaned = value.replace(/,/g, '');
  
  // Return 0 for empty string or just decimal point
  if (cleaned === '' || cleaned === '.') return 0;
  
  const parsed = parseFloat(cleaned);
  
  // Return 0 for NaN to maintain existing behavior, but could be changed to throw error if needed
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyInput(value: string): string {
  // For input fields - format numbers but don't add $ sign
  const cleaned = value.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatSharesInput(value: string): string {
  // Format shares with commas but no decimals
  const cleaned = value.replace(/[^\d]/g, '');
  const num = parseInt(cleaned);
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

// Custom hook for formatted number inputs
export function useFormattedInput(initialValue: string = '') {
  const [displayValue, setDisplayValue] = React.useState(initialValue);
  const [numericValue, setNumericValue] = React.useState(parseFormattedNumber(initialValue));

  const updateValue = (newValue: string) => {
    const formatted = formatCurrencyInput(newValue);
    const numeric = parseFormattedNumber(newValue);
    
    setDisplayValue(formatted);
    setNumericValue(numeric);
  };

  return {
    displayValue,
    numericValue,
    updateValue,
    setDisplayValue,
    setNumericValue
  };
}

// React import for the hook
import React from 'react';