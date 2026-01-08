
import React from "react";

interface FinanceTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value);
};

const FinanceTooltip: React.FC<FinanceTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
      <p className="font-medium">{label}</p>
      <div className="mt-2">
        {payload.map((entry, index) => (
          <div 
            key={`item-${index}`}
            className="flex items-center gap-2"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name === "totalRevenues" 
                ? "Revenus" 
                : entry.name === "totalExpenses" 
                  ? "Dépenses" 
                  : entry.name === "netTotal"
                    ? "Balance Nette"
                    : entry.name}
              : {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceTooltip;
