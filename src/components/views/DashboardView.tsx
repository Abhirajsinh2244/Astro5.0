// src/components/views/DashboardView.tsx
import React, { useEffect, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import CategoryReport from '@/components/reports/CategoryReport.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardView(): React.JSX.Element {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += tx.amount;
      if (tx.type === 'expense') exp += tx.amount;
    });
    return { totalIncome: inc, totalExpenses: exp, balance: inc - exp };
  }, [transactions]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="text-sm font-bold tracking-widest text-primary uppercase animate-pulse">
          Syncing Ledger Data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-sm font-bold text-destructive uppercase tracking-wide">System Error</p>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col space-y-1.5 mb-8">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Financial Overview</h1>
        <p className="text-lg text-muted-foreground font-medium">Your high-level financial summary at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-black text-foreground tracking-tighter">
              {formatCurrency(balance)}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">
              {formatCurrency(totalIncome)}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-black text-destructive tracking-tighter">
              {formatCurrency(totalExpenses)}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <CategoryReport transactions={transactions} />
      </div>
    </div>
  );
}