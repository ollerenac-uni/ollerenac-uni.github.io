<script setup>
// Diagrama de flujo conceptual. stages: columnas de nodos [[{ t, note? }], …]; una columna con varios nodos es una bifurcación.
// step cuenta nodos en orden de lectura. reveal: muestra solo los primeros `step`.
// Sin reveal: rellena los primeros `step` (recorrido hecho) y marca el último con un halo. Al final, todo el recorrido queda relleno.
import { computed } from 'vue'

const props = defineProps({
	stages: { type: Array, required: true },
	step: { type: Number, default: 0 },
	reveal: Boolean,
	caption: String,
	label: String,
})

const flat = computed(() => {
	let n = 0
	return props.stages.map((col) => col.map((node) => ({ ...node, i: n++ })))
})
</script>

<template>
	<figure class="flow" :aria-label="label">
		<ol>
			<li v-for="(col, c) in flat" :key="c" :class="{ gone: reveal && col[0].i >= step }">
				<ul>
					<li v-for="n in col" :key="n.i" :class="{ node: true, on: !reveal && n.i < step, now: !reveal && n.i === step - 1, gone: reveal && n.i >= step }">
						{{ n.t }}<small v-if="n.note">{{ n.note }}</small>
					</li>
				</ul>
			</li>
		</ol>
		<figcaption v-if="caption">{{ caption }}</figcaption>
	</figure>
</template>

<style scoped>
.flow {
	margin: 1.5rem 0 0;
	color: #1f2937;
}
/* `.flow` sube la especificidad: el tema de Slidev da margen y sangría a ol/ul dentro de .slidev-layout. */
.flow ol,
.flow ul {
	margin: 0;
	padding: 0;
	list-style: none;
}
.flow ol {
	display: flex;
	align-items: center;
	gap: 2.2rem;
}
.flow ol > li {
	position: relative;
	flex: 1 1 0;
	min-width: 0;
	margin: 0;
}
.flow ol > li + li::before {
	content: '→' / '';
	position: absolute;
	left: -1.9rem;
	top: 50%;
	translate: 0 -50%;
	font-size: 1.6rem;
	color: #1d4ed8;
}
.flow ul {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}
.node {
	margin: 0;
	padding: 0.7rem 0.5rem;
	border: 2px solid #1d4ed8;
	border-radius: 0.5rem;
	background: #eff6ff;
	font-size: 1.05rem;
	font-weight: 600;
	line-height: 1.25;
	text-align: center;
}
.node.on {
	background: #1d4ed8;
	color: #fff;
}
.node.now {
	box-shadow: 0 0 0 4px #93c5fd;
}
.node small {
	display: block;
	margin-top: 0.4rem;
	font-size: 0.85rem;
	font-weight: 400;
}
.gone,
.gone::before {
	visibility: hidden;
}
figcaption {
	margin-top: 1.2rem;
	padding: 0.5rem 0.8rem;
	border-left: 4px solid #1d4ed8;
	font-size: 1.05rem;
}
</style>
