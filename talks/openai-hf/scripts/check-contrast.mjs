// Mide el contraste de todo el texto visible de la charla (cada diapositiva) y del post (cada escena de cada mapa).
// Falla si algún texto queda bajo 4.5:1. Uso: npm run build:all (en la raíz) y luego npm run check:contrast (aquí).
import { chromium } from 'playwright-chromium';
import { serve } from './static-server.mjs';

// Se ejecuta dentro de la página. Devuelve los textos visibles con su contraste.
function measure(rootSel) {
	const parse = (c) => {
		const m = c.match(/rgba?\(([^)]+)\)/);
		if (!m) return null;
		const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
		return [r, g, b, a];
	};
	const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
	const lum = ([r, g, b]) => 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
	const ch = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	const ratio = (a, b) => {
		const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
		return (x + 0.05) / (y + 0.05);
	};
	const opacityOf = (el) => {
		let o = 1;
		for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
		return o;
	};
	// Fondo detrás de un elemento HTML: los fondos de los ancestros, de abajo arriba, sobre blanco.
	const htmlBg = (el) => {
		const layers = [];
		for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
			const c = parse(getComputedStyle(e).backgroundColor);
			if (c && c[3] > 0) layers.push(c);
			if (c && c[3] === 1) break;
		}
		return layers.reduceRight((acc, c) => over(c, acc), [255, 255, 255, 1]);
	};
	// Fondo de un texto SVG: la figura más alta bajo su centro que no sea texto (caja del nodo o de la zona), sobre el fondo HTML.
	const svgBg = (el) => {
		let r = el.getBoundingClientRect();
		// elementsFromPoint solo ve lo que está en pantalla.
		if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) {
			el.scrollIntoView({ block: 'center', inline: 'center' });
			r = el.getBoundingClientRect();
		}
		const stack = document.elementsFromPoint(r.x + r.width / 2, r.y + r.height / 2).filter((e) => e !== el && e.closest('svg') && !['text', 'tspan', 'title', 'svg'].includes(e.tagName));
		const shape = stack.find((e) => {
			const f = getComputedStyle(e).fill;
			return f !== 'none' && parse(f) && parse(f)[3] > 0 && !e.matches('line, path.ln');
		});
		const host = htmlBg(el.closest('svg'));
		if (!shape) return host;
		const f = parse(getComputedStyle(shape).fill);
		const fo = Number(getComputedStyle(shape).fillOpacity);
		return over([f[0], f[1], f[2], f[3] * fo * opacityOf(shape)], host);
	};
	const out = [];
	const root = document.querySelector(rootSel) ?? document.body;
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		const text = n.textContent.trim();
		const el = n.parentElement;
		if (!text || !el || el.closest('script, style, title, desc, [hidden]')) continue;
		const cs = getComputedStyle(el);
		const rect = el.getBoundingClientRect();
		if (cs.visibility === 'hidden' || cs.display === 'none' || rect.width === 0 || rect.height === 0) continue;
		const inSvg = !!el.closest('svg');
		const fg0 = parse(inSvg ? cs.fill : cs.color);
		if (!fg0) continue;
		const bg = inSvg ? svgBg(el) : htmlBg(el);
		const alpha = fg0[3] * opacityOf(el);
		const fg = over([fg0[0], fg0[1], fg0[2], alpha], bg);
		out.push({ text: text.slice(0, 50), ratio: ratio(fg, bg) });
	}
	return out;
}

const { origin, close } = await serve();
const browser = await chromium.launch();
const fails = [];
let texts = 0;
let min = Infinity;
const record = (where, list) => {
	for (const t of list) {
		texts++;
		min = Math.min(min, t.ratio);
		if (t.ratio < 4.5) fails.push(`${where}: ${t.ratio.toFixed(2)}:1 «${t.text}»`);
	}
};
try {
	const page = await browser.newPage({ viewport: { width: 1960, height: 1104 } });
	await page.goto(`${origin}/talks/openai-hf/`, { waitUntil: 'networkidle' });
	await page.waitForSelector('.slidev-layout');
	let total = 0;
	for (;;) {
		total++;
		await page.waitForTimeout(400);
		record(`diapositiva ${total}`, await page.evaluate(measure, '#slide-content'));
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(150);
		if (!(await page.evaluate(() => location.hash)).startsWith(`#/${total + 1}`)) break;
	}
	await page.goto(`${origin}/posts/openai-hf/`, { waitUntil: 'networkidle' });
	record('post (texto)', await page.evaluate(measure, 'main'));
	const maps = await page.locator('figure.mapa').count();
	for (let i = 0; i < maps; i++) {
		const fig = page.locator('figure.mapa').nth(i);
		await fig.scrollIntoViewIfNeeded();
		const next = fig.getByRole('button', { name: /Siguiente/ });
		// measure trabaja con selectores: marca la figura y mídela.
		for (let s = 1; ; s++) {
			await fig.evaluate((el) => el.setAttribute('data-medir', ''));
			record(`post, mapa ${i + 1}, escena ${s}`, await page.evaluate(measure, '[data-medir]'));
			await fig.evaluate((el) => el.removeAttribute('data-medir'));
			if (!(await next.count()) || !(await next.isEnabled())) break;
			await next.click();
		}
	}
	console.log(`${texts} textos medidos; mínimo ${min.toFixed(2)}:1`);
	if (fails.length) throw new Error(`${fails.length} textos bajo 4.5:1:\n` + [...new Set(fails)].slice(0, 40).join('\n'));
	console.log('OK: todo el texto de la charla y del post llega a 4.5:1 o más.');
} finally {
	await browser.close();
	close();
}
