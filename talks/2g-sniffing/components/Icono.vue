<script setup>
// Icono del set Carbon, empaquetado en shared/data/icons.json (sin red). Decorativo: aria-hidden.
import icons from '../data/icons.json'

defineProps({ name: { type: String, required: true }, size: { type: [Number, String], default: 24 } })
</script>

<template>
	<svg class="icono" :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true" focusable="false" v-html="icons.icons[name]" />
</template>

<style scoped>
.icono {
	display: inline-block;
	flex: none;
	vertical-align: -0.2em;
	fill: currentColor;
}
</style>
