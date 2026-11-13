<script setup>
// Portada: banner Deep Security arriba; título, autor, descripción y logo YachaqLabs.
import Banner from '../components/Banner.vue'
</script>

<template>
	<div class="slidev-layout portada">
		<Banner />
		<div class="portada-cuerpo"><slot /></div>
	</div>
</template>
