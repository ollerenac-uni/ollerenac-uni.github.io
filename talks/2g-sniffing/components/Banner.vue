<script setup>
// Cabecera persistente: banner Deep Security a sangre; con `marca`, el logo
// YachaqLabs translúcido a la izquierda (diapositivas de contenido).
import banner from '../img/banner-deepsecurity.jpg'
import logo from '../img/yachaqlabs.svg'
defineProps({ marca: Boolean })
</script>

<template>
	<div class="banner">
		<img class="banner-bg" :src="banner" alt="Deep Security · Expertos en Ciberseguridad" />
		<div v-if="marca" class="banner-marca">
			<img class="banner-logo" :src="logo" alt="YachaqLabs" />
		</div>
	</div>
</template>
