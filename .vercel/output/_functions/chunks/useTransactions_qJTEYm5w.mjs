import { useState, useCallback } from 'react';
import { a as apiFetch } from './api_BmEuRN-b.mjs';

const CATEGORY_MAP = {
  "Food & Drink": "Food & Drink",
  "Groceries": "Groceries",
  "Transport": "Transport",
  "Entertainment": "Entertainment",
  "Utilities": "Utilities"
};

function useTransactions() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleAuthError = (status) => {
    if (status === 401) {
      localStorage.removeItem("ledger_token");
      window.location.href = "/login";
      return true;
    }
    return false;
  };
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/transactions");
      if (handleAuthError(response.status)) return;
      const result = await response.json();
      if (response.ok && result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to retrieve records");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const addTransaction = async (payload) => {
    try {
      const response = await apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (response.ok && result.success) {
        setData((prev) => [result.data, ...prev]);
        return true;
      }
      throw new Error(result.error || "Validation failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add transaction");
      return false;
    }
  };
  const editTransaction = async (id, payload) => {
    try {
      const response = await apiFetch(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (response.ok && result.success) {
        setData((prev) => prev.map((t) => t.id === id ? result.data : t));
        return true;
      }
      throw new Error(result.error || "Update failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transaction");
      return false;
    }
  };
  const deleteTransaction = async (id) => {
    try {
      const response = await apiFetch(`/api/transactions/${id}`, {
        method: "DELETE"
      });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (response.ok && result.success) {
        setData((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      throw new Error(result.error || "Failed to delete record");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete operation failed");
      return false;
    }
  };
  return { data, isLoading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction };
}

export { CATEGORY_MAP as C, useTransactions as u };
