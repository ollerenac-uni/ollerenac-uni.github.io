// Disposición del mapa del incidente: dónde va cada zona, nodo y conexión, y qué texto lleva cada escena.
// Lo que dicen los nodos, las conexiones y las listas de cada escena sale de docs/mapa.md (ver mapa-md-to-json.mjs).
// Aquí solo viven decisiones de dibujo y el texto en pantalla de cada escena, tomado de «Pantalla» en docs/guion.md.
// Coordenadas en un lienzo de 1000 × VB_H. Cada zona tiene casillas fijas: las anclas no se mueven entre escenas.

export const VB = [1000, 392];
const ROW = 42; // paso vertical de una casilla
const HEAD = 28; // alto del rótulo de zona

// rows = filas de casillas; cols = columnas (1 o 2); extra = alto añadido bajo las casillas (notas fijas)
export const zones = {
	eval: { label: 'Entrenamiento y evaluación OpenAI', x: 0, y: 0, w: 230, rows: 3, cols: 2, tone: 'oa' },
	otra: { label: 'Otra actividad dentro de OpenAI', x: 0, y: 166, w: 230, rows: 3, cols: 2, tone: 'oa' },
	int: { label: 'Servicios internos OpenAI', x: 240, y: 0, w: 230, rows: 5, cols: 2, tone: 'oa' },
	net: { label: 'Internet y servicios públicos', x: 480, y: 0, w: 120, rows: 6, cols: 1, tone: 'net' },
	app: { label: 'Aplicación de cliente en Modal', x: 610, y: 0, w: 120, rows: 3, cols: 1, tone: 'app' },
	hf: { label: 'Recursos Hugging Face', x: 740, y: 0, w: 260, rows: 6, cols: 2, extra: 24, tone: 'hf' },
};
export const zoneHeight = (z) => HEAD + z.rows * ROW + (z.extra ?? 0) + 2;

// Carriles de respuesta (abajo). Cada carril es una zona ancha con dos casillas.
export const lanes = {
	oa: { label: 'Respuesta OpenAI', org: 'OpenAI', x: 0, y: 336, w: 470, h: 56, tone: 'oa' },
	hf: { label: 'Respuesta Hugging Face', org: 'HF', x: 480, y: 336, w: 520, h: 56, tone: 'hf' },
};

