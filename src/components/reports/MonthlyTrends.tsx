import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { type Transaction } from '@/lib/types'; // Adjust this import path if your types.ts is located elsewhere
import { format, parseISO, subMonths } from 'date-fns';

interface MonthlyTrendsProps {
  transactions: Transaction[];
}

export default function MonthlyTrends({ transactions }: MonthlyTrendsProps): React.JSX.Element {
  // Aggregation Engine: Processes the trailing 6 months of data
  const chartData = useMemo(() => {
    const monthsMap = new Map<string, { month: string; expenses: number; income: number }>();
    
    // Pre-fill the last 6 months to ensure the chart renders continuous time-series lines 
    // even if a specific month has zero transactions.
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'MMM yyyy');
      monthsMap.set(monthKey, { month: format(date, 'MMM'), expenses: 0, income: 0 });
    }

    // Map transactions to their respective months and calculate aggregates
    transactions.forEach(tx => {
      const txDate = parseISO(tx.date);
      const monthKey = format(txDate, 'MMM yyyy');
      
      if (monthsMap.has(monthKey)) {
        const current = monthsMap.get(monthKey)!;
        if (tx.type === 'expense') current.expenses += tx.amount;
        if (tx.type === 'income') current.income += tx.amount;
      }
    });

    return Array.from(monthsMap.values());
  }, [transactions]);

  // Utility for standardizing currency format in the Y-Axis and Tooltip
  const formatCurrency = (val: number) => {
    if (val === 0) return '₹0';
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Cash Flow Trends</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">6-month trailing comparison of income versus expenses.</p>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Gradient Definitions for the Area Fills */}
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Clean, minimal gridlines */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            {/* X-Axis configured for strong typographic hierarchy */}
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} 
              dy={10} 
            />
            
            {/* Y-Axis configured for strong typographic hierarchy */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} 
              tickFormatter={formatCurrency} 
            />
            
            {/* Custom Interactive Tooltip */}
            <RechartsTooltip 
              cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '4 4' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800 text-white min-w-[160px]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
                        {label}
                      </p>
                      <div className="space-y-3">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-300 capitalize tracking-wide">
                              {entry.name}
                            </span>
                            <span className="font-black tracking-tight" style={{ color: entry.color }}>
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(entry.value as number)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Data Layers */}
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses" 
              stroke="#ef4444" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}