<script setup>
// Pie de diapositiva: rótulo de evidencia + fuentes con enlace oficial.
// refs: [['S7', 'pp. 6–9'], …] (ID de shared/data/sources.json y localizador). El slot añade texto libre.
import sources from '../../../shared/data/sources.json'

defineProps({
	tag: { type: [String, Array], default: () => [] }, // HECHO atribuido | OPINIÓN | NO CONFIRMADO | RECOMENDACIÓN EDITORIAL
	refs: { type: Array, default: () => [] },
})
</script>

<template>
	<footer class="fuentes">
		<span v-for="t in [].concat(tag)" :key="t" class="tag">{{ t }}</span>
		<span v-if="refs.length">
			Fuentes:
			<template v-for="([id, loc], i) in refs" :key="id">
				<a :href="sources[id].url">{{ sources[id].label }} ({{ id }})</a>{{ loc ? `, ${loc}` : '' }}{{ i < refs.length - 1 ? '; ' : '. ' }}
			</template>
		</span>
		<slot />
	</footer>
</template>
