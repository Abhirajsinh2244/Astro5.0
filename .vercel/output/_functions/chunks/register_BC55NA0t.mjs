import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DWawJIkV.mjs';
import { u as useAuth, a as apiFetch, $ as $$Layout } from './api_BmEuRN-b.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from './card_ec129ZCw.mjs';
import { I as Input, B as Button } from './button_CYEjC8J2.mjs';

function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.token);
      } else {
        setError(data.error || "Authentication rejected.");
      }
    } catch (err) {
      setError("A secure connection could not be established.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary/20", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md shadow-lg border-border/60 animate-in slide-in-from-bottom-4 duration-700", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-3 pb-6 text-center", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl font-black text-foreground tracking-tighter uppercase", children: "Provision" }),
      /* @__PURE__ */ jsxs(CardDescription, { className: "text-sm font-medium", children: [
        "Initialize a secure workspace. Already active? ",
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-primary hover:underline underline-offset-4 font-bold", children: "Authenticate here" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      error && /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 tracking-wide uppercase text-center", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Assigned Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "h-10 text-sm font-medium",
              placeholder: "operations@domain.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Secure Passphrase (Min. 8)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "password",
              required: true,
              minLength: 8,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "h-10 text-sm font-medium",
              placeholder: "Password"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isLoading, className: "w-full h-11 text-xs font-black tracking-widest uppercase transition-all", children: isLoading ? "Allocating Resources..." : "Generate Workspace" }) })
    ] }) })
  ] }) });
}

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Register" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RegisterView", RegisterView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/views/RegisterView.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/astro4.0/src/pages/register.astro", void 0);

const $$file = "C:/astro4.0/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
