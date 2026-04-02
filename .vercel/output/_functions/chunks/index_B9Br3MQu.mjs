import { c as createComponent } from './astro-component_CHfO9wO1.mjs';
import 'piccolore';
import './entrypoint_DWawJIkV.mjs';
import 'clsx';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("/dashboard");
}, "C:/astro4.0/src/pages/index.astro", void 0);

const $$file = "C:/astro4.0/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
