<script setup>
// Línea de tiempo del incidente. La usan el post (Astro) y la charla (Slidev).
// Datos: shared/data/timeline.json (de docs/timeline.md; ver scripts/timeline-md-to-json.mjs).
// Modo post (sin `step`): pestañas por fase, flechas ← → y Inicio/Fin cambian de fase.
// Modo diapositiva (con `step`): revela los primeros `step` grupos, de uno en uno.
import { computed, nextTick, ref, useId } from 'vue'
import timeline from '../data/timeline.json'
import sources from '../data/sources.json'

const props = defineProps({
	groups: Array, // [{ label, ids: ['E03', …], lane? }]. Por defecto, una por fase.
	step: Number,
	compact: Boolean,
	level: { type: Number, default: 3 }, // nivel de los títulos de grupo
})

const uid = useId()
const external = computed(() => typeof props.step === 'number')

const byId = new Map(
	timeline.events.map((e) => {
		const codes = [...new Set(e.limit.match(/\b[DL]\d+\b/g) ?? [])]
		const kind = codes.some((c) => c[0] === 'D') ? 'Discrepancia' : codes.length ? 'Límite' : 'Nota'
		const src = e.source.split(/\b(S\d+(?:PDF)?)\b/).filter(Boolean)
		return [e.id, { ...e, kind, codes: codes.join('/'), src: src.map((t) => ({ t, ...sources[t] })) }]
	}),
)

const groups = computed(() =>
	(props.groups ?? timeline.phases.map((p) => ({ label: p, ids: timeline.events.filter((e) => e.phase === p).map((e) => e.id) }))).map((g) => ({
		...g,
		events: g.ids.map((id) => {
			if (!byId.has(id)) throw new Error(`Timeline: el evento ${id} no existe en timeline.json`)
			return byId.get(id)
		}),
	})),
)

const sel = ref(-1) // -1 = todas las fases
const touched = ref(false) // anima solo después de una acción del lector
const visible = computed(() => {
	if (external.value) return groups.value.slice(0, props.step).map((g, i, a) => ({ ...g, current: i === a.length - 1 }))
	return sel.value < 0 ? groups.value : [groups.value[sel.value]]
})
const lanes = computed(() => {
	const m = new Map()
	for (const g of visible.value) m.set(g.lane ?? '', [...(m.get(g.lane ?? '') ?? []), g])
	return [...m]
})

function when(e) {
	if (!props.compact) return [e.date, e.time].filter(Boolean).join(' · ')
	return /^\d\d:\d\d UTC$/.test(e.time) ? `${e.date} · ${e.time}` : e.date
}

function select(i) {
	sel.value = i
	touched.value = true
}
function onKey(ev) {
	const n = groups.value.length + 1
	const i = sel.value + 1
	const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[ev.key]
	if (to === undefined) return
	ev.preventDefault()
	select(to - 1)
	nextTick(() => document.getElementById(`${uid}-tab-${to}`)?.focus())
}
</script>

<template>
	<figure class="tl" :class="{ compact }" :aria-label="`Línea de tiempo: ${timeline.events.length} eventos en ${timeline.phases.length} fases`">
		<template v-if="!external">
			<div class="tl-tabs" role="tablist" aria-label="Fases del incidente" @keydown="onKey">
				<button
					v-for="(label, i) in ['Todas', ...groups.map((g) => g.label)]"
					:id="`${uid}-tab-${i}`"
					:key="label"
					type="button"
					role="tab"
					:aria-selected="sel === i - 1"
					:aria-controls="`${uid}-panel`"
					:tabindex="sel === i - 1 ? 0 : -1"
					@click="select(i - 1)"
				>
					{{ label }} <span class="n">({{ i === 0 ? timeline.events.length : groups[i - 1].events.length }})</span>
				</button>
			</div>
			<p class="tl-hint">Con el foco en las fases: ← y → cambian de fase; Inicio y Fin van a la primera y a la última.</p>
		</template>

		<div :id="`${uid}-panel`" :role="external ? undefined : 'tabpanel'" :aria-labelledby="external ? undefined : `${uid}-tab-${sel + 1}`" :tabindex="external ? undefined : 0">
			<div v-for="[lane, gs] in lanes" :key="lane" class="tl-lane">
				<p v-if="lane" class="tl-lane-name">{{ lane }}</p>
				<div class="tl-groups">
					<section v-for="g in gs" :key="g.label" class="tl-group" :class="{ current: g.current, animate: touched || external }">
						<component :is="`h${level}`" class="tl-title">{{ g.label }}</component>
						<ol>
							<li v-for="(e, k) in g.events" :key="e.id" class="ev" :class="{ d: e.kind === 'Discrepancia' }" :style="{ '--i': Math.min(k, 12) }">
								<p class="ev-head">
									<strong class="ev-id">{{ e.id }}</strong>
									<span>{{ when(e) }}</span>
									<span v-if="compact && e.codes" class="badge">{{ e.kind }} {{ e.codes }}</span>
								</p>
								<p v-if="!compact" class="ev-fact">{{ e.fact }}</p>
								<p v-if="!compact" class="ev-meta">
									{{ e.phase }} · {{ e.actor }} · Fuente:
									<template v-for="s in e.src" :key="s.t"><a v-if="s.url" :href="s.url" :title="s.label">{{ s.t }}</a><template v-else>{{ s.t }}</template></template>
								</p>
								<p v-if="!compact" class="ev-limit"><strong>{{ e.kind === 'Nota' ? 'Nota' : `${e.kind} (${e.codes})` }}.</strong> {{ e.limit }}</p>
							</li>
						</ol>
					</section>
				</div>
			</div>
		</div>

		<figcaption v-if="!compact">
			Fechas y horas en UTC, como las declara cada fuente. «Sin hora» conserva la precisión de la fuente. Las fases se solapan en el tiempo. Cada evento declarado es un hecho atribuido a su fuente.
		</figcaption>
	</figure>
