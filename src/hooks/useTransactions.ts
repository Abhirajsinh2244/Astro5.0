// src/hooks/useTransactions.ts
import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { type Transaction } from '../lib/types'; 

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = (status: number) => {
    if (status === 401) {
      localStorage.removeItem('ledger_token');
      window.location.href = '/login';
      return true;
    }
    return false;
  };

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.api.transactions.$get();
      if (handleAuthError(response.status)) return;
      
      if (!response.ok) throw new Error(`Server connection failed: ${response.status}`);

      const result = await response.json();
      if (result.success === true && 'data' in result) {
        setData(result.data as unknown as Transaction[]);
      } else {
        throw new Error((result as any).error || 'Failed to retrieve records');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = async (payload: Omit<Transaction, 'id'>) => {
    try {
      const response = await apiClient.api.transactions.$post({ json: payload as any });
      if (handleAuthError(response.status)) return false;

      const result = await response.json();
      if (result.success === true) {
        setData(prev => [(result as any).data as unknown as Transaction, ...prev]);
        return true;
      } else {
        throw new Error((result as any).error || 'Validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      return false;
    }
  };

  const editTransaction = async (id: string, payload: Omit<Transaction, 'id'>) => {
    try {
      const response = await apiClient.api.transactions[':id'].$put({ param: { id }, json: payload as any });
      if (handleAuthError(response.status)) return false;

      const result = await response.json();
      if (result.success === true) {
        setData(prev => prev.map(t => t.id === id ? ((result as any).data as unknown as Transaction) : t));
        return true;
      } else {
        throw new Error((result as any).error || 'Update failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await apiClient.api.transactions[':id'].$delete({ param: { id } });
      if (handleAuthError(response.status)) return false;

      const result = await response.json();
      if (result.success === true) {
        setData(prev => prev.filter(t => t.id !== id));
        return true;
      } else {
        throw new Error((result as any).error || 'Failed to delete record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete operation failed');
      return false;
    }
  };

  return { data, isLoading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction };
}