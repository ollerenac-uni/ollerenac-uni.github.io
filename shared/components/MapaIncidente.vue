<script setup>
// Mapa del incidente: ¿qué podía hacer una ejecución con cada recurso? La usan el post (Astro) y la charla (Slidev).
// Datos: shared/data/mapa.json (de docs/mapa.md; ver scripts/mapa-md-to-json.mjs) e iconos Carbon locales (icons.json).
// Una escena es una instantánea completa: lo que no está activo se atenúa y pierde su rótulo. Las anclas no se mueven.
// Charla: <MapaIncidente scene="C05" />. Post: <MapaIncidente :scenes="['C03','C04','C05']" /> (Anterior / Siguiente).
import { computed, ref, useId } from 'vue'
import mapa from '../data/mapa.json'
import icons from '../data/icons.json'
import Icono from './Icono.vue'
import { around, rounded } from './ruta.js'

const props = defineProps({
	scene: String,
	scenes: Array,
	mini: Boolean, // miniatura: solo nodos activos como iconos, sin texto
	resumenOculto: Boolean, // conserva el resumen accesible sin mostrar la franja bajo el mapa
})

const uid = useId()
const seq = computed(() => (props.scenes?.length ?? 0) > 0)
const idx = ref(0)
const cur = computed(() => {
	const id = seq.value ? props.scenes[idx.value] : props.scene
	if (!mapa.scenes[id]) throw new Error(`MapaIncidente: la escena ${id} no existe en mapa.json`)
	return mapa.scenes[id]
})
const [W, HFULL] = mapa.vb

// --- Geometría ---
const N = mapa.nodes
const active = computed(() => new Set([...cur.value.nodos, ...cur.value.extremos]))
// Los carriles de respuesta solo ocupan sitio en las escenas que los usan; las anclas de arriba no se mueven.
const withLanes = computed(() => [...active.value].some((id) => N[id].lane))
const H = computed(() => (withLanes.value ? HFULL : mapa.lanes.oa.y - 8))
const center = (n) => [n.x + n.w / 2, n.y + n.h / 2]
function edge(n, [tx, ty], gap = 3) {
	const [cx, cy] = center(n)
	const dx = tx - cx
	const dy = ty - cy
	const k = Math.min((n.w / 2 + gap) / Math.abs(dx || 1e-9), (n.h / 2 + gap) / Math.abs(dy || 1e-9))
	return [cx + dx * k, cy + dy * k]
}