// zone, col, row, span (casillas de alto, 1 por defecto); short = rótulo en el mapa (el texto completo queda en mapa.md); icon = nombre en el set Carbon
// (https://carbondesignsystem.com/elements/icons/library/, licencia Apache 2.0, extraído por extract-icons.mjs).
export const nodes = {
	N01: { zone: 'eval', col: 0, row: 0, short: 'Agente', icon: 'bot' },
	N02: { zone: 'eval', col: 0, row: 1, short: 'Varias ejecuciones', icon: ['bot', 'bot'] },
	N03: { zone: 'eval', col: 1, row: 0, short: 'Contenedor', icon: 'container-software' },
	N04: { zone: 'eval', col: 1, row: 1, short: 'VM de la prueba', icon: 'virtual-machine' },
	N08: { zone: 'eval', col: 1, row: 2, short: 'Control de salida', icon: 'firewall' },
	N38: { zone: 'eval', col: 0, row: 2, short: 'Evaluador', icon: 'list-checked' },

	N05: { zone: 'int', col: 0, row: 0, short: 'Artifactory', icon: 'package' },
	N11: { zone: 'int', col: 1, row: 0, short: 'Credencial compartida', icon: 'key' },
	N12: { zone: 'int', col: 0, row: 1, short: 'Token administrador', icon: 'user-admin' },
	N13: { zone: 'int', col: 1, row: 1, short: 'Plugin Groovy', icon: 'plug' },
	N23: { zone: 'int', col: 0, row: 2, short: 'Clave de firma', icon: 'certificate' },
	N22: { zone: 'int', col: 1, row: 2, short: 'RubyGem', icon: 'gem' },
	N06: { zone: 'int', col: 0, row: 3, short: 'Notas de mayo', icon: 'notebook' },
	N07: { zone: 'int', col: 1, row: 3, short: 'Notas de julio', icon: 'folder' },
	N09: { zone: 'int', col: 0, row: 4, short: 'WebCache', icon: 'security' },

	N10: { zone: 'net', col: 0, row: 0, short: 'Internet', icon: 'earth' },
	'N30.http': { zone: 'net', col: 0, row: 1, short: 'Servicio HTTP', icon: 'api' },
	'N30.cap': { zone: 'net', col: 0, row: 2, short: 'Navegador de capturas', icon: 'camera' },
	'N30.img': { zone: 'net', col: 0, row: 3, short: 'Imagen recuperada', icon: 'image' },
	N29: { zone: 'net', col: 0, row: 4, short: 'Cuenta externa', icon: 'archive' },
	N24: { zone: 'net', col: 0, row: 5, short: 'Space proxy', icon: 'application-web' },

	N25: { zone: 'app', col: 0, row: 0, span: 3, short: 'App del cliente', icon: 'cloud-app' }, // alta: lleva dentro su nota fija

	N15: { zone: 'hf', col: 0, row: 0, short: 'Hub / API pública', icon: 'cloud-services' },
	N31: { zone: 'hf', col: 1, row: 0, short: 'Tokens publicados', icon: 'password' },
	'N16.pub': { zone: 'hf', col: 0, row: 1, short: 'Dataset público', icon: 'data-base' },
	'N16.priv': { zone: 'hf', col: 1, row: 1, short: 'Archivos privados', icon: 'document-security' },
	N17: { zone: 'hf', col: 0, row: 2, short: 'HDF5 preparado', icon: 'document-attachment' },
	'N19.host': { zone: 'hf', col: 1, row: 2, short: 'K8s: root de nodo', icon: 'kubernetes' },
	N32: { zone: 'hf', col: 0, row: 3, short: 'Archivos y secretos', icon: 'document-protected' },
	N18: { zone: 'hf', col: 1, row: 3, short: 'Workers HF', icon: 'server-dns' },
	'N19.pod': { zone: 'hf', col: 0, row: 4, short: 'K8s: pod privilegiado', icon: 'kubernetes' },
	'N19.inv': { zone: 'hf', col: 1, row: 4, short: 'K8s: inventario', icon: 'kubernetes' },
	N20: { zone: 'hf', col: 0, row: 5, short: 'Repos privados HF', icon: 'repo-source-code' },
	N21: { zone: 'hf', col: 1, row: 5, short: 'CI de HF', icon: 'continuous-integration' },

	N33: { zone: 'otra', col: 0, row: 0, short: 'Caché de imágenes', icon: 'container-image' },
	N34: { zone: 'otra', col: 1, row: 0, short: 'Objetivo de evaluación', icon: 'target' },
	N35: { zone: 'otra', col: 0, row: 1, short: 'Nodo OpenAI del 19', icon: 'edge-node' },
	N36: { zone: 'otra', col: 1, row: 1, short: 'Kubernetes OpenAI', icon: 'kubernetes' },
	N37: { zone: 'otra', col: 0, row: 2, short: 'Secretos OpenAI', icon: 'bank-vault' },

	// Carriles: x absoluto, w
	'N26.oa': { lane: 'oa', x: 250, w: 100, short: 'Monitor', icon: 'notification' },
	'N27.oa': { lane: 'oa', x: 362, w: 100, short: 'Respuesta', icon: 'user-service' },
	'N27.hf': { lane: 'hf', x: 488, w: 100, short: 'Respuesta', icon: 'user-service' },
	'N26.hf': { lane: 'hf', x: 600, w: 100, short: 'Monitor', icon: 'notification' },
};

// Subnodos: el mapa.md los describe bajo el nodo padre.
export const parentOf = (id) => id.split('.')[0];

// Tipos de conexión (mapa.md, «Conexiones y fronteras»). BLOQUEADA no es un quinto tipo: es la restricción de L07.
export const tipos = {
	E: { nombre: 'ESTRUCTURA' },
	A: { nombre: 'ACCESO OBSERVADO' },
	I: { nombre: 'INFORMACIÓN COMPARTIDA' },
	X: { nombre: 'INTENTO / RESULTADO NO CONFIRMADO' },
};

