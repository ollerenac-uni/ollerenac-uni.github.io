// Comprueba el mapa del incidente en la charla (44 diapositivas) y en el post (escenas de cada mapa):
//  · foco: Siguiente/Fin/Inicio y las flechas no sacan el foco del mapa en ningún extremo;
//  · rutas: ninguna conexión pasa por detrás de un nodo activo que no es su origen ni su destino;
//  · descripción accesible y clave: cada conexión nombra origen, destino, tipo y organización;
//  · charla: ningún texto se sale de la diapositiva ni pisa el pie de fuentes.
// Uso: npm run build:all (en la raíz) y luego npm run check:mapa (aquí).
import { chromium } from 'playwright-chromium';
import { serve } from './static-server.mjs';

// Se ejecuta en la página. Devuelve los fallos de un mapa visible.
const inspectMap = (fig) => {
	const out = [];
	const escena = fig.dataset.escena;
	const nodes = [...fig.querySelectorAll('g.nodo.on')].map((g) => ({ id: g.dataset.id, r: g.querySelector('rect.caja:not(.caja2)').getBoundingClientRect() }));
	for (const path of fig.querySelectorAll('.conexiones path')) {
		const { a, b } = path.dataset;
		const m = path.getScreenCTM();
		const len = path.getTotalLength();
		let hidden = 0;
		for (let i = 1; i < 40; i++) {
			const p = path.getPointAtLength((len * i) / 40);
			const x = m.a * p.x + m.c * p.y + m.e;
			const y = m.b * p.x + m.d * p.y + m.f;
			if (nodes.some((n) => n.id !== a && n.id !== b && x > n.r.left && x < n.r.right && y > n.r.top && y < n.r.bottom)) hidden++;
		}
		if (hidden) out.push(`${escena}: ${a} → ${b} pasa ${hidden} veces por detrás de un nodo activo`);
	}
	const desc = fig.querySelector('svg.plano desc').textContent;
	[...fig.querySelectorAll('.clave li')].forEach((li, i) => {
		if (!/[→↔]/.test(li.textContent)) out.push(`${escena}: la conexión ${i + 1} no muestra origen → destino en la clave`);
		if (!desc.includes(`Conexión ${i + 1},`)) out.push(`${escena}: la descripción SVG no incluye la conexión ${i + 1}`);
	});
	if ((desc.match(/\(/g) ?? []).length < nodes.length) out.push(`${escena}: la descripción SVG no nombra la organización de cada nodo activo`);
	return out;
};
// Texto cuyo rectángulo sale del lienzo o pisa el pie de fuentes.
const inspectSlide = (n) => {
	const page = document.querySelector(`.slidev-page-${n}`);
	const box = document.querySelector('#slide-content').getBoundingClientRect();
	const foot = page.querySelector('.fuentes')?.getBoundingClientRect();
	const layout = page.querySelector('.slidev-layout');
	const out = [];
	const walk = document.createTreeWalker(layout, NodeFilter.SHOW_TEXT);
	for (let t = walk.nextNode(); t; t = walk.nextNode()) {
		if (!t.textContent.trim() || t.parentElement.closest('.sr')) continue;
		const range = document.createRange();
		range.selectNodeContents(t);
		for (const r of range.getClientRects()) {
			if (r.width < 1) continue;
			if (r.right > box.right + 1 || r.left < box.left - 1 || r.bottom > box.bottom + 1) out.push(`fuera de la diapositiva: «${t.textContent.trim().slice(0, 40)}»`);
			else if (foot && !t.parentElement.closest('.fuentes') && r.bottom > foot.top + 1 && r.top < foot.bottom) out.push(`pisa el pie de fuentes: «${t.textContent.trim().slice(0, 40)}»`);
		}
	}
	return out;
};

// Casos concretos que pidió la revisión (H2, H3): texto de la clave y de la descripción.
const casos = {
	C11: { clave: ['Contenedor → Control de salida', 'VM de la prueba → Control de salida', 'BLOQUEADA'], desc: ['salida directa, bloqueada: de Contenedor de evaluación (Evaluación OpenAI) a Control de salida (Evaluación OpenAI)'] },
	C18: { clave: ['Respuesta de HF ↔ Respuesta de OpenAI'], desc: ['entre Respuesta (Respuesta Hugging Face) y Respuesta (Respuesta OpenAI)', 'Marca de interrogación: sin confirmar, sobre Respuesta (Respuesta OpenAI)'] },
	C20: { clave: ['Artifactory → Internet', 'Cuenta externa → Caché de imágenes', 'Artifactory → Nodo OpenAI del 19', 'INTENTO / RESULTADO NO CONFIRMADO'], desc: ['de Artifactory (Servicios internos OpenAI) a Nodo OpenAI del 19 (Otra actividad dentro de OpenAI)'] },
};
const fails = [];
const check = (cond, msg) => cond || fails.push(msg);

const { origin, close } = await serve();
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1960, height: 1104 } });
	await page.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
	const seen = {};
	const examine = async (fig) => {
		fails.push(...(await fig.evaluate(inspectMap)));
		const id = await fig.getAttribute('data-escena');
		const c = casos[id];
		if (!c || seen[id]) return;
		seen[id] = true;
		const clave = await fig.locator('.clave').evaluate((e) => e.textContent.replace(/\s+/g, ' '));
		const desc = await fig.locator('svg.plano desc').textContent();
		for (const t of c.clave) check(clave.includes(t), `${id}: la clave no dice «${t}»`);
		for (const t of c.desc) check(desc.includes(t), `${id}: la descripción SVG no dice «${t}»`);
	};

	// Charla: recorre las diapositivas con el teclado.
	await page.goto(`${origin}/talks/openai-hf/`, { waitUntil: 'networkidle' });
	await page.waitForSelector('.slidev-layout');
	let slides = 0;
	let maps = 0;
	for (let n = 1; ; n++) {
		await page.waitForTimeout(400);
		for (const m of await page.evaluate(inspectSlide, n)) fails.push(`diapositiva ${n}: ${m}`);
		const fig = page.locator(`.slidev-page-${n} figure.mapa`).first();
		if (await fig.count()) {
			await examine(fig);
			maps++;
		}
		slides = n;
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(120);
		if (!(await page.evaluate(() => location.hash)).startsWith(`#/${n + 1}`)) break;
	}

	// Post: foco y escenas de cada mapa con secuencia.
	await page.goto(`${origin}/posts/openai-hf/`, { waitUntil: 'networkidle' });
	const figs = page.locator('figure.mapa');
	let seq = 0;
	let scenes = 0;
	const state = () => page.evaluate(() => {
		const a = document.activeElement;
		const f = a.closest('figure.mapa');
		return { inside: !!f, name: a.textContent.trim().slice(0, 20), scene: f?.querySelector('.ctrl strong')?.textContent ?? '', disabled: a.getAttribute('aria-disabled') };
	});
	for (let i = 0, total = await figs.count(); i < total; i++) {
		const fig = figs.nth(i);
		const next = fig.getByRole('button', { name: /Siguiente/ });
		if (!(await next.count())) {
			await examine(fig);
			continue;
		}
		seq++;
		const prev = fig.getByRole('button', { name: /Anterior/ });
		const n = Number((await fig.locator('.ctrl strong').textContent()).match(/de (\d+)/)[1]);
		const at = `mapa ${i + 1}`;
		const press = async (k) => (await page.keyboard.press(k), await page.waitForTimeout(120), state());
		for (let s = 0; s < n; s++) {
			await examine(fig);
			scenes++;
			if (s < n - 1) await next.click();
		}
		// En la última escena: foco en Siguiente (con aria-disabled), no en body.
		await next.focus();
		let st = await press('Home');
		check(st.inside && st.scene.startsWith('Escena 1 '), `${at}: Inicio desde Siguiente no restaura la escena 1 (${st.scene})`);
		st = await press('End');
		check(st.inside && st.name.startsWith('Siguiente') && st.disabled === 'true' && st.scene.startsWith(`Escena ${n} `), `${at}: Fin saca el foco del mapa (${JSON.stringify(st)})`);
		st = await press('ArrowRight');
		check(st.inside && st.scene.startsWith(`Escena ${n} `), `${at}: ArrowRight en el último extremo pierde el foco o cambia de escena`);
		st = await press('Home');
		check(st.inside && st.scene.startsWith('Escena 1 '), `${at}: Inicio tras Fin falla (${JSON.stringify(st)})`);
		st = await press('ArrowLeft');
		check(st.inside && st.scene.startsWith('Escena 1 '), `${at}: ArrowLeft en el primer extremo pierde el foco o cambia de escena`);
		// Enter en el botón deshabilitado no hace nada y no pierde el foco.
		await prev.focus();
		st = await press('Enter');
		check(st.inside && st.name.startsWith('← Anterior') && st.scene.startsWith('Escena 1 '), `${at}: Enter en Anterior (primer extremo) pierde el foco`);
		// Siguiente con Enter hasta el último extremo.
		await next.focus();
		for (let s = 1; s < n; s++) st = await press('Enter');
		check(st.inside && st.name.startsWith('Siguiente') && st.scene.startsWith(`Escena ${n} `), `${at}: Siguiente con Enter pierde el foco en el último extremo (${JSON.stringify(st)})`);
		st = await press('Enter');
		check(st.inside && st.name.startsWith('Siguiente') && st.scene.startsWith(`Escena ${n} `), `${at}: Enter en Siguiente (último extremo) pierde el foco`);
		// Tab desde el último extremo avanza fuera del botón; Mayús+Tab vuelve a Anterior.
		st = await press('Shift+Tab');
		check(st.inside && st.name.startsWith('← Anterior'), `${at}: Mayús+Tab desde Siguiente no llega a Anterior (${JSON.stringify(st)})`);
		await press('Tab');
		st = await press('Tab');
		check(st.name !== 'Siguiente →' || !st.inside, `${at}: Tab no sale del mapa`);
	}
	console.log(`diapositivas ${slides}, mapas en la charla ${maps}, mapas del post ${await figs.count()} (${seq} con secuencia, ${scenes} escenas)`);
} finally {
	await browser.close();
	close();
}
if (fails.length) {
	console.error(fails.join('\n'));
	throw new Error(`${fails.length} fallos`);
}
console.log('OK: foco, rutas, clave, descripción y texto dentro de la diapositiva.');
