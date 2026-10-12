// Carga la charla y el post desde dist/ con todo lo externo bloqueado y comprueba que funcionan.
// Uso: npm run build:all (en la raíz) y luego npm run check:offline (aquí).
import { chromium } from 'playwright-chromium';
import { serve } from './static-server.mjs';

const { origin, close } = await serve();
const browser = await chromium.launch();
const external = [];
const bad = [];
try {
	const page = await browser.newPage();
	await page.route('**/*', (route) => {
		const url = route.request().url();
		if (url.startsWith(origin) || url.startsWith('data:')) return route.continue();
		external.push(url);
		return route.abort();
	});
	page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));

	// Charla: recorre todas las diapositivas con el teclado.
	await page.goto(`${origin}/talks/openai-hf/`, { waitUntil: 'networkidle' });
	await page.waitForSelector('.slidev-layout');
	let total = 1;
	for (;;) {
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(120);
		if (!(await page.evaluate(() => location.hash)).startsWith(`#/${total + 1}`)) break;
		total++;
	}
	const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`));
	const icon = await page.evaluate(() => document.querySelector('link[rel=icon]').href);

	// Post: recorre las escenas de cada mapa con «Siguiente».
	await page.goto(`${origin}/posts/openai-hf/`, { waitUntil: 'networkidle' });
	const maps = await page.locator('figure.mapa').count();
	let scenes = maps;
	for (let i = 0; i < maps; i++) {
		const next = page.locator('figure.mapa').nth(i).getByRole('button', { name: /Siguiente/ });
		while ((await next.count()) && (await next.isEnabled())) {
			await next.click();
			scenes++;
		}
	}
	console.log({ slides: total, maps, scenes, fonts, icon, external, bad });
	if (external.length) throw new Error('Peticiones externas: ' + external.join(', '));
	if (bad.length) throw new Error('Respuestas con error: ' + bad.join(', '));
	if (!fonts.some((f) => f.startsWith('Nunito Sans'))) throw new Error('Nunito Sans no cargó');
	if (!icon.startsWith(origin)) throw new Error('Favicon externo: ' + icon);
	if (maps === 0) throw new Error('El post no muestra ningún mapa');
	console.log(`OK: ${total} diapositivas y ${maps} mapas del post (${scenes} escenas) cargan y navegan sin red.`);
} finally {
	await browser.close();
	close();
}