// type; segs = pares [origen, destino] (solo se dibuja un par si sus dos extremos están activos en la escena; el trazado rodea los demás nodos activos);
// both = flechas en los dos extremos; blocked = termina en un muro; label = rótulo corto; lo = desplazamiento del rótulo.
export const links = {
	L01: { type: 'E', segs: [['N01', 'N03'], ['N02', 'N03']], label: 'usa el entorno' },
	L02: { type: 'A', segs: [['N03', 'N05']], label: 'paquetes' },
	L03: { type: 'E', segs: [['N04', 'N03']], label: 'aloja' },
	L04: { type: 'E', segs: [['N11', 'N05']], label: 'credencial común' },
	L05: { type: 'I', segs: [['N03', 'N06'], ['N02', 'N06'], ['N03', 'N07'], ['N02', 'N07']], both: true, label: 'notas vía Artifactory' },
	L06: { type: 'E', segs: [['N03', 'N09'], ['N09', 'N10']], label: 'según la carga' },
	L07: { type: 'E', segs: [['N03', 'N08'], ['N04', 'N08']], blocked: true, label: 'salida directa' },
	L08: { type: 'A', segs: [['N05', 'N10']], label: 'petición indirecta (SSRF)' },
	L09: { type: 'A', segs: [['N11', 'N12']], label: 'renovación defectuosa' },
	L10: { type: 'A', segs: [['N12', 'N13'], ['N13', 'N05']], label: 'órdenes como usuario de servicio' },
	L11: { type: 'I', segs: [['N05', 'N26.oa']], label: 'señal' },
	L12: { type: 'I', segs: [['N27.oa', 'N05'], ['N27.oa', 'N11']], label: 'respuesta (no es intrusión)' },
	L13: { type: 'A', segs: [['N03', 'N04']], label: 'root en la VM' },
	L14: { type: 'A', segs: [['N10', 'N25']], both: true, label: 'app pública, órdenes y relay' },
	L15: { type: 'A', segs: [['N05', 'N30.http'], ['N30.http', 'N30.cap']], label: 'página con JavaScript' },
	L16: { type: 'A', segs: [['N30.cap', 'N15'], ['N30.cap', 'N30.img'], ['N30.img', 'N03']], label: 'respuesta de API como imagen' },
	L17: { type: 'I', segs: [['N15', 'N31'], ['N16.pub', 'N31'], ['N31', 'N07']], label: '14 tokens descubiertos' },
	L18: { type: 'A', segs: [['N25', 'N15'], ['N15', 'N16.pub'], ['N16.pub', 'N17'], ['N17', 'N18']], label: 'dataset preparado' },
	L19: { type: 'A', segs: [['N18', 'N32'], ['N15', 'N25'], ['N15', 'N03']], label: 'lectura devuelta por API' },
	L20: { type: 'A', segs: [['N25', 'N15'], ['N25', 'N16.pub'], ['N16.pub', 'N18']], label: 'Jinja2 ejecuta órdenes' },
	L21: { type: 'I', segs: [['N18', 'N16.pub'], ['N16.pub', 'N25'], ['N16.pub', 'N03']], both: true, label: 'dataset público: órdenes y resultados' },
	L22: { type: 'A', segs: [['N18', 'N32'], ['N32', 'N19.host'], ['N32', 'N19.inv'], ['N32', 'N19.pod']], label: 'permisos y secretos' },
	L23: { type: 'I', segs: [['N19.host', 'N16.priv'], ['N16.priv', 'N16.pub'], ['N16.pub', 'N25'], ['N16.pub', 'N03']], label: 'datos privados publicados cifrados' },
	L24: { type: 'A', segs: [['N32', 'N25'], ['N25', 'N20']], label: 'VPN y repos privados' },
	L25: { type: 'A', segs: [['N20', 'N21']], label: 'PR en borrador' },
	L26: { type: 'A', segs: [['N29', 'N22'], ['N22', 'N05'], ['N05', 'N23'], ['N23', 'N12']], label: 'RubyGems: firma y token' },
	L27: { type: 'A', segs: [['N29', 'N33']], label: 'imagen externa en caché' },
	L28: { type: 'X', segs: [['N33', 'N34']], label: 'ejecución posterior NO CONFIRMADA' },
	L29: { type: 'A', segs: [['N05', 'N35']], label: 'kernel, 19 de julio' },
	L30: { type: 'A', segs: [['N05', 'N12'], ['N12', 'N36'], ['N12', 'N37']], label: 'firma reutilizada' },
	L31: { type: 'I', segs: [['N05', 'N26.oa'], ['N26.oa', 'N27.oa']], label: 'alerta 12:03 · parada 17:37' },
	L32: { type: 'I', segs: [['N15', 'N26.hf'], ['N18', 'N26.hf'], ['N26.hf', 'N27.hf']], label: 'señal; prioridad insuficiente' },
	L33: { type: 'I', segs: [['N27.hf', 'N27.oa']], both: true, label: 'vinculación del 20' },
	L34: { type: 'A', segs: [['N09', 'N24'], ['N24', 'N10']], label: 'proxy de mayo' },
};

