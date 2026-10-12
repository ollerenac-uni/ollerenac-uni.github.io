<script setup>
// Diapositiva de la charla: título, mapa de la escena (frontmatter `scene`) y contenido.
// `mini: C10` añade la miniatura de una escena bajo el contenido. `respaldo: true` rotula las diapositivas fuera de los 40 minutos.
import MapaIncidente from '../../../shared/components/MapaIncidente.vue'
</script>

<template>
	<div class="slidev-layout pantalla" :class="{ 'sin-mapa': !$frontmatter.scene && !$frontmatter.mini && !$frontmatter.respaldo }">
		<header>
			<h1>{{ $frontmatter.title }}</h1>
			<p v-if="$frontmatter.acto" class="acto">{{ $frontmatter.acto }}</p>
			<p v-else-if="$frontmatter.respaldo" class="acto">Respaldo para preguntas · fuera de los 40 minutos</p>
		</header>
		<MapaIncidente v-if="$frontmatter.scene" :scene="$frontmatter.scene" />
		<div class="cuerpo"><slot /></div>
		<div v-if="$frontmatter.mini" class="miniatura">
			<MapaIncidente :scene="$frontmatter.mini" mini />
		</div>
	</div>
</template>
