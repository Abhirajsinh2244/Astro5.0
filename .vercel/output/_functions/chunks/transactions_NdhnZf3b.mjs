import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DWawJIkV.mjs';
import { $ as $$Layout } from './api_BmEuRN-b.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { u as useTransactions, C as CATEGORY_MAP } from './useTransactions_qJTEYm5w.mjs';
import { e as cn, C as Card, a as CardContent, b as CardHeader, c as CardTitle } from './card_ec129ZCw.mjs';
import { I as Input, B as Button } from './button_CYEjC8J2.mjs';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      "data-variant": variant,
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}

const ACCOUNTS = ["Checking", "Credit Card", "Savings"];
const STATUSES = ["Cleared", "Pending"];
function TransactionsView() {
  const { data: transactions, isLoading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction } = useTransactions();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccount, setFilterAccount] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    merchant: "",
    category: "Food & Drink",
    description: "",
    amount: "",
    account: "Checking",
    status: "Cleared"
  });
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const dynamicCategories = useMemo(() => {
    const baseCats = new Set(Object.keys(CATEGORY_MAP));
    transactions.forEach((tx) => baseCats.add(tx.category));
    return Array.from(baseCats).sort();
  }, [transactions]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "NEW_CUSTOM_CATEGORY") {
      setIsCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setIsCustomCategory(false);
    setFormData({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      merchant: "",
      category: "Food & Drink",
      description: "",
      amount: "",
      account: "Checking",
      status: "Cleared"
    });
  };
  const handleEditClick = (tx) => {
    setTransactionType(tx.type);
    setEditingId(tx.id);
    setIsCustomCategory(false);
    setFormData({
      date: tx.date,
      merchant: tx.merchant,
      category: tx.category,
      description: tx.description || "",
      amount: tx.amount.toString(),
      account: tx.account,
      status: tx.status
    });
    setIsModalOpen(true);
  };
  const handleSubmit = async (e) => {
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
    return transactions.filter((t) => {
      const matchCat = filterCategory === "All" || t.category === filterCategory;
      const matchAcc = filterAccount === "All" || t.account === filterAccount;
      let matchDate = true;
      if (startDate && endDate) matchDate = t.date >= startDate && t.date <= endDate;
      return matchCat && matchAcc && matchDate;
    });
  }, [transactions, filterCategory, filterAccount, startDate, endDate]);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const formatCurrency = (amount, type) => {
    const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
    return type === "expense" ? `-${formatted}` : `+${formatted}`;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-12 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-foreground tracking-tighter", children: "Transactions Ledger" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground font-medium", children: "Manage and filter your secure transaction history." })
      ] }),
      error && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "px-4 py-1.5 text-sm uppercase tracking-widest", children: error })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "border-border shadow-sm", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Date Range" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full font-medium" }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-black text-xs uppercase", children: "To" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-full font-medium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Category Filter" }),
        /* @__PURE__ */ jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsx("option", { value: "All", children: "All Categories" }),
          dynamicCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Account Filter" }),
        /* @__PURE__ */ jsxs("select", { value: filterAccount, onChange: (e) => setFilterAccount(e.target.value), className: "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsx("option", { value: "All", children: "All Accounts" }),
          ACCOUNTS.map((acc) => /* @__PURE__ */ jsx("option", { value: acc, children: acc }, acc))
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground tracking-tight", children: "Recent Records" }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx(Button, { variant: "default", onClick: () => {
            setTransactionType("expense");
            setIsModalOpen(true);
          }, className: "font-bold tracking-widest uppercase text-xs px-6", children: "Record Expense" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
            setTransactionType("income");
            setIsModalOpen(true);
          }, className: "font-bold tracking-widest uppercase text-xs px-6", children: "Record Income" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/30", children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Merchant" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Category" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell", children: "Description" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Amount" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Account" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "h-32 text-center text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse", children: "Retrieving Ledger..." }) }) : currentTransactions.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "h-32 text-center text-sm font-medium text-muted-foreground", children: "No transactions map to the current parameters." }) }) : currentTransactions.map((tx) => /* @__PURE__ */ jsxs(TableRow, { className: "group transition-colors", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-semibold text-foreground whitespace-nowrap", children: formatDate(tx.date) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-foreground", children: tx.merchant }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-muted-foreground", children: tx.category }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground max-w-[200px] truncate hidden md:table-cell", title: tx.description, children: tx.description || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: `font-black tracking-tight whitespace-nowrap ${tx.type === "expense" ? "text-destructive" : "text-emerald-600"}`, children: formatCurrency(tx.amount, tx.type) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-muted-foreground", children: tx.account }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: tx.status === "Cleared" ? "secondary" : "outline", className: "uppercase font-bold tracking-wider text-[10px]", children: tx.status }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right whitespace-nowrap", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleEditClick(tx), className: "text-[10px] font-black tracking-widest text-emerald-600 hover:text-emerald-800 uppercase transition-all mr-4 opacity-0 group-hover:opacity-100 focus:opacity-100", children: "Edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteTransaction(tx.id), className: "text-[10px] font-black tracking-widest text-destructive hover:text-red-800 uppercase transition-all opacity-0 group-hover:opacity-100 focus:opacity-100", children: "Delete" })
          ] })
        ] }, tx.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border flex items-center justify-between bg-muted/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-muted-foreground", children: [
          "Page ",
          /* @__PURE__ */ jsx("span", { className: "font-black text-foreground", children: currentPage }),
          " of ",
          /* @__PURE__ */ jsx("span", { className: "font-black text-foreground", children: totalPages })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-6", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "text-xs font-black uppercase tracking-widest text-foreground disabled:text-muted disabled:cursor-not-allowed hover:underline underline-offset-4", children: "Previous" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "text-xs font-black uppercase tracking-widest text-foreground disabled:text-muted disabled:cursor-not-allowed hover:underline underline-offset-4", children: "Next" })
        ] })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-border/50", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-2xl font-black text-foreground tracking-tighter uppercase", children: [
        editingId ? "Modify" : "Commit",
        " ",
        transactionType
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Date" }),
            /* @__PURE__ */ jsx(Input, { required: true, type: "date", name: "date", value: formData.date, onChange: handleInputChange, className: "font-medium" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Amount" }),
            /* @__PURE__ */ jsx(Input, { required: true, type: "number", step: "0.01", min: "0.01", name: "amount", value: formData.amount, onChange: handleInputChange, className: "font-medium", placeholder: "0.00" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: transactionType === "expense" ? "Merchant" : "Source" }),
          /* @__PURE__ */ jsx(Input, { required: true, type: "text", name: "merchant", value: formData.merchant, onChange: handleInputChange, className: "font-medium", placeholder: "Entity name..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Description" }),
          /* @__PURE__ */ jsx(Input, { type: "text", name: "description", value: formData.description, onChange: handleInputChange, className: "font-medium", placeholder: "Optional context..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Category" }),
            isCustomCategory ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
              /* @__PURE__ */ jsx(Input, { required: true, autoFocus: true, type: "text", name: "category", value: formData.category, onChange: handleInputChange, className: "font-bold text-primary border-primary focus-visible:ring-primary", placeholder: "New Category..." }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                setIsCustomCategory(false);
                setFormData((prev) => ({ ...prev, category: "Food & Drink" }));
              }, className: "text-[10px] self-start font-black tracking-widest text-muted-foreground hover:text-destructive transition-colors uppercase", children: "Cancel Custom" })
            ] }) : /* @__PURE__ */ jsxs("select", { name: "category", value: formData.category, onChange: handleInputChange, className: "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring", children: [
              dynamicCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat)),
              /* @__PURE__ */ jsx("option", { disabled: true, children: "──────────" }),
              /* @__PURE__ */ jsx("option", { value: "NEW_CUSTOM_CATEGORY", className: "font-bold text-primary", children: "Create Custom..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: "Account & State" }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx("select", { name: "account", value: formData.account, onChange: handleInputChange, className: "flex h-8 w-2/3 items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring", children: ACCOUNTS.map((acc) => /* @__PURE__ */ jsx("option", { value: acc, children: acc }, acc)) }),
              /* @__PURE__ */ jsx("select", { name: "status", value: formData.status, onChange: handleInputChange, className: "flex h-8 w-1/3 items-center justify-between rounded-lg border border-input bg-transparent px-2 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring", children: STATUSES.map((stat) => /* @__PURE__ */ jsx("option", { value: stat, children: stat }, stat)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-border/50", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: closeModal, disabled: isSubmitting, className: "font-bold tracking-widest uppercase text-xs", children: "Dismiss" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "font-bold tracking-widest uppercase text-xs px-8", children: isSubmitting ? "Processing..." : editingId ? "Save Configuration" : "Commit Record" })
        ] })
      ] }) })
    ] }) })
  ] });
}

const $$Transactions = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Transactions" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TransactionsView", TransactionsView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/views/TransactionsView.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/astro4.0/src/pages/transactions.astro", void 0);

const $$file = "C:/astro4.0/src/pages/transactions.astro";
const $$url = "/transactions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Transactions,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
