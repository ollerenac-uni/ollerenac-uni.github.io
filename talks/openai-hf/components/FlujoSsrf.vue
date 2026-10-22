<template>
	<section class="ssrf-flujo" aria-label="Comparación conceptual de una petición legítima y una SSRF">
		<div class="ssrf-cabecera">
			<strong>Petición legítima frente a SSRF</strong>
			<span>Pseudocódigo ilustrativo · no es el exploit de mayo</span>
		</div>
		<div class="ssrf-comparacion">
			<div class="ssrf-peticion">
				<strong>Petición legítima · ejemplo</strong>
				<code>DAME: pypi.org/project/numpy</code>
				<span>Obtener software desde el repositorio previsto.</span>
			</div>
			<div class="ssrf-peticion ssrf-manipulada">
				<strong>Objetivo de la petición manipulada</strong>
				<code>DAME: https://destino-externo.example/recurso</code>
				<span>Inducir a Artifactory a consultar otro destino.</span>
			</div>
		</div>
		<p class="ssrf-limite">Las líneas expresan la intención; la sintaxis real de mayo no está publicada.</p>
		<p class="ssrf-cve"><strong>CVE-2026-65923:</strong> SSRF en repositorios Ansible. <strong>Vínculo con mayo: no confirmado.</strong></p>
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
.ssrf-comparacion {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem;
}
.ssrf-peticion {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	padding: 0.25rem 0.45rem;
	border: 1px solid #1e3a8a;
	border-radius: 0.25rem;
	background: #fff;
}
.ssrf-manipulada {
	border-color: #9a3412;
	background: #fff7ed;
	color: #7c2d12;
}
.ssrf-peticion strong { font-weight: 800; }
.ssrf-peticion code {
	font-size: 0.7rem;
	white-space: normal;
	overflow-wrap: anywhere;
}
.ssrf-flujo p {
	margin: 0.25rem 0 0;
	font-size: inherit;
	line-height: inherit;
}
</style>
