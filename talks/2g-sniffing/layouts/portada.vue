<script setup>
// Portada (solo slide 1): banner, título/autor/descripción y, al fondo,
// una franja con el espectro GSM (retrogram) y un barrido animado "en vivo".
import Banner from '../components/Banner.vue'
import spectrum from '../img/spectrum.webp'
</script>

<template>
	<div class="slidev-layout portada">
		<Banner />
		<div class="portada-cuerpo"><slot /></div>
		<div class="portada-espectro">
			<img :src="spectrum" alt="Espectro GSM en vivo (retrogram-plutosdr)" />
			<span class="barrido"></span>
		</div>
	</div>
</template>