</template>

<style scoped>
.tl {
	--ink: #1f2937;
	--muted: #4b5563;
	--accent: #1d4ed8;
	--warn-bg: #fff1d6;
	--warn-ink: #7a2e0e;
	margin: 1.5em 0;
	color: var(--ink);
	font-size: 0.8em;
	line-height: 1.45;
	text-align: left;
}
.tl p {
	margin: 0;
}
.tl-tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em;
}
.tl-tabs button {
	padding: 0.35em 0.7em;
	border: 2px solid var(--accent);
	border-radius: 0.4em;
	background: #fff;
	color: var(--accent);
	font: inherit;
	font-weight: 600;
	cursor: pointer;
}
.tl-tabs button[aria-selected='true'] {
	background: var(--accent);
	color: #fff;
}
.tl-tabs .n {
	font-weight: 400;
}
.tl-hint {
	margin: 0.5em 0 1em;
	color: var(--muted);
}
.tl :focus-visible {
	outline: 3px solid var(--accent);
	outline-offset: 2px;
}
.tl-lane + .tl-lane {
	margin-top: 0.8em;
}
.tl-lane-name {
	margin-bottom: 0.3em;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
}
.tl-groups {
	display: flex;
	flex-direction: column;
	gap: 1em;
}
.tl-group {
	padding-left: 0.9em;
	border-left: 4px solid #9ca3af;
}
.tl-group.current {
	border-left-color: var(--accent);
}
.tl-title {
	margin: 0 0 0.4em;
	font-size: 1.15em;
	line-height: 1.25;
}
.tl ol {
	margin: 0;
	padding: 0;
	list-style: none;
}
.ev {
	margin: 0 0 0.75em;
	padding: 0;
}
.ev-head {
	display: flex;
	flex-wrap: wrap;
	gap: 0.2em 0.7em;
	align-items: baseline;
}
.ev-id {
	font-family: ui-monospace, 'Fira Code', monospace;
}
.ev.d {
	padding-left: 0.6em;
	border-left: 4px solid var(--warn-ink);
}
.badge {
	padding: 0 0.45em;
	border: 1px solid var(--warn-ink);
	border-radius: 0.3em;
	background: var(--warn-bg);
	color: var(--warn-ink);
	font-weight: 700;
}
.ev-fact {
	font-size: 1.05em;
}
.ev-meta {
	color: var(--muted);
}
.ev-meta a {
	color: var(--accent);
}
.ev-limit {
	margin-top: 0.2em;
	color: var(--ink);
}
.d .ev-limit {
	color: var(--warn-ink);
}

/* Diapositivas: grupos en fila; cada evento ocupa una línea (ID, fecha, marca). Fase, actor y fuente van en el pie. */
.compact {
	margin: 0.6em 0 0;
	font-size: 0.78rem;
	line-height: 1.3;
}
.compact .tl-groups {
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: 0.8rem;
}
.compact .tl-group {
	flex: 0 1 12.5rem; /* ancho fijo: las columnas no se mueven al revelar el siguiente grupo */
	min-width: 0;
}
.compact .tl-title {
	font-size: 1rem;
}
.compact .ev {
	margin-bottom: 0.45rem;
}
.compact .ev-head {
	gap: 0.15em 0.5em;
	font-size: 0.8rem;
}

.animate .ev,
.animate.tl-group {
	animation: tl-in 0.35s ease both;
}
.animate .ev {
	animation-delay: calc(var(--i) * 40ms);
}
@keyframes tl-in {
	from {
		opacity: 0;
		transform: translateY(0.5em);
	}
}
@media (prefers-reduced-motion: reduce), print {
	.animate .ev,
	.animate.tl-group {
		animation: none;
	}
}
</style>
