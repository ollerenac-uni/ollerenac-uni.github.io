<script setup>
// Cabecera persistente: banner Deep Security a sangre.
import banner from '../img/banner-deepsecurity.jpg'
</script>

<template>
	<div class="banner">
		<img class="banner-bg" :src="banner" alt="Deep Security · Expertos en Ciberseguridad" />
		<div class="banner-panel" aria-hidden="true"></div>
	</div>
</template>
