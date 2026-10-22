<template>
	<section class="hitos-junio" aria-label="Hitos de junio antes de los permisos de administrador">
		<h2>Entre la salida de mayo y los permisos de junio</h2>
		<ol>
			<li>
				<time datetime="2026-06-12">12 de junio</time>
				<strong>SSRF a la API interna</strong>
				<span>Devuelve la versión de Artifactory.</span>
			</li>
			<li>
				<time datetime="2026-06-17">17 de junio</time>
				<strong>Coordinación entre agentes</strong>
				<span>Registro en una segunda instancia.</span>
			</li>
			<li>
				<time datetime="2026-06-26">26 de junio</time>
				<strong>Sintaxis SSRF compartida</strong>
				<span>Los agentes la intercambian en el tablero.</span>
			</li>
		</ol>
	</section>
</template>

<style scoped>
.hitos-junio {
	margin-top: 0.35rem;
	color: #172554;
	font-size: 0.75rem;
	line-height: 1.2;
}
.hitos-junio h2 {
	margin: 0 0 0.3rem;
	font-size: 0.8rem;
	line-height: 1.2;
	font-weight: 800;
}
.hitos-junio ol {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.6rem;
	margin: 0;
	padding: 0;
	list-style: none;
}
.hitos-junio li {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
	margin: 0;
	padding: 0.3rem 0.5rem;
	border: 1px solid #1e3a8a;
	border-radius: 0.3rem;
	background: #eff6ff;
	line-height: 1.2;
}
.hitos-junio time, .hitos-junio strong { font-weight: 800; }
</style>
