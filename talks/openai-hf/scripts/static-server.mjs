// Servidor estático mínimo sobre dist/ (raíz del repositorio), para las comprobaciones en Chromium.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../../../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };

export async function serve() {
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
	return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
