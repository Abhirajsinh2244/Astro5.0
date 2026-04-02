import React, { useState, useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { type Transaction, CATEGORY_MAP } from '@/lib/types';
import { startOfMonth, startOfYear, subMonths, subYears, isWithinInterval } from 'date-fns';

interface CategoryReportProps {
  transactions: Transaction[];
}

type TimeFrame = 'This Month' | 'Last Month' | 'This Year' | 'Last Year';

// Expanded color palette to comfortably support many custom categories
const CHART_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899',
  '#84cc16', '#14b8a6', '#6366f1', '#a855f7', '#f43f5e', '#f97316', '#0ea5e9'
];

export default function CategoryReport({ transactions }: CategoryReportProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('This Month');

  const { categoryData, pieChartData, totalSpend } = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeFrame) {
      case 'This Month':
        startDate = startOfMonth(now);
        break;
      case 'Last Month':
        startDate = startOfMonth(subMonths(now, 1));
        endDate = startOfMonth(now);
        break;
      case 'This Year':
        startDate = startOfYear(now);
        break;
      case 'Last Year':
        startDate = startOfYear(subYears(now, 1));
        endDate = startOfYear(now);
        break;
    }

    // 1. Scan the database to find EVERY category ever used
    const allCategories = new Set(Object.keys(CATEGORY_MAP));
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        allCategories.add(tx.category);
      }
    });

    // 2. Pre-fill the totals object with 0 for all known categories
    const categoryTotals: Record<string, number> = {};
    allCategories.forEach(cat => {
      categoryTotals[cat] = 0;
    });

    let aggregatedTotal = 0;

    // 3. Sum up the amounts ONLY for the selected timeframe
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0); 

      if (tx.type === 'expense' && isWithinInterval(txDate, { start: startDate, end: endDate })) {
        categoryTotals[tx.category] += tx.amount;
        aggregatedTotal += tx.amount;
      }
    });

    // 4. Map, sort, and assign static colors so the Table and Pie Chart match perfectly
    const mappedData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: aggregatedTotal > 0 ? (amount / aggregatedTotal) * 100 : 0,
      }))
      .sort((a, b) => {
        // Sort by amount first (descending), then alphabetically for $0 items
        if (b.amount !== a.amount) return b.amount - a.amount;
        return a.category.localeCompare(b.category);
      })
      .map((item, index) => ({
        ...item,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

    // Recharts PieChart doesn't render 0-value slices well, so we filter them out for the visual chart
    const activeChartData = mappedData.filter(item => item.amount > 0);

    return { 
      categoryData: mappedData, // Used for the Table (shows everything including $0)
      pieChartData: activeChartData, // Used for the Pie Chart (shows > $0 only)
      totalSpend: aggregatedTotal 
    };
  }, [transactions, timeFrame]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Category Distribution</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Allocation of expenses across all your categories.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          {(['This Month', 'Last Month', 'This Year', 'Last Year'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                timeFrame === tf 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex-1 min-h-\[300px\] flex items-center justify-center relative">
            {pieChartData.length === 0 ? (
              <div className="text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Expenses Found</p>
                <p className="text-xs text-gray-400 mt-2">No data for the selected period.</p>
              </div>
            ) : (
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      strokeWidth={2}
                      stroke="#ffffff"
                      paddingAngle={2}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl text-sm border border-gray-800">
                              <div className="font-bold tracking-wide mb-1 uppercase text-xs text-gray-400">{data.category}</div>
                              <div className="text-gray-100">
                                {data.percentage.toFixed(1)}% <span className="mx-2 text-gray-600">|</span> <span className="text-white font-black">{formatCurrency(data.amount)}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {pieChartData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-gray-900 tracking-tighter">{formatCurrency(totalSpend)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="pb-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Spent</th>
                  <th className="pb-3 text-right w-32 text-xs font-bold text-gray-400 uppercase tracking-widest">Budget %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">No categories mapped yet</td>
                  </tr>
                ) : (
                  categoryData.map((item) => (
                    <tr key={item.category} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-gray-900">
                        {item.category}
                      </td>
                      <td className={`py-4 text-right font-bold ${item.amount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className={`w-10 text-xs font-bold tracking-wider ${item.percentage > 0 ? 'text-gray-500' : 'text-gray-300'}`}>
                            {Math.round(item.percentage)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}