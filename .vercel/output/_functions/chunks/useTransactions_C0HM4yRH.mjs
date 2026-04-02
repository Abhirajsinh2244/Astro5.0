import { useState, useCallback } from 'react';
import { a as apiClient } from './api_DfTFoTW3.mjs';

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
      const response = await apiClient.api.transactions.$get();
      if (handleAuthError(response.status)) return;
      if (!response.ok) throw new Error(`Server connection failed: ${response.status}`);
      const result = await response.json();
      if (result.success === true && "data" in result) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to retrieve records");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const addTransaction = async (payload) => {
    try {
      const response = await apiClient.api.transactions.$post({ json: payload });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => [result.data, ...prev]);
        return true;
      } else {
        throw new Error(result.error || "Validation failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add transaction");
      return false;
    }
  };
  const editTransaction = async (id, payload) => {
    try {
      const response = await apiClient.api.transactions[":id"].$put({ param: { id }, json: payload });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => prev.map((t) => t.id === id ? result.data : t));
        return true;
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transaction");
      return false;
    }
  };
  const deleteTransaction = async (id) => {
    try {
      const response = await apiClient.api.transactions[":id"].$delete({ param: { id } });
      if (handleAuthError(response.status)) return false;
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => prev.filter((t) => t.id !== id));
        return true;
      } else {
        throw new Error(result.error || "Failed to delete record");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete operation failed");
      return false;
    }
  };
  return { data, isLoading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction };
}

export { CATEGORY_MAP as C, useTransactions as u };
