import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { currencies, Currency } from '@/lib/currency';
import { useCurrency } from '@/contexts/CurrencyContext';

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[8rem] justify-between"
        >
          <span className="mr-1">{selectedCurrency.symbol}</span>
          {selectedCurrency.code}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencies.map((currency) => (
              <CommandItem
                key={currency.code}
                value={currency.code}
                onSelect={() => {
                  setSelectedCurrency(currency);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCurrency.code === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="mr-2">{currency.symbol}</span>
                {currency.code} - {currency.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}