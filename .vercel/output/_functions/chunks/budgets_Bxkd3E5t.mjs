import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_DWawJIkV.mjs';
import { $ as $$Layout } from './api_BmEuRN-b.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useMemo, useEffect } from 'react';
import { C as CategoryReport } from './CategoryReport_CSnXqgd1.mjs';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { subMonths, format, parseISO } from 'date-fns';
import { u as useTransactions } from './useTransactions_qJTEYm5w.mjs';

function MonthlyTrends({ transactions }) {
  const chartData = useMemo(() => {
    const monthsMap = /* @__PURE__ */ new Map();
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(/* @__PURE__ */ new Date(), i);
      const monthKey = format(date, "MMM yyyy");
      monthsMap.set(monthKey, { month: format(date, "MMM"), expenses: 0, income: 0 });
    }
    transactions.forEach((tx) => {
      const txDate = parseISO(tx.date);
      const monthKey = format(txDate, "MMM yyyy");
      if (monthsMap.has(monthKey)) {
        const current = monthsMap.get(monthKey);
        if (tx.type === "expense") current.expenses += tx.amount;
        if (tx.type === "income") current.income += tx.amount;
      }
    });
    return Array.from(monthsMap.values());
  }, [transactions]);
  const formatCurrency = (val) => {
    if (val === 0) return "₹0";
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}k`;
    return `₹${val.toLocaleString("en-IN")}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-sm border border-gray-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold text-gray-900 tracking-tight", children: "Cash Flow Trends" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium mt-1", children: "6-month trailing comparison of income versus expenses." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-[350px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
      AreaChart,
      {
        data: chartData,
        margin: { top: 10, right: 10, left: -20, bottom: 0 },
        children: [
          /* @__PURE__ */ jsxs("defs", { children: [
            /* @__PURE__ */ jsxs("linearGradient", { id: "colorExpenses", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.25 }),
              /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxs("linearGradient", { id: "colorIncome", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.25 }),
              /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f3f4f6" }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              dataKey: "month",
              axisLine: false,
              tickLine: false,
              tick: { fill: "#9ca3af", fontSize: 11, fontWeight: 700 },
              dy: 10
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              axisLine: false,
              tickLine: false,
              tick: { fill: "#9ca3af", fontSize: 11, fontWeight: 700 },
              tickFormatter: formatCurrency
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              cursor: { stroke: "#e5e7eb", strokeWidth: 2, strokeDasharray: "4 4" },
              content: ({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800 text-white min-w-[160px]", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-2", children: label }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: payload.map((entry, index) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-300 capitalize tracking-wide", children: entry.name }),
                      /* @__PURE__ */ jsx("span", { className: "font-black tracking-tight", style: { color: entry.color }, children: new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(entry.value) })
                    ] }, index)) })
                  ] });
                }
                return null;
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Area,
            {
              type: "monotone",
              dataKey: "income",
              name: "Income",
              stroke: "#10b981",
              strokeWidth: 3,
              fillOpacity: 1,
              fill: "url(#colorIncome)"
            }
          ),
          /* @__PURE__ */ jsx(
            Area,
            {
              type: "monotone",
              dataKey: "expenses",
              name: "Expenses",
              stroke: "#ef4444",
              strokeWidth: 3,
              fillOpacity: 1,
              fill: "url(#colorExpenses)"
            }
          )
        ]
      }
    ) }) })
  ] });
}

function BudgetsView() {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold tracking-widest text-emerald-600 uppercase animate-pulse", children: "Aggregating Analytics..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 p-4 rounded-xl border border-red-100", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-red-800 uppercase tracking-wide", children: "Analytics Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: error })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx(CategoryReport, { transactions }),
    /* @__PURE__ */ jsx(MonthlyTrends, { transactions })
  ] });
}

const $$Budgets = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Budgets" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div> <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Budgets & Analytics</h1> <p class="text-base text-gray-500 mt-1">Visualize your spending patterns and structural analytics.</p> </div> ${renderComponent($$result2, "BudgetsView", BudgetsView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/views/BudgetsView.tsx", "client:component-export": "default" })} </div> ` })}`;
}, "C:/astro4.0/src/pages/budgets.astro", void 0);

const $$file = "C:/astro4.0/src/pages/budgets.astro";
const $$url = "/budgets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Budgets,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