// Un tramo va de su origen a su destino por el camino más corto que rodea los demás nodos activos (las líneas van por debajo de los nodos).
function shape(s) {
	const A = N[s.a]
	const B = N[s.b]
	const [ax, ay] = center(A)
	const [bx, by] = center(B)
	const path = around([ax, ay], [bx, by], [...active.value].filter((id) => id !== s.a && id !== s.b).map((id) => N[id]))
	// Tramos paralelos entre los mismos nodos: se separan unos píxeles, en perpendicular a la cuerda.
	const len0 = Math.hypot(bx - ax, by - ay) || 1
	const shift = ([x, y]) => [x - ((by - ay) / len0) * s.off, y + ((bx - ax) / len0) * s.off]
	const pts = [shift(edge(A, path[1])), ...path.slice(1, -1).map(shift), shift(edge(B, path.at(-2)))]
	return { ...s, pts, d: rounded(pts), len: pts.reduce((n, p, i) => n + (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0) || 1 }
}
// Punto y dirección a la fracción t del recorrido de un tramo.
function along(s, t) {
	let d = t * s.len
	for (let i = 1; i < s.pts.length; i++) {
		const [x0, y0] = s.pts[i - 1]
		const [x1, y1] = s.pts[i]
		const l = Math.hypot(x1 - x0, y1 - y0) || 1
		if (d <= l || i === s.pts.length - 1) return { x: x0 + ((x1 - x0) * d) / l, y: y0 + ((y1 - y0) * d) / l, ux: (x1 - x0) / l, uy: (y1 - y0) / l }
		d -= l
	}
}

const segs = computed(() => {
	const all = []
	for (const lid of cur.value.enlaces) {
		const l = mapa.links[lid]
		l.segs.forEach(([a, b]) => active.value.has(a) && active.value.has(b) && all.push({ l, a, b }))
	}
	// Tramos paralelos entre los mismos nodos: se separan unos píxeles.
	const groups = new Map()
	for (const s of all) {
		const k = [s.a, s.b].sort().join('|')
		groups.set(k, [...(groups.get(k) ?? []), s])
	}
	for (const g of groups.values()) g.forEach((s, i) => (s.off = (i - (g.length - 1) / 2) * 8))
	return all.map(shape)
})

// Una insignia numerada por conexión, sobre el tramo más largo. Busca un punto que no tape el texto de un nodo activo.
// El texto de cada conexión va en la clave bajo el mapa.
const badges = computed(() => {
	const best = new Map()
	for (const s of segs.value) if (!best.has(s.l.id) || s.len > best.get(s.l.id).len) best.set(s.l.id, s)
	const boxes = [...active.value].map((id) => N[id])
	// Las insignias de cifra (esquina superior derecha de un nodo) también son obstáculos.
	const tags = boxes.filter((n) => cur.value.insignias[n.id]).map((n) => ({ x: n.x + n.w - 12 - cur.value.insignias[n.id].length * 7.2, y: n.y - 10, w: cur.value.insignias[n.id].length * 7.2 + 16, h: 20 }))
	const hits = (x, y) =>
		boxes.some((n) => x > n.x - 2 && x < n.x + n.w + 2 && y > n.y - 2 && y < n.y + n.h + 2) ||
		tags.some((t) => x > t.x - 8 && x < t.x + t.w + 8 && y > t.y - 8 && y < t.y + t.h + 8)
	const ts = Array.from({ length: 97 }, (_, i) => 0.02 + i * 0.01).sort((a, b) => Math.abs(a - 0.5) - Math.abs(b - 0.5))
	const placed = []
	return cur.value.enlaces.filter((id) => best.has(id)).map((id, i) => {
		const s = best.get(id)
		let spot = null
		search: for (const off of [0, 13, -13, 24, -24, 36, -36]) {
			for (const t of ts) {
				const { x: bx, y: by, ux, uy } = along(s, t)
				const x = bx - uy * off
				const y = by + ux * off
				if (!hits(x, y) && placed.every(([px, py]) => Math.hypot(px - x, py - y) > 17)) {
					spot = [x, y]
					break search
				}
			}
		}
		const mid = along(s, 0.5)
		spot ??= [mid.x, mid.y]
		placed.push(spot)
		return { id, n: i + 1, x: spot[0], y: spot[1], l: s.l }
	})
})
// Tramos consecutivos (el destino de uno es el origen del siguiente) se leen como una cadena: A → B → C.
function chain(pairs) {
	const out = []
	for (const [a, b] of pairs) {
		const last = out.at(-1)
		if (last && last.at(-1) === a) last.push(b)
		else out.push([a, b])
	}
	return out
}
// Nombre corto de un extremo. Los dos carriles de respuesta se llaman igual: se distinguen por organización.
const nameOf = (id) => (N[id].lane ? `${N[id].short} de ${mapa.lanes[N[id].lane].org}` : N[id].short)
const key = computed(() =>
	badges.value.map((b) => ({
		...b,
		tipo: b.l.blocked ? 'BLOQUEADA' : mapa.tipos[b.l.type].nombre,
		cls: b.l.blocked ? 'B' : b.l.type,
		rutas: chain(segs.value.filter((s) => s.l.id === b.id).map((s) => [s.a, s.b])),
	})),
)

// Insignia «?» (N28): sobre un nodo o sobre el centro de una conexión.
const signo = computed(() => {
	const s = cur.value.signo
	if (!s) return null
	if (s.startsWith('L')) {
		const b = badges.value.find((b) => b.id === s)
		return b ? [b.x + 14, b.y - 10] : null
	}
	const n = N[s]
	return [n.x, n.y]
})

function wrap(text, max) {
	const out = []
	let line = ''
	for (const w of text.split(' ')) {
		if (line && (line + ' ' + w).length > max) {
			out.push(line)
			line = w
		} else line = line ? line + ' ' + w : w
	}
	return [...out, line]
}
const lines = (n) => wrap(n.short, Math.floor((n.w - 32) / 6))
const cy = (n) => (n.h > 40 ? 17 : n.h / 2) // en nodos altos el rótulo va arriba y la nota fija debajo

const nodeList = computed(() => Object.values(N).filter((n) => withLanes.value || !n.lane).map((n) => ({ ...n, on: active.value.has(n.id), icons: [].concat(n.icon), badge: cur.value.insignias[n.id], dos: cur.value.dos?.includes(n.id) })))
const fixedNotes = computed(() => nodeList.value.filter((n) => n.on && n.nota))
const zoneLabel = (z) => wrap(z.label, Math.floor((z.w - 12) / 5.3))
const zoneList = computed(() => Object.entries(mapa.zones).map(([k, z]) => ({ k, ...z, lines: zoneLabel(z) })))
const laneList = computed(() => Object.entries(mapa.lanes).map(([k, z]) => ({ k, ...z })))
const types = Object.keys(mapa.tipos)

// --- Descripción para lector de pantalla ---
// Cada nodo con su organización o zona; cada conexión con origen, destino, tipo y restricción. Cambia con la escena.
const place = (id) => (N[id].lane ? mapa.lanes[N[id].lane] : mapa.zones[N[id].zone]).label
const full = (id) => `${N[id].label}${id.includes('.') && !N[id].lane ? ` · ${N[id].short}` : ''} (${place(id)})`
const spoken = (path, l, f) => (l.both ? `entre ${path.map(f).join(' y ')}, en los dos sentidos` : `de ${path.map(f).join(' a ')}`)
const alt = computed(() => {
	const nodes = [...active.value].map(full)
	const conns = key.value.map((k) => `Conexión ${k.n}, ${k.l.label}, ${k.tipo.toLowerCase()}: ${k.rutas.map((r) => spoken(r, k.l, full)).join('; ')}`)
	const unsure = cur.value.signo ? ` Marca de interrogación: sin confirmar, sobre ${cur.value.signo.startsWith('L') ? `la conexión ${key.value.find((k) => k.id === cur.value.signo)?.n}` : full(cur.value.signo)}.` : ''
	return `${cur.value.titulo}. ${cur.value.fecha}. Nodos activos: ${nodes.join('; ') || 'ninguno'}. Conexiones: ${conns.join('. ') || 'ninguna'}.${unsure}`
})
// Texto de la clave: con mucho texto, la clave gana ancho (columnas) y el mapa se reduce un poco (compacto).
const chars = computed(() => key.value.reduce((n, k) => n + k.l.label.length + k.tipo.length + k.rutas.flat().reduce((m, r) => m + nameOf(r).length + 4, 0), 0))
const fronteras = computed(() => cur.value.frontera.map((f) => [f, mapa.fronteras[f].label]))

function go(d) {
	idx.value = Math.min(props.scenes.length - 1, Math.max(0, idx.value + d))
}
function onKey(ev) {
	if (!seq.value || ev.target.tagName === 'SUMMARY') return
	const to = { ArrowLeft: idx.value - 1, ArrowRight: idx.value + 1, Home: 0, End: props.scenes.length - 1 }[ev.key]
	if (to === undefined) return
	ev.preventDefault()
	idx.value = Math.min(props.scenes.length - 1, Math.max(0, to))
}
const iconBody = (n) => icons.icons[n]
// Barra transversal al final de una conexión bloqueada, perpendicular a la dirección de llegada.
function stop(s) {
	const [rx, ry] = s.pts.at(-2)
	const [qx, qy] = s.pts.at(-1)
	const len = Math.hypot(qx - rx, qy - ry) || 1
	const nx = ((ry - qy) / len) * 7
	const ny = ((qx - rx) / len) * 7
	return { x1: qx + nx, y1: qy + ny, x2: qx - nx, y2: qy - ny }
}
</script>

<template>
	<figure class="mapa" :class="{ mini, compacto: cur.compacto || chars > 700, larga: chars > 350 }" :data-escena="cur.id" @keydown="onKey">
		<div v-if="seq" class="ctrl">
			<button type="button" :aria-disabled="idx === 0" @click="go(-1)">← Anterior</button>
			<p aria-live="polite">
				<strong>Escena {{ idx + 1 }} de {{ scenes.length }}</strong> · {{ cur.fecha }} · {{ cur.titulo }}
			</p>
			<button type="button" :aria-disabled="idx === scenes.length - 1" @click="go(1)">Siguiente →</button>
		</div>

		<svg class="plano" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-labelledby="`${uid}-t`" :aria-describedby="`${uid}-d`" preserveAspectRatio="xMidYMid meet">
			<title :id="`${uid}-t`">Mapa del incidente · {{ cur.titulo }}</title>
			<desc :id="`${uid}-d`">{{ alt }}</desc>
			<defs>
				<marker v-for="k in types" :id="`${uid}-m-${k}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
					<path d="M0 1 L10 5 L0 9 z" :class="`mk mk-${k}`" />
				</marker>
			</defs>

			<!-- Zonas y carriles -->
			<g v-for="z in zoneList" :key="z.k" :class="`zona t-${z.tone}`">
				<rect :x="z.x" :y="z.y" :width="z.w" :height="z.h" rx="8" />
				<text :x="z.x + 8" :y="z.y + 12" class="zl"><tspan v-for="(t, i) in z.lines" :key="i" :x="z.x + 8" :dy="i ? 11 : 0">{{ t }}</tspan></text>
			</g>
			<template v-if="withLanes">
				<g v-for="z in laneList" :key="z.k" :class="`zona carril t-${z.tone}`">
					<rect :x="z.x" :y="z.y" :width="z.w" :height="z.h" rx="8" />
					<text :x="z.x + 8" :y="z.y + 15" class="zl">{{ z.label }}</text>
				</g>
			</template>

			<!-- Conexiones (debajo de los nodos; sus trazados rodean los nodos activos) -->
			<g class="conexiones">
				<template v-for="(s, i) in segs" :key="`${s.l.id}-${i}`">
					<path :d="s.d" :data-a="s.a" :data-b="s.b" :class="`ln ln-${s.l.blocked ? 'B' : s.l.type}`" :marker-end="s.l.blocked ? undefined : `url(#${uid}-m-${s.l.type})`" :marker-start="s.l.both ? `url(#${uid}-m-${s.l.type})` : undefined" />
					<line v-if="s.l.blocked" v-bind="stop(s)" class="ln ln-B" />
				</template>
			</g>

			<!-- Nodos -->
			<g v-for="n in nodeList" :key="n.id" :data-id="n.id" :class="['nodo', n.on ? 'on' : 'off', n.zone ? `t-${mapa.zones[n.zone].tone}` : `t-${mapa.lanes[n.lane].tone}`]" :transform="`translate(${n.x} ${n.y})`">
				<rect v-if="n.dos && n.on" :x="5" :y="-5" :width="n.w" :height="n.h" rx="6" class="caja caja2" />
				<rect :width="n.w" :height="n.h" rx="6" class="caja" />
				<template v-if="n.icons.length === 2">
					<svg :x="3" :y="cy(n) - 7 - 3" width="14" height="14" viewBox="0 0 32 32" class="ic" v-html="iconBody(n.icons[0])" />
					<svg :x="10" :y="cy(n) - 7 + 3" width="14" height="14" viewBox="0 0 32 32" class="ic" v-html="iconBody(n.icons[1])" />
				</template>
				<svg v-else :x="6" :y="cy(n) - 9" width="18" height="18" viewBox="0 0 32 32" class="ic" v-html="iconBody(n.icons[0])" />
				<text v-if="n.on && !mini" class="nt">
					<tspan v-for="(t, i) in lines(n)" :key="i" :x="28" :y="cy(n) + 4 + (i - (lines(n).length - 1) / 2) * 12.5">{{ t }}</tspan>
				</text>
				<title v-if="n.on">{{ n.label }}{{ n.id.includes('.') ? ` · ${n.short}` : '' }}</title>
			</g>

			<!-- Notas fijas: límites que no se ocultan -->
			<template v-if="!mini">
				<g v-for="n in fixedNotes" :key="n.id" class="nota">
					<template v-if="n.id === 'N15'">
						<rect :x="mapa.zones.hf.x + 6" :y="mapa.zones.hf.y + 28 + 6 * 42 + 1" :width="mapa.zones.hf.w - 12" height="18" rx="4" class="notab" />
						<text :x="mapa.zones.hf.x + 12" :y="mapa.zones.hf.y + 28 + 6 * 42 + 14" class="nn">{{ n.nota }}</text>
					</template>
					<text v-else :x="n.x + 8" :y="n.y + 46" class="nn"><tspan v-for="(t, i) in wrap(n.nota, 17)" :key="i" :x="n.x + 8" :dy="i ? 11.5 : 0">{{ t }}</tspan></text>
				</g>
			</template>

			<!-- Insignias de cifra -->
			<g v-for="n in nodeList.filter((m) => m.on && m.badge)" :key="`b-${n.id}`" class="insignia" :transform="`translate(${n.x + n.w - 4} ${n.y - 2})`">
				<rect :x="-(n.badge.length * 3.6 + 6)" y="-7" :width="n.badge.length * 7.2 + 12" height="14" rx="7" />
				<text :x="-(n.badge.length * 3.6 + 6) + (n.badge.length * 7.2 + 12) / 2" y="3" text-anchor="middle">{{ n.badge }}</text>
			</g>

			<!-- Número de conexión (su texto va en la clave) -->
			<g v-if="!mini" class="nums">
				<g v-for="b in badges" :key="b.id" :transform="`translate(${b.x} ${b.y})`">
					<circle r="7.5" :class="`cn cn-${b.l.blocked ? 'B' : b.l.type}`" />
					<text y="3.3" text-anchor="middle">{{ b.n }}</text>
				</g>
			</g>

			<g v-if="signo" class="signo" :transform="`translate(${signo[0]} ${signo[1]})`">
				<circle r="9" />
				<text y="4" text-anchor="middle">?</text>
			</g>
		</svg>

		<slot name="detalle" />

		<div v-if="!mini" class="meta" :class="{ sr: resumenOculto }">
			<div class="col">
				<p v-for="t in cur.lineas" :key="t" class="linea">{{ t }}</p>
				<ul v-if="cur.chips" class="chips">
					<li v-for="c in cur.chips" :key="c">{{ c }}</li>
				</ul>
				<p v-if="cur.limite" class="limite"><Icono name="help" :size="18" /> {{ cur.limite }}</p>
				<p v-if="fronteras.length" class="fronteras">
					<span v-for="[f, label] in fronteras" :key="f"><strong>Frontera {{ f }}</strong> · {{ label }}</span>
				</p>
			</div>
			<div v-if="key.length" class="der">
				<p class="titulo-clave">Conexiones del mapa</p>
				<ol class="clave" :class="{ dos: key.length > 3 }" aria-label="Conexiones de esta escena">
					<li v-for="k in key" :key="k.id">
						<span :class="`cn-t cn-${k.cls}`" aria-hidden="true">{{ k.n }}</span>
						<span class="kt">
							<span class="kl"><span class="sr">Conexión {{ k.n }}. </span>{{ k.l.label }}:</span>{{ ' ' }}<span class="kr">
								<template v-for="(r, i) in k.rutas" :key="i">
									<span aria-hidden="true">{{ r.map(nameOf).join(k.l.both ? ' ↔ ' : ' → ') }}{{ i < k.rutas.length - 1 ? '; ' : '' }}</span>
									<span class="sr">{{ spoken(r, k.l, nameOf) }}. </span>
								</template>
							</span>{{ ' ' }}<span class="kk">
								<svg class="muestra" viewBox="0 0 30 8" aria-hidden="true">
									<line x1="1" y1="4" :x2="k.cls === 'B' ? 25 : 28" y2="4" :class="`ln ln-${k.cls}`" :marker-end="k.cls === 'B' ? undefined : `url(#${uid}-m-${k.cls})`" />
									<line v-if="k.cls === 'B'" x1="26" y1="0" x2="26" y2="8" class="ln ln-B" />
								</svg>
								{{ k.tipo }}
							</span>
						</span>
					</li>
				</ol>
			</div>
			<ul v-if="cur.leyenda" class="leyenda-cve">
				<li v-for="[e, d] in cur.leyenda" :key="e"><strong>{{ e }}</strong> · {{ d }}</li>
			</ul>
			<ul v-if="cur.fichas" class="fichas">
				<li v-for="f in cur.fichas" :key="f[0]">
					<strong>{{ f[0] }}</strong>
					<span>{{ f[1] }}</span>
					<span>{{ f[2] }} · {{ f[3] }}</span>
					<span class="estado">{{ f[4] }}</span>
				</li>
			</ul>
		</div>
	</figure>
</template>

<style scoped>
.mapa {
	position: relative;
	margin: 0;
	color: #111827;
	font-family: inherit;
}
svg.plano {
	display: block;
	width: 100%;
	height: auto;
	overflow: visible;
}
.ctrl {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 0.5rem;
}
.ctrl p {
	flex: 1;
	margin: 0;
	text-align: center;
	line-height: 1.3;
}
.ctrl button {
	padding: 0.35rem 0.8rem;
	border: 2px solid #111827;
	border-radius: 0.4rem;
	background: #fff;
	color: #111827;
	font: inherit;
	font-weight: 700;
	cursor: pointer;
}
.ctrl button[aria-disabled='true'] {
	border-color: #6b7280;
	color: #4b5563;
	cursor: default;
}
.ctrl button:focus-visible {
	outline: 3px solid #1d4ed8;
	outline-offset: 2px;
}

/* Tonos: borde y texto oscuros sobre fondos claros (≥ 4.5:1). El color no es la única señal: cada estado lleva rótulo. */
.t-oa { --bg: #eff6ff; --line: #3b5bdb; --ink: #1e3a8a; }
.t-hf { --bg: #fffbeb; --line: #b45309; --ink: #78350f; }
.t-net { --bg: #f3f4f6; --line: #6b7280; --ink: #374151; }
.t-app { --bg: #f5f3ff; --line: #6d28d9; --ink: #4c1d95; }
.zona rect { fill: var(--bg); stroke: var(--line); stroke-width: 1.2; }
.zl { fill: var(--ink); font-size: 10.5px; font-weight: 700; letter-spacing: 0.01em; }
.carril rect { stroke-dasharray: 4 3; }

.nodo .caja { fill: #fff; stroke: var(--ink); stroke-width: 2; transition: opacity 0.25s; }
.nodo .caja2 { stroke-width: 1.5; }
.nodo.off .caja { fill: transparent; stroke: var(--line); stroke-width: 1; opacity: 0.4; }
.nodo.off .ic { opacity: 0.4; }
.nodo .ic { color: var(--ink); fill: currentColor; transition: opacity 0.25s; }
.nt { fill: #111827; font-size: 11.5px; font-weight: 600; }

.ln { fill: none; stroke-linecap: round; }
.ln-E { stroke: #4b5563; stroke-width: 1.6; }
.ln-A { stroke: #111827; stroke-width: 2.8; }
.ln-I { stroke: #0f766e; stroke-width: 2.4; stroke-dasharray: 7 4; }
.ln-X { stroke: #9a3412; stroke-width: 2.6; stroke-dasharray: 1 6; }
.ln-B { stroke: #b91c1c; stroke-width: 3; }
.mk { stroke: none; }
.mk-E { fill: #4b5563; }
.mk-A { fill: #111827; }
.mk-I { fill: #0f766e; }
.mk-X { fill: #9a3412; }

.cn { fill: #fff; stroke: #111827; stroke-width: 1.8; }
.cn-B { stroke: #b91c1c; }
.cn-I { stroke: #0f766e; }
.cn-X { stroke: #9a3412; }
.nums text { fill: #111827; font-size: 9.5px; font-weight: 800; }
.nn { fill: #1f2937; font-size: 10px; font-weight: 700; }
.notab { fill: #fff; stroke: #78350f; stroke-width: 1.2; }
.insignia rect { fill: #1f2937; }
.insignia text { fill: #fff; font-size: 10.5px; font-weight: 700; }
.signo circle { fill: #fde68a; stroke: #78350f; stroke-width: 2; }
.signo text { fill: #451a03; font-size: 13px; font-weight: 800; }

/* Texto bajo el mapa: a la izquierda las líneas de pantalla; a la derecha, la clave de conexiones. */
.meta { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 0.3rem 1.2rem; margin-top: 0.4rem; }
.meta p, .meta ul, .meta ol { margin: 0; }
.leyenda-cve, .fichas { grid-column: 1 / -1; }
.linea { font-size: 1.2em; line-height: 1.3; font-weight: 600; }
.limite { margin-top: 0.15rem !important; padding: 0.15rem 0.7rem; border-left: 4px solid #7a2e0e; background: #fff7ed; font-size: 0.9em; line-height: 1.3; }
.chips, .leyenda-cve, .fichas, .clave { padding: 0; list-style: none; }
.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem !important; }
.chips li { margin: 0; line-height: 1.3; padding: 0.1rem 0.7rem; border: 2px solid #111827; border-radius: 999px; font-weight: 700; font-size: 0.9em; }
.der { min-width: 0; font-size: 0.7em; line-height: 1.3; color: #1f2937; }
.titulo-clave { margin: 0 !important; font-size: inherit; line-height: 1.2; font-weight: 700; }
.clave { margin: 0; padding: 0; list-style: none; }
.clave.dos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.25rem 0.8rem; }
.clave li { display: flex; align-items: flex-start; gap: 0.4rem; margin: 0; line-height: 1.25; }
.kt { min-width: 0; }
.kl { font-weight: 700; }
.kk { font-size: 0.85em; font-weight: 700; color: #374151; white-space: nowrap; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.cn-t { display: inline-flex; align-items: center; justify-content: center; flex: none; box-sizing: border-box; width: 1.5em; height: 1.5em; border: 2px solid #111827; border-radius: 50%; background: #fff; font-weight: 800; font-size: 0.95em; line-height: 1; }
.cn-t.cn-B { border-color: #b91c1c; }
.cn-t.cn-I { border-color: #0f766e; }
.cn-t.cn-X { border-color: #9a3412; }
.muestra { display: inline-block; vertical-align: middle; width: 2.2em; height: 0.7em; overflow: visible; }
.leyenda-cve { display: grid; gap: 0.3rem; margin-top: 0.3rem !important; }
.leyenda-cve li { margin: 0; padding: 0.3rem 0.8rem; border: 2px solid #111827; border-radius: 0.4rem; line-height: 1.3; }
.fichas { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; margin-top: 0.3rem !important; }
.fichas li { margin: 0; display: flex; flex-direction: column; gap: 0.05rem; padding: 0.25rem 0.45rem; border: 2px solid #111827; border-radius: 0.4rem; font-size: 0.74em; line-height: 1.2; }
.fichas .estado { margin-top: auto; padding-top: 0.2rem; font-weight: 800; }
.fronteras { display: flex; flex-direction: column; margin-top: 0.15rem !important; font-size: 0.74em; line-height: 1.25; color: #374151; }

@media (min-width: 761px) {
	.compacto svg.plano { width: 79%; margin: 0 auto; }
	.larga .meta { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr); }
}
@media (max-width: 760px) {
	.mapa:not(.mini) svg.plano { min-width: 700px; }
	.mapa:not(.mini) { overflow-x: auto; }
	.fichas { grid-template-columns: 1fr 1fr; }
	.meta { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
	* { transition: none !important; }
}
</style>
