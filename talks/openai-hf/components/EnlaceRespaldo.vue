<script setup>
// Enlace de la diapositiva final al primer respaldo. En la web es el <Link> de Slidev.
// Al exportar, <Link> apunta a «#33» pero el contenedor de esa diapositiva se llama «033-01»: el PDF pierde el enlace.
// Aquí el PDF apunta a un ancla (id="respaldo", que pone guion-to-slides.mjs) y Chromium exporta un salto interno.
import { useNav } from '@slidev/client'

defineProps({ to: [Number, String] })
const { isPrintMode } = useNav()
</script>

<template>
	<a v-if="isPrintMode" href="#respaldo"><slot /></a>
	<Link v-else :to="to"><slot /></Link>
</template>
