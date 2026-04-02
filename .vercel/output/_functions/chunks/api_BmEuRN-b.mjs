import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import { r as renderTemplate, n as renderSlot, l as renderComponent, o as renderHead } from './entrypoint_DWawJIkV.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("ledger_token");
    setIsAuthenticated(!!token);
  }, []);
  const login = (token) => {
    localStorage.setItem("ledger_token", token);
    setIsAuthenticated(true);
    window.location.href = "/dashboard";
  };
  const logout = () => {
    localStorage.removeItem("ledger_token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };
  return { isAuthenticated, login, logout };
}

function TopNav() {
  const [currentPath, setCurrentPath] = useState("/");
  const { isAuthenticated, logout } = useAuth();
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const navLinkClass = (path) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold tracking-wide transition-colors ${currentPath.includes(path) ? "border-emerald-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"}`;
  if (isAuthenticated === null) return /* @__PURE__ */ jsx("div", { className: "h-16 bg-white border-b border-gray-200" });
  return /* @__PURE__ */ jsx("nav", { className: "bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between h-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 flex items-center gap-3 mr-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white font-black text-lg shadow-sm", children: "L" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-extrabold text-gray-900 tracking-tighter", children: "LedgerPro" })
      ] }),
      isAuthenticated && /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex sm:space-x-8", children: [
        /* @__PURE__ */ jsx("a", { href: "/dashboard", className: navLinkClass("/dashboard"), children: "Dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/transactions", className: navLinkClass("/transactions"), children: "Transactions" }),
        /* @__PURE__ */ jsx("a", { href: "/budgets", className: navLinkClass("/budgets"), children: "Budgets" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center", children: !isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "space-x-4", children: [
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors", children: "Sign In" }),
      /* @__PURE__ */ jsx("a", { href: "/register", className: "bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide hover:bg-black transition-colors", children: "Get Started" })
    ] }) : /* @__PURE__ */ jsx("button", { onClick: logout, className: "text-sm font-bold tracking-wide text-red-500 hover:text-red-700 transition-colors uppercase", children: "Sign Out" }) })
  ] }) }) });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', " | LedgerPro</title><script>\n      // Client-side execution blocks unauthorized access before hydration\n      const publicPaths = ['/login', '/register', '/'];\n      const token = localStorage.getItem('ledger_token');\n      const isPublic = publicPaths.includes(window.location.pathname);\n      \n      if (!token && !isPublic) {\n        window.location.href = '/login';\n      } else if (token && (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/')) {\n        window.location.href = '/dashboard';\n      }\n    <\/script>", '</head> <body class="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900"> ', ' <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ', " </main> </body></html>"])), title, renderHead(), renderComponent($$result, "TopNav", TopNav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/layout/TopNav.tsx", "client:component-export": "default" }), renderSlot($$result, $$slots["default"]));
}, "C:/astro4.0/src/layouts/Layout.astro", void 0);

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:4321";
};
const apiFetch = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const headers = new Headers(options.headers);
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ledger_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers });
};

export { $$Layout as $, apiFetch as a, useAuth as u };
