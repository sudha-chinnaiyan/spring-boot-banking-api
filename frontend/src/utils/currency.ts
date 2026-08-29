/**
 * Formats a numeric value into a currency string representation using internationalization API.
 * Default is Indian Rupees (INR) which aligns with local target currency guidelines.
 */
export const formatCurrency = (value: number, currency: string = 'INR', locale: string = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
