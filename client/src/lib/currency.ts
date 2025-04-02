export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD (base currency)
};

export const currencies: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1.0, // Base currency
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92, // Example rate: 1 USD = 0.92 EUR
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.79, // Example rate: 1 USD = 0.79 GBP
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    rate: 153.25, // Example rate: 1 USD = 153.25 JPY
  },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    rate: 1.36, // Example rate: 1 USD = 1.36 CAD
  },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    rate: 1.52, // Example rate: 1 USD = 1.52 AUD
  },
  {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    rate: 7.23, // Example rate: 1 USD = 7.23 CNY
  },
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 83.40, // Example rate: 1 USD = 83.40 INR
  },
  {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    rate: 16.75, // Example rate: 1 USD = 16.75 MXN
  },
  {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    rate: 1.34, // Example rate: 1 USD = 1.34 SGD
  }
];

/**
 * Converts amount from USD to target currency
 * @param amount - Amount in USD
 * @param targetCurrency - Code of target currency
 * @returns Converted amount in target currency
 */
export function convertCurrency(amount: number, targetCurrency: string): number {
  const currency = currencies.find(c => c.code === targetCurrency);
  if (!currency) {
    console.error(`Currency ${targetCurrency} not found`);
    return amount; // Return original amount if currency not found
  }
  return amount * currency.rate;
}

/**
 * Formats currency according to locale and currency code
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function formatCurrencyByCode(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    console.error(`Error formatting currency: ${e}`);
    return `${amount} ${currencyCode}`;
  }
}

/**
 * Gets the currency symbol for a given currency code
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol (e.g., '$', '€')
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || '$'; // Default to $ if not found
}