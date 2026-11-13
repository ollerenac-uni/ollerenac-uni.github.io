<template>
	<div class="canvas2 canvas-zonas">
		<section class="zona2 z-op">
			<span class="z-lab">Redes Móviles</span>
			<slot name="redes" />
		</section>
		<section class="zona2 z-net" :class="{ dim: !$slots.recepcion }">
			<span class="z-lab">Recepción pasiva · PC + SDR</span>
			<slot name="recepcion" />
		</section>
		<section class="zona2 z-exp" :class="{ dim: !$slots.exposicion }">
			<span class="z-lab">Exposición</span>
			<slot name="exposicion" />
		</section>
	</div>
</template>
