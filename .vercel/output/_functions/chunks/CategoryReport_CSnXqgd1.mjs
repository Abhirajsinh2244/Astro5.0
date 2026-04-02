import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { C as CATEGORY_MAP } from './useTransactions_qJTEYm5w.mjs';
import { startOfYear, subYears, startOfMonth, subMonths, isWithinInterval } from 'date-fns';

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#14b8a6",
  "#6366f1",
  "#a855f7",
  "#f43f5e",
  "#f97316",
  "#0ea5e9"
];
function CategoryReport({ transactions }) {
  const [timeFrame, setTimeFrame] = useState("This Month");
  const { categoryData, pieChartData, totalSpend } = useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    let endDate = now;
    switch (timeFrame) {
      case "This Month":
        startDate = startOfMonth(now);
        break;
      case "Last Month":
        startDate = startOfMonth(subMonths(now, 1));
        endDate = startOfMonth(now);
        break;
      case "This Year":
        startDate = startOfYear(now);
        break;
      case "Last Year":
        startDate = startOfYear(subYears(now, 1));
        endDate = startOfYear(now);
        break;
    }
    const allCategories = new Set(Object.keys(CATEGORY_MAP));
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        allCategories.add(tx.category);
      }
    });
    const categoryTotals = {};
    allCategories.forEach((cat) => {
      categoryTotals[cat] = 0;
    });
    let aggregatedTotal = 0;
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      if (tx.type === "expense" && isWithinInterval(txDate, { start: startDate, end: endDate })) {
        categoryTotals[tx.category] += tx.amount;
        aggregatedTotal += tx.amount;
      }
    });
    const mappedData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: aggregatedTotal > 0 ? amount / aggregatedTotal * 100 : 0
    })).sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return a.category.localeCompare(b.category);
    }).map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
    const activeChartData = mappedData.filter((item) => item.amount > 0);
    return {
      categoryData: mappedData,
      // Used for the Table (shows everything including $0)
      pieChartData: activeChartData,
      // Used for the Pie Chart (shows > $0 only)
      totalSpend: aggregatedTotal
    };
  }, [transactions, timeFrame]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold text-gray-900 tracking-tight", children: "Category Distribution" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium mt-1", children: "Allocation of expenses across all your categories." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 p-1 rounded-lg border border-gray-200", children: ["This Month", "Last Month", "This Year", "Last Year"].map((tf) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTimeFrame(tf),
          className: `px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${timeFrame === tf ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`,
          children: tf
        },
        tf
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-h-\\[300px\\] flex items-center justify-center relative", children: [
        pieChartData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest", children: "No Expenses Found" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-2", children: "No data for the selected period." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-[300px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: pieChartData,
              dataKey: "amount",
              nameKey: "category",
              cx: "50%",
              cy: "50%",
              innerRadius: 80,
              outerRadius: 120,
              strokeWidth: 2,
              stroke: "#ffffff",
              paddingAngle: 2,
              children: pieChartData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              content: ({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 text-white p-4 rounded-lg shadow-xl text-sm border border-gray-800", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-bold tracking-wide mb-1 uppercase text-xs text-gray-400", children: data.category }),
                    /* @__PURE__ */ jsxs("div", { className: "text-gray-100", children: [
                      data.percentage.toFixed(1),
                      "% ",
                      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-600", children: "|" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-white font-black", children: formatCurrency(data.amount) })
                    ] })
                  ] });
                }
                return null;
              }
            }
          )
        ] }) }) }),
        pieChartData.length > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-gray-900 tracking-tighter", children: formatCurrency(totalSpend) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col", children: /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto pr-2 max-h-[300px]", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "border-b border-gray-100 sticky top-0 bg-white z-10", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Spent" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 text-right w-32 text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Budget %" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: categoryData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest", children: "No categories mapped yet" }) }) : categoryData.map((item) => /* @__PURE__ */ jsxs("tr", { className: "group hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-4 font-semibold text-gray-900", children: item.category }),
          /* @__PURE__ */ jsx("td", { className: `py-4 text-right font-bold ${item.amount > 0 ? "text-gray-900" : "text-gray-400"}`, children: formatCurrency(item.amount) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: `${item.percentage}%`,
                  backgroundColor: item.color
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("span", { className: `w-10 text-xs font-bold tracking-wider ${item.percentage > 0 ? "text-gray-500" : "text-gray-300"}`, children: [
              Math.round(item.percentage),
              "%"
            ] })
          ] }) })
        ] }, item.category)) })
      ] }) }) })
    ] })
  ] });
}

export { CategoryReport as C };
