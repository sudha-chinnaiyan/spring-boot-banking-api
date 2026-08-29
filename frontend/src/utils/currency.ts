/**
 * Formats a numeric value into a currency string representation using internationalization API.
 * Default is New Zealand Dollars (NZD) which aligns with local target recruitment markets.
 */
export const formatCurrency = (value: number, currency: string = 'NZD', locale: string = 'en-NZ'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
