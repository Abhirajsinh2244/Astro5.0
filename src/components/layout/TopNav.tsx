// src/components/layout/TopNav.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TopNav(): React.JSX.Element {
  const [currentPath, setCurrentPath] = useState('/');
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navLinkClass = (path: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold tracking-wide transition-colors ${
      currentPath.includes(path)
        ? 'border-emerald-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
    }`;

  // Don't render complex UI until hydration determines auth state to avoid flashing
  if (isAuthenticated === null) return <div className="h-16 bg-white border-b border-gray-200"></div>;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-3 mr-10">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white font-black text-lg shadow-sm">L</div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tighter">LedgerPro</span>
            </div>
            
            {isAuthenticated && (
              <div className="hidden sm:flex sm:space-x-8">
                <a href="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</a>
                <a href="/transactions" className={navLinkClass('/transactions')}>Transactions</a>
                <a href="/budgets" className={navLinkClass('/budgets')}>Budgets</a>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {!isAuthenticated ? (
              <div className="space-x-4">
                <a href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Sign In</a>
                <a href="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide hover:bg-black transition-colors">Get Started</a>
              </div>
            ) : (
              <button onClick={logout} className="text-sm font-bold tracking-wide text-red-500 hover:text-red-700 transition-colors uppercase">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}