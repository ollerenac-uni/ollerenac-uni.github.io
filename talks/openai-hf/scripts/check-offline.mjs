// Carga la charla desde dist/ con todo lo externo bloqueado y comprueba que funciona.
// Uso: npm run build:all (en la raíz) y luego npm run check:offline (aquí).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-chromium';

const root = new URL('../../../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2' };

const server = createServer(async (req, res) => {
	const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
	const file = join(root, path.endsWith('/') ? path + 'index.html' : path);
	if (!file.startsWith(root)) return res.writeHead(403).end();
	try {
		const body = await readFile(file);
		res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
	} catch {
		res.writeHead(404).end();
	}
}).listen(0, '127.0.0.1');
await new Promise((ok) => server.once('listening', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

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
	await page.goto(`${origin}/talks/openai-hf/`, { waitUntil: 'networkidle' });
	await page.waitForSelector('.slidev-layout');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowRight');
	await page.waitForFunction(() => location.hash.startsWith('#/2'));
	const fonts = await page.evaluate(() =>
		[...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
	);
	const icon = await page.evaluate(() => document.querySelector('link[rel=icon]').href);
	console.log({ hash: await page.evaluate(() => location.hash), fonts, icon, external, bad });
	if (external.length) throw new Error('Peticiones externas: ' + external.join(', '));
	if (bad.length) throw new Error('Respuestas con error: ' + bad.join(', '));
	if (!fonts.some((f) => f.startsWith('Nunito Sans'))) throw new Error('Nunito Sans no cargó');
	if (!icon.startsWith(origin)) throw new Error('Favicon externo: ' + icon);
	console.log('OK: la charla carga, navega y conserva la tipografía sin red.');
} finally {
	await browser.close();
	server.close();
}
