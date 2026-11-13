<script setup>
// Diapositiva: título, acto, mapa de la escena (frontmatter `scene`) y contenido.
// Mapa autocontenido de esta charla (components/MapaIncidente.vue + data/mapa.json).
import MapaIncidente from '../components/MapaIncidente.vue'
import Banner from '../components/Banner.vue'
</script>

<template>
	<div class="slidev-layout pantalla" :class="{ 'sin-mapa': !$frontmatter.scene && !$frontmatter.mini && !$frontmatter.respaldo }">
		<Banner marca />
		<header>
			<h1>{{ $frontmatter.title }}</h1>
			<p v-if="$frontmatter.acto" class="acto">{{ $frontmatter.acto }}</p>
			<p v-else-if="$frontmatter.respaldo" class="acto">Respaldo · fuera del tiempo principal</p>
		</header>
		<MapaIncidente v-if="$frontmatter.scene" :scene="$frontmatter.scene" :periodo="$frontmatter.periodo" />
		<div class="cuerpo"><slot /></div>
		<div v-if="$frontmatter.mini" class="miniatura">
			<MapaIncidente :scene="$frontmatter.mini" :periodo="$frontmatter.periodo" mini />
		</div>
	</div>
</template>
