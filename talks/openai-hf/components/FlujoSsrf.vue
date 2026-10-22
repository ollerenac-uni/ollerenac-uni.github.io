<template>
	<section class="ssrf-flujo" aria-label="Recorrido conceptual de la petición SSRF">
		<div class="ssrf-cabecera">
			<strong>SSRF · esquema conceptual</strong>
			<span>URL y parámetros del exploit de mayo: no publicados</span>
		</div>
		<ol class="ssrf-pasos">
			<li><strong>Contenedor del agente</strong><span>Envía una solicitud manipulada</span></li>
			<li><strong>Artifactory</strong><span>Hace la petición externa</span></li>
			<li><strong>Destino externo</strong><span>Recibe la petición de Artifactory</span></li>
		</ol>
	</section>
</template>

<style scoped>
.ssrf-flujo {
	margin: 0.3rem 0 0.15rem;
	padding: 0.35rem 0.6rem;
	border: 1.5px solid #1e3a8a;
	border-radius: 0.35rem;
	background: #eff6ff;
	color: #172554;
	font-size: 0.75rem;
	line-height: 1.2;
}
.ssrf-cabecera {
	display: flex;
	justify-content: space-between;
	gap: 0.8rem;
	margin-bottom: 0.25rem;
}
.ssrf-cabecera strong { font-weight: 800; }
.ssrf-pasos {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.6rem;
	list-style: none;
	padding: 0;
	margin: 0;
}
.ssrf-pasos li {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
	padding: 0.25rem 0.45rem;
	border: 1px solid #1e3a8a;
	border-radius: 0.25rem;
	background: #fff;
}
.ssrf-pasos li + li::before {
	content: '→';
	position: absolute;
	right: calc(100% + 0.35rem);
	top: 50%;
	transform: translateY(-50%);
	font-size: 1.25rem;
	font-weight: 800;
}
.ssrf-pasos strong { font-weight: 800; }
</style>