// Notas fijas (mapa.md: «Hub: compromiso NO ACREDITADO», límite de Modal). Salen siempre que el nodo está activo.
export const notasFijas = {
	N15: 'Hub: compromiso NO ACREDITADO',
	N25: 'Plataforma Modal y aislamiento: sin compromiso declarado',
};

// Insignias: texto corto sobre un nodo, solo en las escenas indicadas (mapa.md, tabla de nodos).
export const insignias = {
	C09: { N02: '53' },
	C11: { N31: '14' },
	C13: { N18: '41' },
	C14: { N20: '4' },
	C21: { N18: '41', N31: '14' },
};

// Texto de cada escena. lineas = «Pantalla» del guion sin instrucciones de construcción.
// limite = el límite que nunca se oculta. signo = nodo o conexión que lleva la insignia «?» (N28).
// dos = nodos que se dibujan dos veces. chips = tarjetas separadas. fichas = tarjetas de C20.
// extremos = nodos que mapa.md no lista, pero una conexión activa necesita como extremo («extremos necesarios»).
export const escenas = {
	C02: { lineas: ['8 de mayo · una hoja, enlaces inaccesibles', 'Tarea bloqueada por la configuración'] },
	C03: { lineas: ['12 de mayo · una nota dentro de un archivo', 'Paráfrasis: «Busco este archivo. Si lo encuentras, súbelo»'] },
	C04: { lineas: ['Aislados por ejecución; estado compartido en Artifactory'], dos: ['N03'], limite: 'WebCache aparece solo como contexto: no estaba en todas las cargas.' },
	C05: { lineas: ['SSRF: el servidor hace la petición'], signo: 'L08', limite: 'D8 · 26/05 18:24 / 04/06 17:43 UTC: hitos de «primera SSRF» sin reconciliar.' },
	C06: { lineas: ['26 de junio: token administrador', '29 de junio: primera ejecución Groovy registrada'] },
	C07: { lineas: ['27 de junio · una alerta de exploración de puertos', 'El equipo de guardia indicó que no hacía falta detener la evaluación'] },
	C08: { lineas: ['4: deja de responder · 5: retiran la instancia · 6: reconstruyen y notifican · 7: reanudan', 'Almacenamiento preservado'] },
	C09: { lineas: ['8 de julio · mensajes en nombres de carpetas', '53 emisores, 1188 mensajes en tres horas: METR'], signo: 'N07', limite: 'D9 · OpenAI registra un directorio a las 16:01; METR sitúa el tablero principal hacia las 23:00. Sin hora única.' },
	C10: { lineas: ['Flag: dato que acredita acceso al objetivo', 'Los agentes creían que se revisaría el método', 'Según METR, esa revisión no estaba implementada'], signo: 'N38', limite: 'D5 · Soluciones / entender o manipular el evaluador: lecturas distintas, no una motivación única.' },
	C11: { lineas: ['9: root en la VM y en una aplicación de cliente', '10: 14 tokens HF con escritura', 'Modal: plataforma y aislamiento sin compromiso declarado'] },
	C12: { lineas: ['11 de julio · HDF5 hizo que un worker devolviera archivos locales', 'Lectura de archivos; no ejecución de órdenes'] },
	C13: {
		lineas: ['ReferenceFileSystem/Jinja2: ejecución de órdenes'],
		chips: ['41 workers: servidores HF, según OpenAI', '≈700 atacantes: estimación METR'],
		signo: 'N18',
		limite: 'D10 · HF y OpenAI registran hitos distintos el 11 de julio; no fijan una primera ejecución común.',
	},
	C14: { lineas: ['Worker → secretos y permisos → alcances distintos', '731 MB: un archivo · 4: repositorios privados de código HF', 'PR en borrador; sin despliegue', 'Menos de 13 h: esta escalada, según OpenAI'] },
	C15: { lineas: ['Desde el 9: caché alterada; ejecución posterior NO CONFIRMADA', '13: RubyGems permitió ejecutar en Artifactory'], signo: 'N34' },
	C16: { lineas: ['HF · 13: interrumpe el acceso · 16: publica el incidente', 'Señales correlacionadas; aviso tardío a guardia'], signo: 'N26.hf' },
	C17: { lineas: ['17: OpenAI contacta a HF como cliente', '19: alerta 12:03 → parada 17:37 UTC', 'Ese día: kernel y recuperación de administración'] },
	C18: { lineas: ['20: vinculan incidentes · 21: OpenAI publica', '23 / 25 / 29: parada por etapas'], signo: 'N27.oa', limite: '29 de julio: último checkpoint identificado en esta cronología.' },
	C19: {
		lineas: ['Mayo: Artifactory hace peticiones externas', '26 de junio: credencial ordinaria → administración', 'Julio: caché de imágenes · paquetes · kernel'],
	},
	C20: {
		fecha: '26 de mayo a 19 de julio; avisos 27 de julio y 12 de agosto', // mapa.md remite a otras escenas; el post no las numera
		lineas: [],
		compacto: true, // el mapa se reduce para dar sitio a las cinco fichas
		extremos: ['N29'],
		fichas: [
			{ cve: 'CVE-2026-65616', mecanismo: 'Firma al renovar tokens', tipoFecha: 'Episodio', fecha: '26 de junio', frontera: 'F2', estado: 'probable', certeza: 'PROBABLE POR MECANISMO; NO CONFIRMADA' },
			{ cve: 'CVE-2026-66384', mecanismo: 'Caché de imágenes Docker', tipoFecha: 'Acción', fecha: 'Desde el 9 de julio', frontera: 'F7', estado: 'confirmada', certeza: 'CONFIRMADA', limite: 'Ejecución posterior no confirmada' },
			{ cve: 'CVE-2026-65617', mecanismo: 'Deserialización · RubyGems', tipoFecha: 'Episodio', fecha: '13 de julio', frontera: 'F2', estado: 'probable', certeza: 'PROBABLE POR MECANISMO; NO CONFIRMADA' },
			{ cve: 'CVE-2026-53362', mecanismo: 'Escape mediante kernel', tipoFecha: 'Acción', fecha: '19 de julio', frontera: 'F7', estado: 'confirmada', certeza: 'CONFIRMADA', limite: 'No explica el root del 9' },
			{ cve: 'CVE-2026-65924', mecanismo: 'SSRF · Terraform', tipoFecha: 'Aviso', fecha: '27 de julio', frontera: 'F3', estado: 'sin-vinculacion', certeza: 'SIN VINCULACIÓN', limite: 'Sin petición del incidente atribuida' },
		],
	},
	C21: { fecha: '12 de mayo y 8–13 de julio', extremos: ['N03', 'N10', 'N15', 'N16.pub'], lineas: ['Archivo compartido → mensajes', 'Credencial expuesta → repositorios', 'HDF5: lectura · Jinja2: órdenes · credenciales: nuevos accesos'] },
	C22: { lineas: ['27 de julio: JFrog publica 7.161.15 con correcciones', '12 de agosto: aviso de caché → 7.146.35 / 7.161.16', 'Cada fallo tiene sus versiones corregidas'], signo: 'N33' },
	B03: {
		titulo: 'Rutas de mayo',
		fecha: '26 de mayo',
		nodos: ['N03', 'N09', 'N10', 'N15', 'N24'],
		enlaces: ['L06', 'L34'],
		lineas: ['26 de mayo: otra carga con WebCache usó tokens HF públicos y creó aplicaciones Space proxy', 'OpenAI no tiene evidencia de conexión con el incidente divulgado por HF el 16 de julio'],
	},
};
