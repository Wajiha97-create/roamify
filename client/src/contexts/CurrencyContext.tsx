import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Currency, currencies } from '@/lib/currency';

// Define the context type
type CurrencyContextType = {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
};

// Create the context with a default value
const CurrencyContext = createContext<CurrencyContextType>({
  selectedCurrency: currencies[0],
  setSelectedCurrency: () => {},
});

// Custom hook for using the currency context
export const useCurrency = () => useContext(CurrencyContext);

// Provider component
export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD

  const value = {
    selectedCurrency,
    setSelectedCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};