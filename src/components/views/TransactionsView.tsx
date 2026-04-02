// src/components/views/TransactionsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { type Transaction, type TransactionType, CATEGORY_MAP } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ACCOUNTS = ['Checking', 'Credit Card', 'Savings'];
const STATUSES = ['Cleared', 'Pending'];

export default function TransactionsView(): React.JSX.Element {
  const { data: transactions, isLoading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction } = useTransactions();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Food & Drink',
    description: '',
    amount: '',
    account: 'Checking',
    status: 'Cleared'
  });

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const dynamicCategories = useMemo(() => {
    const baseCats = new Set(Object.keys(CATEGORY_MAP));
    transactions.forEach(tx => baseCats.add(tx.category));
    return Array.from(baseCats).sort();
  }, [transactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'category' && value === 'NEW_CUSTOM_CATEGORY') {
      setIsCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setIsCustomCategory(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      category: 'Food & Drink',
      description: '',
      amount: '',
      account: 'Checking',
      status: 'Cleared'
    });
  };

  const handleEditClick = (tx: Transaction) => {
    setTransactionType(tx.type);
    setEditingId(tx.id);
    setIsCustomCategory(false);
    setFormData({
      date: tx.date,
      merchant: tx.merchant,
      category: tx.category,
      description: tx.description || '',
      amount: tx.amount.toString(),
      account: tx.account,
      status: tx.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { 
      ...formData, 
      category: formData.category.trim(),
      amount: parseFloat(formData.amount), 
      type: transactionType 
    };

    let success = editingId ? await editTransaction(editingId, payload) : await addTransaction(payload);
    if (success) closeModal();
    setIsSubmitting(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchCat = filterCategory === 'All' || t.category === filterCategory;
      const matchAcc = filterAccount === 'All' || t.account === filterAccount;
      let matchDate = true;
      if (startDate && endDate) matchDate = t.date >= startDate && t.date <= endDate;
      return matchCat && matchAcc && matchDate;
    });
  }, [transactions, filterCategory, filterAccount, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCurrency = (amount: number, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Transactions Ledger</h1>
          <p className="text-lg text-muted-foreground font-medium">Manage and filter your secure transaction history.</p>
        </div>
        {error && <Badge variant="destructive" className="px-4 py-1.5 text-sm uppercase tracking-widest">{error}</Badge>}
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date Range</label>
              <div className="flex items-center space-x-2">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full font-medium" />
                <span className="text-muted-foreground font-black text-xs uppercase">To</span>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category Filter</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option value="All">All Categories</option>
                {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account Filter</label>
              <select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option value="All">All Accounts</option>
                {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Records</h2>
          <div className="flex space-x-3">
            <Button variant="default" onClick={() => { setTransactionType('expense'); setIsModalOpen(true); }} className="font-bold tracking-widest uppercase text-xs px-6">
              Record Expense
            </Button>
            <Button variant="outline" onClick={() => { setTransactionType('income'); setIsModalOpen(true); }} className="font-bold tracking-widest uppercase text-xs px-6">
              Record Income
            </Button>
          </div>
        </div>

        <div className="min-h-[400px]">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Merchant</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Description</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">
                    Retrieving Ledger...
                  </TableCell>
                </TableRow>
              ) : currentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm font-medium text-muted-foreground">
                    No transactions map to the current parameters.
                  </TableCell>
                </TableRow>
              ) : (
                currentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group transition-colors">
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">{formatDate(tx.date)}</TableCell>
                    <TableCell className="font-medium text-foreground">{tx.merchant}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{tx.category}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate hidden md:table-cell" title={tx.description}>{tx.description || '—'}</TableCell>
                    <TableCell className={`font-black tracking-tight whitespace-nowrap ${tx.type === 'expense' ? 'text-destructive' : 'text-emerald-600'}`}>
                      {formatCurrency(tx.amount, tx.type)}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{tx.account}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'Cleared' ? 'secondary' : 'outline'} className="uppercase font-bold tracking-wider text-[10px]">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <button onClick={() => handleEditClick(tx)} className="text-[10px] font-black tracking-widest text-emerald-600 hover:text-emerald-800 uppercase transition-all mr-4 opacity-0 group-hover:opacity-100 focus:opacity-100">
                        Edit
                      </button>
                      <button onClick={() => deleteTransaction(tx.id)} className="text-[10px] font-black tracking-widest text-destructive hover:text-red-800 uppercase transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <div className="text-sm font-medium text-muted-foreground">
            Page <span className="font-black text-foreground">{currentPage}</span> of <span className="font-black text-foreground">{totalPages}</span>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-xs font-black uppercase tracking-widest text-foreground disabled:text-muted disabled:cursor-not-allowed hover:underline underline-offset-4">
              Previous
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-xs font-black uppercase tracking-widest text-foreground disabled:text-muted disabled:cursor-not-allowed hover:underline underline-offset-4">
              Next
            </button>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-2xl font-black text-foreground tracking-tighter uppercase">
                {editingId ? 'Modify' : 'Commit'} {transactionType}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</label>
                    <Input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</label>
                    <Input required type="number" step="0.01" min="0.01" name="amount" value={formData.amount} onChange={handleInputChange} className="font-medium" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{transactionType === 'expense' ? 'Merchant' : 'Source'}</label>
                  <Input required type="text" name="merchant" value={formData.merchant} onChange={handleInputChange} className="font-medium" placeholder="Entity name..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                  <Input type="text" name="description" value={formData.description} onChange={handleInputChange} className="font-medium" placeholder="Optional context..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</label>
                    {isCustomCategory ? (
                      <div className="flex flex-col space-y-2">
                        <Input required autoFocus type="text" name="category" value={formData.category} onChange={handleInputChange} className="font-bold text-primary border-primary focus-visible:ring-primary" placeholder="New Category..." />
                        <button type="button" onClick={() => { setIsCustomCategory(false); setFormData(prev => ({...prev, category: 'Food & Drink'})); }} className="text-[10px] self-start font-black tracking-widest text-muted-foreground hover:text-destructive transition-colors uppercase">
                          Cancel Custom
                        </button>
                      </div>
                    ) : (
                      <select name="category" value={formData.category} onChange={handleInputChange} className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring">
                        {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option disabled>──────────</option>
                        <option value="NEW_CUSTOM_CATEGORY" className="font-bold text-primary">Create Custom...</option>
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account & State</label>
                    <div className="flex space-x-2">
                      <select name="account" value={formData.account} onChange={handleInputChange} className="flex h-8 w-2/3 items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring">
                        {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                      </select>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="flex h-8 w-1/3 items-center justify-between rounded-lg border border-input bg-transparent px-2 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring">
                        {STATUSES.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
                  <Button type="button" variant="ghost" onClick={closeModal} disabled={isSubmitting} className="font-bold tracking-widest uppercase text-xs">
                    Dismiss
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="font-bold tracking-widest uppercase text-xs px-8">
                    {isSubmitting ? 'Processing...' : (editingId ? 'Save Configuration' : 'Commit Record')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}