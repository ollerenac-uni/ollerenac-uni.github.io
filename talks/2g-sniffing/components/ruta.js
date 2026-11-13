// Trazado de una conexión del mapa: camino más corto entre dos puntos que rodea rectángulos (los nodos activos).
// Grafo de visibilidad entre las esquinas de los rectángulos, con margen; Dijkstra denso (decenas de puntos).

// ¿El segmento p→q atraviesa el interior del rectángulo r? (Liang–Barsky; rozar el borde no cuenta.)
function crosses([px, py], [qx, qy], r) {
	const e = 0.01
	let t0 = 0
	let t1 = 1
	for (const [p, q] of [[px - qx, px - r.x0 - e], [qx - px, r.x1 - e - px], [py - qy, py - r.y0 - e], [qy - py, r.y1 - e - py]]) {
		if (p === 0) {
			if (q < 0) return false
		} else if (p < 0) t0 = Math.max(t0, q / p)
		else t1 = Math.min(t1, q / p)
	}
	return t0 < t1
}

// Puntos [x, y] del camino de `from` a `to`, rodeando `rects` ({x, y, w, h}) a `margin` píxeles. Recto si nada estorba.
export function around(from, to, rects, margin = 4) {
	const R = rects.map((r) => ({ x0: r.x - margin, y0: r.y - margin, x1: r.x + r.w + margin, y1: r.y + r.h + margin }))
	const clear = (p, q) => R.every((r) => !crosses(p, q, r))
	if (clear(from, to)) return [from, to]
	const free = ([x, y]) => R.every((r) => !(x > r.x0 + 0.01 && x < r.x1 - 0.01 && y > r.y0 + 0.01 && y < r.y1 - 0.01))
	const pts = [from, to, ...R.flatMap((r) => [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]).filter(free)]
	const dist = pts.map(() => Infinity)
	const prev = pts.map(() => -1)
	const done = pts.map(() => false)
	dist[0] = 0
	for (;;) {
		let u = -1
		for (let i = 0; i < pts.length; i++) if (!done[i] && dist[i] < (u < 0 ? Infinity : dist[u])) u = i
		if (u < 0 || u === 1) break
		done[u] = true
		for (let v = 0; v < pts.length; v++) {
			if (done[v]) continue
			const d = dist[u] + Math.hypot(pts[v][0] - pts[u][0], pts[v][1] - pts[u][1])
			if (d < dist[v] && clear(pts[u], pts[v])) {
				dist[v] = d
				prev[v] = u
			}
		}
	}
	if (prev[1] < 0) return [from, to] // sin camino libre: recto
	const out = []
	for (let i = 1; i >= 0; i = prev[i]) out.unshift(pts[i])
	return out
}

// Trazado SVG por los puntos, con las esquinas redondeadas.
export function rounded(pts, r = 6) {
	let d = `M${pts[0][0]} ${pts[0][1]}`
	for (let i = 1; i < pts.length - 1; i++) {
		const [px, py] = pts[i - 1]
		const [x, y] = pts[i]
		const [nx, ny] = pts[i + 1]
		const l1 = Math.hypot(px - x, py - y)
		const l2 = Math.hypot(nx - x, ny - y)
		const k = Math.min(r, l1 / 2, l2 / 2)
		d += `L${x + ((px - x) / l1) * k} ${y + ((py - y) / l1) * k}Q${x} ${y} ${x + ((nx - x) / l2) * k} ${y + ((ny - y) / l2) * k}`
	}
	return `${d}L${pts.at(-1)[0]} ${pts.at(-1)[1]}`
}
