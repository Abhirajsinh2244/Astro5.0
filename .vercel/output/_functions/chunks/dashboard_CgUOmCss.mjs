import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DWawJIkV.mjs';
import { $ as $$Layout } from './api_BmEuRN-b.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useMemo } from 'react';
import { u as useTransactions } from './useTransactions_qJTEYm5w.mjs';
import { C as CategoryReport } from './CategoryReport_CSnXqgd1.mjs';
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from './card_ec129ZCw.mjs';

function DashboardView() {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach((tx) => {
      if (tx.type === "income") inc += tx.amount;
      if (tx.type === "expense") exp += tx.amount;
    });
    return { totalIncome: inc, totalExpenses: exp, balance: inc - exp };
  }, [transactions]);
  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-[60vh]", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold tracking-widest text-primary uppercase animate-pulse", children: "Syncing Ledger Data..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx(Card, { className: "border-destructive/50 bg-destructive/10", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-destructive uppercase tracking-wide", children: "System Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive/80 mt-1", children: error })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in duration-700 pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-foreground tracking-tighter", children: "Financial Overview" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground font-medium", children: "Your high-level financial summary at a glance." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-sm hover:shadow-md transition-shadow duration-300", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Net Balance" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-foreground tracking-tighter", children: formatCurrency(balance) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-emerald-500", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Total Income" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-emerald-600 tracking-tighter", children: formatCurrency(totalIncome) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-destructive", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Total Expenses" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-destructive tracking-tighter", children: formatCurrency(totalExpenses) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsx(CategoryReport, { transactions }) })
  ] });
}

const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardView", DashboardView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/views/DashboardView.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/astro4.0/src/pages/dashboard.astro", void 0);

const $$file = "C:/astro4.0/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
