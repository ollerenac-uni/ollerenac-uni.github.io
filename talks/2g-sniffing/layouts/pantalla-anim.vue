<script setup>
// Igual que pantalla (banner + título fijos arriba), pero el canvas es contenido
// libre animable (slide 2 y 4). Mantiene la cabecera en la misma posición.
import Banner from '../components/Banner.vue'
</script>

<template>
	<div class="slidev-layout pantalla pantalla-anim">
		<Banner />
		<header><h1>{{ $frontmatter.title }}</h1></header>
		<div class="lienzo"><slot /></div>
	</div>
</template>
