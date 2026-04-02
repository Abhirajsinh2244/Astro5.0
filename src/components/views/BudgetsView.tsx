import React, { useEffect } from 'react';
import CategoryReport from '@/components/reports/CategoryReport.tsx';
import MonthlyTrends from '@/components/reports/MonthlyTrends';
import { useTransactions } from '@/hooks/useTransactions';

export default function BudgetsView(): React.JSX.Element {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase animate-pulse">
          Aggregating Analytics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
        <p className="text-sm font-bold text-red-800 uppercase tracking-wide">Analytics Error</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CategoryReport transactions={transactions} />
      <MonthlyTrends transactions={transactions} />
    </div>
  );
}