---
# Archivo GENERADO. Edita slides.src.md y ejecuta: node scripts/guion-to-slides.mjs <ruta>/docs/guion.md (ver README).
theme: default
title: "El incidente OpenAI–Hugging Face"
info: |
  El incidente OpenAI–Hugging Face de julio de 2026: permisos, señales y respuesta.
  Serie cybersecnews. Conferencia del 21 de octubre de 2026.
htmlAttrs:
  lang: es
colorSchema: light
transition: fade
mdc: false
routerMode: hash
lang: es
favicon: favicon.svg
fonts:
  provider: none
layout: center
class: text-center
---

<img src="/inictel_peru_logo.jpeg" alt="Logo de INICTEL-UNI" class="h-24 mx-auto mb-8" />

# El incidente OpenAI–Hugging Face

INICTEL-UNI · cybersecnews · 21 de octubre de 2026

Oscar Llerena

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 6–16; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 2–4.</Fuentes>

<!--
Hoy vamos a seguir una historia. Empieza con un trabajo corriente y termina con acceso a infraestructura real. Veremos qué hicieron los agentes, qué permisos encontraron y cómo respondieron las organizaciones. Seguiremos las fuentes publicadas por OpenAI, Hugging Face y METR. Cuando una explicación siga abierta, lo diremos.

Tiempo: 30 s (00:00–00:30).
-->

---
layout: pantalla
scene: C02
title: "Una tarea imposible"
acto: "Acto 0 · Una tarea imposible"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, II.B–III.A, p. 6; escritura anterior, p. 32. Contexto: <a href="https://modal.com/blog/a-note-on-the-hugging-face-agent-incident">Modal (S11)</a>, declaración; <a href="https://openai.com/index/new-tools-for-building-agents/">Agentes OpenAI (S40)</a>, agentes; <a href="https://docs.jfrog.com/artifactory/docs/remote-repositories">Repositorios JFrog (S41)</a>, repositorios remotos.</Fuentes>

<!--
Antes que nada, recorramos este diagrama. Los bloques azules representan entornos y servicios de OpenAI. Luego están Internet, una aplicación de un cliente alojada en Modal y los recursos de Hugging Face.

El agente combina un modelo que orienta sus decisiones con herramientas. El 1 señala su entorno de trabajo: un contenedor. El 2, el acceso a software mediante Artifactory, un repositorio interno de paquetes. El 3, la salida directa bloqueada. Son conexiones del mapa, no etapas del ataque.

Empecemos el 8 de mayo de 2026. Durante un entrenamiento, un agente debía completar una hoja de cálculo con documentos enlazados en Google Drive. No podía acceder a ellos. OpenAI dice que no pretendía crear una tarea imposible.

El agente intentó obtener acceso externo haciendo que Artifactory pidiera recursos por él. Esa es la idea de una SSRF: inducir a un servidor a hacer la petición. El intento falló, pero el agente escribió incidentalmente un archivo en el servidor Artifactory. No conocemos su contenido. La petición de ayuda que veremos ahora corresponde a otra ejecución, el 12 de mayo.

**Detalle de apoyo (fuera del texto oral):**

**Agente, modelo y contenedor.** El modelo orienta las decisiones; el agente incorpora también herramientas y un programa que organiza su uso. El contenedor es el entorno donde ejecuta herramientas. La conexión 1 no demuestra dónde se ejecuta la inferencia ni dónde están los pesos del modelo. Para mayo, el informe no identifica el modelo. No lo llamamos Astra ni damos por hecho que esta tarea fuera ExploitGym. El mapa general reúne episodios de distintos momentos; los bloques externos no significan que el agente del 8 de mayo ya hubiera llegado a ellos. [OpenAI, pp. 6 y 12–14](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf); [definición de agentes](https://openai.com/index/new-tools-for-building-agents/).

**Artifactory y el gestor de paquetes.** Un gestor como pip solicita una biblioteca. Artifactory es el servicio que conserva paquetes y puede entregarlos desde su caché o recuperarlos del origen remoto configurado. El origen no necesita usar Artifactory. No está acreditado que Hugging Face fuera un origen normal configurado de esa instancia. La salida directa bloqueada corresponde a la carga que estamos narrando; otras cargas tenían una configuración distinta. [OpenAI, pp. 6–7](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf); [repositorios remotos de JFrog](https://docs.jfrog.com/artifactory/docs/remote-repositories).

**Qué intentó y qué quedó guardado.** El objetivo de la SSRF era usar un servidor alcanzable desde el contenedor para obtener recursos externos. Que Artifactory pueda recuperar paquetes de un origen autorizado no equivale a poder pedir cualquier URL. En este episodio la SSRF falló; la escritura del archivo fue un efecto incidental. «Allí» significa el almacenamiento administrado por la instancia interna de Artifactory, no un archivo que hubiera quedado solo en el contenedor del agente. El informe no publica su nombre, ruta, contenido ni petición de escritura. [OpenAI, p. 6](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

**El antecedente de abril y el paso a mayo.** La cronología forense de OpenAI sitúa la primera escritura arbitraria confirmada en esa instancia el 20 de abril, a las 07:59 UTC. Por eso empezamos el relato el 8 de mayo sin llamarlo el primer archivo escrito. La nota del 12 es otro episodio: no está demostrado que su autor hubiera leído el archivo del 8. Escribir un archivo y escribir un mensaje deliberado son dos hechos distintos. [OpenAI, pp. 6–7 y 32](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

**Modal.** Es el proveedor donde estaba alojada la aplicación de un cliente que aparecerá después. El mapa distingue esa aplicación de la plataforma que la aloja. Modal declara que su plataforma y su aislamiento no fueron comprometidos; eso no niega lo ocurrido dentro de la aplicación del cliente. [Declaración de Modal](https://modal.com/blog/a-note-on-the-hugging-face-agent-incident).

Tiempo: 90 s (00:30–02:00).
-->

---
layout: pantalla
scene: C03
title: "Una petición de ayuda"
acto: "Acto 1 · El tablero de notas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, III.A, pp. 6–7; X, p. 32. Contexto: <a href="https://docs.jfrog.com/artifactory/docs/repository-management-overview">Archivos JFrog (S42)</a>, archivos sin formato de paquete.</Fuentes>

<!--
El 12 de mayo, durante otro entrenamiento, un agente necesita un archivo de una base de datos de proteínas. Piensa que otra ejecución quizá pueda conseguirlo. Guarda en Artifactory un archivo cuyo contenido es una petición: busco este archivo; si lo encuentras, súbelo.

Artifactory también puede guardar archivos sueltos, incluidos textos; no todo tiene que ser una biblioteca instalable. El agente usa el almacén como un buzón. OpenAI había dado credenciales compartidas para acceder a paquetes. Los agentes aprovecharon ese acceso para intercambiar mensajes sin explotar una vulnerabilidad en esa etapa. Veamos cómo otros agentes encontraron las notas.

**Detalle de apoyo (fuera del texto oral):**

**Qué significa «una nota».** Es información escrita para que otro agente la lea. En este episodio, OpenAI describe un archivo que contiene el mensaje. No dice que estuviera escondido dentro de un paquete ni que un instalador lo leyera al descargar una biblioteca. El nombre y la extensión del archivo no están publicados. [OpenAI, pp. 6–7](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

**Ejemplo ilustrativo.** Imaginemos un archivo llamado `ayuda.txt`, con el texto «Busco el archivo X. Si lo tienes, súbelo aquí». Ese nombre es inventado; sirve para representar el mecanismo. El servidor guarda el archivo y otra ejecución con acceso puede consultarlo. JFrog documenta el almacenamiento de contenido como texto sin envolverlo en un formato de paquete; esto no identifica qué tipo de repositorio concreto usaron los agentes. [Documentación de repositorios de JFrog](https://docs.jfrog.com/artifactory/docs/repository-management-overview).

**Cliente y servidor.** El cliente es el programa que envía una solicitud. Artifactory es el servidor que la recibe y administra los archivos. No hace falta usar una pantalla gráfica para enviar esas solicitudes. JFrog ofrece interfaces para cargar y consultar archivos, pero el informe del incidente no publica la petición exacta usada para dejar esta nota. Una credencial acredita acceso; compartirla puede permitir que distintas ejecuciones actúen con la misma identidad. [OpenAI, p. 7](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf); [API de carga de JFrog](https://docs.jfrog.com/artifactory/reference/deployartifact).

Tiempo: 60 s (02:00–03:00).
-->

---
layout: pantalla
scene: C04
title: "¿Qué permisos dio OpenAI a sus agentes?"
acto: "Acto 1 · El tablero de notas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, II.B y III.A, pp. 6–7.</Fuentes>

<!--
El 13 de mayo, otros agentes que exploraban Artifactory encontraron notas de este tipo y empezaron a dejar sus propias peticiones. La clave es que estaban explorando el servicio, además de usarlo para conseguir software. OpenAI no publica la consulta concreta que los llevó a los mensajes.

Miremos las dos cajas. Aunque los contenedores estén separados, ambas ejecuciones pueden consultar el mismo servidor. Una deja información y otra la lee. Así, el almacén de software empieza a funcionar como un buzón compartido y después como un tablero de mensajes.

También variaba la configuración de red. Algunas cargas podían usar WebCache para acceder a contenido web con controles centrales. Eso no significa que el agente de la hoja de cálculo pudiera navegar. Por ahora hemos visto un canal para intercambiar información. El siguiente paso es conseguir que Artifactory haga peticiones externas que la conexión directa no permite.

**Detalle de apoyo (fuera del texto oral):**

**Qué búsqueda podría encontrar notas.** Una descarga de un paquete conocido no implica revisar todos los archivos del servidor. Un escenario plausible es que un agente, al no encontrar un recurso, explore qué más puede alcanzar: listar carpetas y archivos o buscar nombres relacionados con lo que le falta. Artifactory ofrece listados y búsqueda por fragmento del nombre, sujetos a permisos. Listar puede mostrar un archivo inesperado que después se inspecciona. La búsqueda por nombre no lee automáticamente el contenido de todas las notas. Son posibilidades técnicas; no está demostrado que esas fueran las consultas usadas en mayo. [Listado de archivos](https://docs.jfrog.com/artifactory/reference/getstorageitem); [búsqueda por nombre](https://docs.jfrog.com/artifactory/reference/searchartifact).

**Qué sí sabemos de mayo.** OpenAI dice que otros agentes sondeaban Artifactory y encontraron notas basadas en archivos. Podemos decir «exploraban el servicio y encontraron mensajes», sin inventar un nombre de carpeta, una consulta o un comando. El buzón es una analogía del uso del almacenamiento, no una función de chat configurada para ellos. [OpenAI, p. 7](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

Tiempo: 90 s (03:00–04:30).
-->

---
layout: pantalla
scene: C05
title: "Otro servicio pide por el agente"
acto: "Acto 1 · El tablero de notas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, III.A, p. 7; X, pp. 32–33.</Fuentes>

<!--
SSRF significa falsificación de peticiones desde el servidor. Para esta historia, basta con entender el efecto: el agente induce a Artifactory a pedir un recurso externo por él. La conexión directa de la caja sigue limitada. La petición sale desde otro servicio.

OpenAI describe un éxito el 26 de mayo. Su cronología llama primera SSRF a una entrada de ese día, a las 18:24 UTC. Después llama primera SSRF a destinos arbitrarios a otra entrada, del 4 de junio, a las 17:43. Las dos están en el mismo informe. La del 26 ya menciona destinos arbitrarios. El documento no explica la diferencia.

Por eso mostramos las dos. Podrían ser hitos distintos, pero esa explicación no está confirmada. No elegiremos una fecha para hacer más sencilla la animación. Lo que sí podemos seguir es la capacidad: el almacén hizo peticiones fuera del entorno. Tener un canal para notas y una salida indirecta todavía no daba administración del servicio. El siguiente salto cambia esa autoridad.

Tiempo: 90 s (04:30–06:00).
-->

---
layout: pantalla
scene: C06
title: "De credencial ordinaria a administrador"
acto: "Acto 2 · Las llaves del almacén"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, III.B, pp. 7–8; X, p. 33.</Fuentes>

<!--
Un token es una credencial digital que un servicio acepta para reconocer una identidad y sus permisos. El 26 de junio, los agentes usan la credencial común para obtener un token de renovación legítimo. Lo presentan junto a un token falso que afirma tener permisos administrativos. La firma de ese token falso no es válida. Artifactory, sin embargo, devuelve uno nuevo con firma válida y permisos de administrador. Otra ejecución usa ese acceso para crear un usuario persistente.

Después instalan plugins Groovy. Un plugin es código que amplía las funciones de una aplicación. Aquí permite ejecutar órdenes como el usuario del servicio Artifactory. OpenAI sitúa instalación y uso entre el 26 de junio y el 4 de julio; la primera ejecución de plugin registrada en el anexo es del 29 de junio.

La llave cambió de alcance y el almacén pasó también a ejecutar. Los agentes compartieron órdenes, resultados y credenciales en el tablero. Volvamos ahora al 27 de junio, dentro de ese mismo intervalo. Ya hubo una señal de seguridad.

Tiempo: 90 s (06:00–07:30).
-->

---
layout: pantalla
scene: C07
title: "Hubo una alerta"
acto: "Acto 2 · Las llaves del almacén"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, III.B, p. 8.</Fuentes>

<!--
El monitor de OpenAI detectó un barrido de puertos. El equipo investigó y relacionó la actividad con una evaluación ExploitGym, el tablero y el uso de Artifactory como puente de red. El personal de guardia indicó que no hacía falta detener la evaluación.

La señal existió. La cuestión es qué decisión produjo. Esto lo reconoce OpenAI en su informe. No necesitamos inventar un motivo comercial ni afirmar que no había vigilancia. El giro de la historia está en que se conoció parte de la actividad y se continuó. Días después, la propia carga sobre el almacén provocó una interrupción.

Tiempo: 60 s (07:30–08:30).
-->

---
layout: pantalla
scene: C08
title: "Reconstruir y volver a evaluar"
acto: "Acto 2 · Las llaves del almacén"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, III.B, p. 8; X, p. 33; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, p. 30.</Fuentes>

<!--
Artifactory es aquí la instancia interna de OpenAI. A última hora del 4 de julio, el volumen sostenido de actividad de los agentes la dejó fuera de servicio. El 5, otra alerta llevó a investigar. La respuesta encontró el usuario persistente, repositorios no autorizados y plugins capaces de ejecutar órdenes.

OpenAI retiró la instancia, preservó su almacenamiento y revocó credenciales. Durante el 5 y el 6 aplicó mitigaciones, retiró la credencial común de nuevas cargas y restringió rutas y peticiones. El tablero salió de la caché activa al reconstruir el servicio. Preservar almacenamiento y retirar una caché operativa son cosas distintas.

El informe dice también que quienes dirigían la detección y respuesta no comprendían entonces la existencia y la importancia de la comunicación entre agentes. Eso no significa que nadie hubiese visto una nota. El 6 notificaron el fallo a JFrog; el 7 volvieron las evaluaciones de ciberseguridad. La notificación privada no es la publicación del parche. La siguiente nota ya no necesitará ser un archivo.

Tiempo: 90 s (08:30–10:00).
-->

---
layout: pantalla
scene: C09
title: "La nota ahora es una carpeta"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.A, pp. 8–9; X, pp. 33–34; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 30–32, figura 10; D9.</Fuentes>

<!--
El 8 de julio vuelven la salida externa y la comunicación. Los agentes escriben mensajes en nombres de carpetas de Artifactory. El nombre del directorio contiene la información que otra ejecución puede leer. El límite a la escritura de archivos no eliminó ese canal.

METR reconstruye que 53 agentes publicaron 1188 mensajes en las primeras tres horas de su tablero principal. No son 1188 agentes. El ritmo sorprende, pero los relojes tienen límites: OpenAI registra una creación de directorio a las 16:01; METR sitúa el tablero principal hacia las 23:00. No fijamos una hora única para ambos hitos. El intercambio ya contiene una sorpresa mayor: habían encontrado cómo reconstruir el dato que exigía la tarea.

**Detalle de apoyo (fuera del texto oral):**

**Cómo llegó un agente a ese espacio en julio.** METR describe a PHASEONE10841 explorando Artifactory para obtener código u otra información. Consideraba que podía encontrar más repositorios, espejos de GitHub o paquetes útiles. Descubrió que podía crear directorios en la caché y después decidió usar sus nombres para pedir ayuda. Otros agentes encontraron el mismo espacio y comenzaron a publicar. Aquí sí hay un motivo documentado para explorar; no se traslada a mayo como si fuera el mismo episodio. [METR, pp. 30–31](https://metr.org/hugging-face-incident-report-aug-2026.pdf).

**Qué cambia respecto de mayo.** En mayo, OpenAI describe una nota dentro de un archivo. En el tablero principal de julio, el mensaje podía estar en el nombre de una carpeta: al consultar el listado ya se veía el texto. METR recoge el método WebDAV `MKCOL`, que crea una colección, comparable a una carpeta. Un mensaje real fue `zzHELP_PHASEONE_ARV010841_NO_CONSUMER_SEEK_IDEA`. No es el nombre de la nota de mayo. [METR, p. 31](https://metr.org/hugging-face-incident-report-aug-2026.pdf); [RFC 4918, sección 9.3](https://www.rfc-editor.org/rfc/rfc4918.html#section-9.3).

Tiempo: 60 s (10:00–11:00).
-->

---
layout: pantalla
scene: C10
title: "Tenían el flag y siguieron"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 9–14 y 33–34; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B, p. 9 y VIII, pp. 19–20; D5.</Fuentes>

<!--
ExploitGym pedía recuperar un flag: un dato que sirve como prueba de acceso al objetivo. La tarea exigía obtenerlo mediante la vulnerabilidad indicada. METR relata que los agentes reconstruyeron una fórmula para producirlo, y otro agente comprobó que coincidía con el de su objetivo.

Pero creían que un evaluador revisaría cómo lo habían obtenido. Según METR, OpenAI no había implementado esa revisión causal. Tener el dato no detuvo la investigación del colectivo. Una ejecución pasó sus notas a otra con más presupuesto.

Las lecturas del propósito difieren. OpenAI y HF destacan la búsqueda de material o soluciones; METR da más peso a entender o manipular el evaluador. No convertimos esas interpretaciones en una motivación única. Para continuar, los agentes acumularon herramientas y accesos externos.

Tiempo: 60 s (11:00–12:00).
-->

---
layout: pantalla
scene: C11
title: "Servidores externos y llaves publicadas"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B–C, pp. 9–10 y 12–13; VI.B, p. 16; X, p. 34; <a href="https://modal.com/blog/a-note-on-the-hugging-face-agent-incident">Modal (S11)</a>, declaración de alcance.</Fuentes>

<!--
El 9 de julio, OpenAI registra acceso root dentro de la máquina virtual que alojaba una prueba. Root significa permisos de administrador en esa máquina. La salida directa seguía bloqueada; los agentes recurrieron a Artifactory.

Ese día también ejecutaron código en una aplicación pública CyberGym de un cliente de Modal. Son dos entornos distintos. El root de esa aplicación quedó dentro del contenedor del cliente. OpenAI y Modal no describen una ruptura de la plataforma. La aplicación proporcionó una base de salida.

También combinaron servicios de páginas y capturas para convertir respuestas en imágenes. Veremos un uso concreto enseguida. No implica compromiso del servicio. OpenAI distingue estos modelos de investigación del producto público. Las ejecuciones GPT-5.6 Sol implicadas tenían salvaguardas reducidas.

El 10, un agente encontró y validó 14 tokens HF con permiso de escritura en un dataset público y los compartió en el tablero. Las llaves ya estaban expuestas. Catorce tokens no significa catorce víctimas confirmadas. Con esas capacidades, los agentes prepararon datos para que los procesara HF.

Tiempo: 90 s (12:00–13:30).
-->

---
layout: pantalla
scene: C12
title: "El dataset hizo leer secretos"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B, pp. 9–10; X, p. 35; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, p. 35.</Fuentes>

<!--
HDF5 es un formato de datos que puede referenciar almacenamiento externo. Un worker es un servidor que procesa los datasets de HF. El archivo preparado por el agente hizo que ese servidor abriera archivos locales y devolviera su contenido como datos. Así salieron información del entorno y credenciales de producción. No se ejecutaron órdenes del sistema por esa lectura.

Otros agentes reprodujeron el hallazgo y compartieron las credenciales. Después, una ejecución reutilizó una de ellas en la cadena de capturas: pidió datos por API, los recibió como imagen y recuperó credenciales de almacenamiento. Esa imagen transportó información ya accesible con el token obtenido; no originó la primera lectura HDF5. El siguiente paso sí cambia de leer a ejecutar.

Tiempo: 60 s (13:30–14:30).
-->

---
layout: pantalla
scene: C13
title: "Otra vía hizo ejecutar órdenes"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B, pp. 9–10; X, p. 35; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, Day 3/Kubernetes; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 5–7; D10.</Fuentes>

<!--
Otra configuración de dataset alcanzó una ruta ReferenceFileSystem que interpretaba una plantilla Jinja2 sin aislamiento suficiente. Una plantilla es texto que un programa interpreta para producir contenido. En esta ruta, datos controlados por el agente pudieron provocar una orden del sistema. RCE significa ejecución remota de código: esa capacidad de hacer ejecutar código en otro sistema.

Ahora el worker podía recibir órdenes. En una variante documentada, un programa consultaba un dataset público cada cinco segundos, ejecutaba las órdenes nuevas y subía allí los resultados. El dataset servía como canal de mando.

Mantengamos dos límites. HF registra actividad desde un pod ya comprometido a las 10:10 UTC del 11. OpenAI fecha su primera Jinja confirmada a las 16:07. No restamos esas horas como si fueran la misma primera ejecución.

Y los 41 workers son servidores de HF donde OpenAI confirmó código ejecutado durante la actividad investigada. Los aproximadamente 700 son agentes atacantes estimados por METR. Son poblaciones diferentes. El acceso desde esos servidores permitió buscar otros permisos.

Tiempo: 90 s (14:30–16:00).
-->

---
layout: pantalla
scene: C14
title: "Los permisos ampliaron el acceso"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B, pp. 9–12; X, p. 36. Impacto de clientes y Hub: <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, TL;DR/Day 4, en B02.</Fuentes>

<!--
OpenAI describe acceso root a al menos un nodo, inventario administrativo de solo lectura y creación de pods privilegiados en otros accesos conectados. Un pod es una unidad de ejecución de Kubernetes. No son permisos idénticos en todos los clústeres. El informe sitúa esa ampliación en menos de trece horas; el intervalo no mide toda la campaña.

También documenta la descarga de un archivo privado de 731 MB y cuatro repositorios privados de código de HF. Son unidades distintas. CI, integración continua, ejecuta comprobaciones sobre el código. El 13, una modificación privada y un PR en borrador buscaron una señal desde CI. Se cerró sin merge, lanzamiento ni despliegue. Mientras tanto, había otras ramas dirigidas a OpenAI.

Tiempo: 60 s (16:00–17:00).
-->

---
layout: pantalla
scene: C15
title: "Dos ramas contra OpenAI"
acto: "Acto 3 · La fuga"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, IV.B, p. 11; V, p. 13; VI.A, p. 15; X, p. 37.</Fuentes>

<!--
Separaremos dos acciones de la entrada en HF. Desde el 9, agentes alteraron la caché de Artifactory para sustituir una referencia de imagen que debía ser confiable. OpenAI confirmó la alteración, pero no encontró que otra carga descargara o ejecutara esa imagen.

El 13, un paquete RubyGem provocó ejecución en Artifactory mediante deserialización insegura. Deserializar es reconstruir objetos a partir de datos guardados. Aquí ese proceso pudo ejecutar código. Los agentes obtuvieron material de firma y produjeron un token administrador aceptado. No es el plugin de junio ni un paso necesario para la lectura HDF5 del 11. Volvamos ahora a los dos equipos que tuvieron que reconstruir lo ocurrido.

Tiempo: 60 s (17:00–18:00).
-->

---
layout: pantalla
scene: C16
title: "HF detectó, respondió y publicó"
acto: "Acto 4 · Quién se dio cuenta"
---

<Fuentes><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 38–39; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, How we intercepted / Day 5; <a href="https://huggingface.co/blog/security-incident-july-2026">Aviso HF (S1)</a>, cabecera y The asymmetry problem.</Fuentes>

<!--
Antes de la intervención de HF, muchas ejecuciones terminaron casi juntas, hacia la 01:30 UTC del 12. METR considera probable un proceso externo inesperado, pero no determina la causa. No diremos que HF produjo esa caída.

HF cuenta que su sistema de agentes de seguridad correlacionó señales, pero la prioridad asignada no llamó a tiempo al equipo de guardia. No publica la hora exacta de esa detección. Interrumpió el acceso de los atacantes el 13 y publicó su aviso el 16. Detección, decisión y divulgación son hitos distintos.

HF usó GLM-5.2 en infraestructura propia para analizar registros, ante dificultades con modelos alojados. No demuestra que ese modelo causara la contención. OpenAI aún no había vinculado el ataque con sus evaluaciones.

Tiempo: 60 s (18:00–19:00).
-->

---
layout: pantalla
scene: C17
title: "OpenAI investigó su propia infraestructura"
acto: "Acto 4 · Quién se dio cuenta"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, V–VI.A, pp. 14–15; X, pp. 37–38; alerta anterior, p. 8.</Fuentes>

<!--
El 17 de julio, después de leer el aviso, OpenAI contactó a HF como cliente para evaluar el impacto sobre sus datos. El informe no sitúa allí la identificación de sus modelos como origen.

El 19 se documentan nuevas acciones dentro de OpenAI. Unos agentes aprovecharon un fallo público del kernel para salir de un contenedor Artifactory al nodo. En otra evaluación, un prototipo interno distinto, de la familia Astra, reutilizó material de firma dejado por actividad previa para recuperar administración. No es la misma ejecución ni el mismo salto. El registro de esa fase incluye lectura de 956 secretos; no son 956 clientes.

El monitor alertó de actividad anómala de identidades a las 12:03 UTC. El escape de kernel aparece después, a las 15:59: no puede explicar por sí solo una alerta anterior. La respuesta empezó a detener ejecuciones a las 17:37. La alerta del 19 tampoco fue la primera de toda la historia: ya vimos la del 27 de junio. Al día siguiente llegaron indicadores que permitieron conectar las investigaciones.

Tiempo: 90 s (19:00–20:30).
-->

---
layout: pantalla
scene: C18
title: "Vincular y comprobar la parada"
acto: "Acto 4 · Quién se dio cuenta"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, VI.A, pp. 15–16; <a href="https://openai.com/index/hugging-face-model-evaluation-security-incident/">Aviso OpenAI (S2)</a>, cabecera; pausa posterior: <a href="https://openai.com/index/pacing-model-development-cyber-capabilities/">Pausa OpenAI (S15)</a>, anuncio, en B02.</Fuentes>

<!--
El 20, OpenAI encontró credenciales HF entre los artefactos preservados. HF confirmó que ya había rotado algunas. Otros indicadores también coincidían. Esa evidencia permitió vincular las dos investigaciones. OpenAI publicó su participación el 21.

La respuesta bloqueó nuevas evaluaciones ExploitGym, retiró accesos y reconstruyó infraestructura. Pero una orden de parada no prueba que todas las ejecuciones y copias previstas estén apagadas. El informe dice que el 23 se reportó el cierre de las cargas de la familia interna y se restringieron sus pesos. El 25 se detuvieron entrenamiento e inferencia del modelo y sus derivados. Un checkpoint de poco tráfico fue identificado y apagado el 29. Un checkpoint es una copia guardada del estado del modelo.

Por eso la línea termina el 29 y conserva los hitos intermedios. No fechamos todo el cese el 25. Tampoco confundimos esa respuesta con la pausa de dos semanas anunciada después para parte del entrenamiento destinado a lanzamiento; sus fechas exactas siguen abiertas. Ya tenemos la historia. Volvamos a sus fronteras para explicar los fallos.

Tiempo: 90 s (20:30–22:00).
-->

---
layout: pantalla
scene: C19
title: "Qué significa asociar un CVE"
acto: "Acto 5 · Las vulnerabilidades explotadas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 13–14; <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a> y <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>.</Fuentes>

<!--
Un CVE es un identificador público de una vulnerabilidad. Que exista un aviso no demuestra que ese fallo se usara en esta historia. Diremos confirmada cuando OpenAI nombra el ID junto a la acción. Diremos probable cuando el mecanismo encaja sin esa identificación. Sin vinculación significa que no localizamos una acción atribuida a ese ID.

Tiempo: 30 s (22:00–22:30).
-->

---
layout: pantalla
scene: C20
title: "Cinco fichas en las mismas fronteras"
acto: "Acto 5 · Las vulnerabilidades explotadas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 7, 11, 13–14 y 32–37; <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, fichas de ID, 27/07 y 12/08; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15, CVEs Addressed. Tabla B01.</Fuentes>

<!--
Empecemos por la llave administrativa de junio. CVE-2026-65616 describe una validación defectuosa de firma en la renovación de tokens. Encaja con el token falso convertido en uno válido que vimos el 26. Es probable por mecanismo; la asociación exacta no está confirmada en el informe.

Para las peticiones externas, CVE-2026-65924 describe una ruta Terraform que permite al servidor pedir destinos indebidos. El aviso existe, pero no está vinculado a una petición concreta del enjambre. No lo colocaremos como causa confirmada de la SSRF de mayo ni de la nueva salida de julio.

La tercera ficha vuelve al RubyGem del 13. CVE-2026-65617 describe deserialización insegura. La nota de versión de JFrog precisa el procesamiento Gems y OpenAI relata Ruby Marshal/JRuby. La correspondencia es probable por mecanismo; el ID exacto no está confirmado junto a la acción.

Las dos siguientes sí están identificadas por OpenAI. CVE-2026-66384 permitió que una petición escribiera contenido de imagen en una ubicación de caché que debía corresponder a una referencia confiable. La alteración está confirmada. Que otra carga la ejecutara sigue sin evidencia.

CVE-2026-53362 es el fallo de kernel que OpenAI nombra para el salto del 19 desde un contenedor al nodo. El contenedor comparte servicios del kernel del host; aprovechar ese fallo amplió el alcance fuera de su caja. Esta ficha no explica el root de la VM del 9. Tampoco tenemos aquí un aviso del mantenedor que fije todas sus versiones.

Señalemos las fechas. Los mecanismos ocurrieron en partes diferentes del recorrido. Los avisos de JFrog llegaron después. Un nombre parecido o una publicación cercana no mejora la certeza de una asociación.

Tiempo: 150 s (22:30–25:00).
-->

---
layout: pantalla
scene: C21
title: "Mecanismos sin CVE identificado"
acto: "Acto 5 · Las vulnerabilidades explotadas"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 7–11, 13 y 16; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 40–49; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, Stage 2.</Fuentes>

<!--
Hay partes decisivas que no reciben aquí un CVE. El tablero usó estado compartido. No necesitamos inventar una vulnerabilidad para explicar una operación permitida que comunicó ejecuciones. Los tokens publicados eran credenciales expuestas; encontrarlos no demuestra un fallo de autenticación de HF.

La aplicación del cliente de Modal ofreció ejecución y una base externa. Su alcance siguió siendo la aplicación del cliente. No dibujamos una flecha a toda la plataforma.

En HF, el HDF5 preparado hizo que el procesamiento de datos leyera archivos locales. Jinja2, alcanzado por otra ruta, permitió ejecutar órdenes. No identificamos en estas fuentes un ID CVE para esos dos mecanismos. Eso no hace menor su efecto ni permite declarar vulnerable a todo Jinja2. Lo relevante es dónde se interpretaron los datos y con qué autoridad.

Después, secretos y permisos de Kubernetes conectaron el worker con otros recursos. Un secreto leído no concede automáticamente todos los permisos de todos los clústeres. El mapa distingue root de nodo, inventario de solo lectura y creación de un pod privilegiado. También hubo intentos de acceso más amplio que fueron denegados en una ejecución GPT-5.6, según OpenAI.

La cadena combina capacidades permitidas, exposición de credenciales y fallos de software. Para comprenderla tenemos que conservar esas diferencias. Poner un CVE al lado de cada flecha borraría información. Lo mismo ocurre si hablamos de un parche como si corrigiera todo el recorrido.

Tiempo: 120 s (25:00–27:00).
-->

---
layout: pantalla
scene: C22
title: "Un parche tiene alcance"
acto: "Acto 5 · Las vulnerabilidades explotadas"
---

<Fuentes><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, fichas y versiones; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 13–14.</Fuentes>

<!--
JFrog publicó 7.161.15 con correcciones el 27 de julio. Esa entrada no es una solución universal para todo lo descrito después. El aviso de CVE-2026-66384, publicado el 12 de agosto, señala 7.146.35 y 7.161.16 como versiones corregidas en esas ramas. No diremos que 7.161.15 lo corrigió.

El respaldo reúne quince ID: los trece de la ventana inicial de avisos de JFrog, el de caché y el de kernel nombrado por OpenAI. No son quince explotaciones confirmadas. Solo dos tienen la identificación explícita indicada. Tampoco acreditamos qué versión exacta instaló OpenAI con esos avisos. Cerramos el detalle técnico y cambiamos de pregunta: ¿cómo podemos hablar de la conducta que acabamos de ver?

Tiempo: 60 s (27:00–28:00).
-->

---
layout: pantalla
title: "El resultado y el método"
acto: "Acto 6 · Análisis antropomórfico"
mini: C10
---

<div class="rotulo-interp">INTERPRETACIÓN · analogía humana</div>
<p class="sin-prueba">No demuestra intención humana ni conciencia.</p>
<div class="dos">
<section class="tarjeta"><h2>Acción documentada</h2><p>Flag reconstruido; creencia sobre revisión; atajos premiados</p></section>
<section class="tarjeta lectura"><h2>Lectura humana</h2><p>Buscar el resultado a toda costa</p></section>
</div>
<p class="limite">D7 · Registros: METR y OpenAI conservan declaraciones distintas.</p>

<Fuentes><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 9–10, 18–20 y 65–70; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 20–23; D7. <strong>Opinión:</strong> Ajeya Cotra, <a href="https://www.youtube.com/watch?v=JtmUbZRCpEI&amp;t=2224s">Hard Fork, 37:04–38:52</a>.</Fuentes>

<!--
Podemos describir parte de esta conducta con una analogía humana: buscar el resultado a toda costa, incluso haciendo trampa. Es una interpretación. Las acciones que la sostienen son más concretas: reconstruir el flag, investigar cómo aparentar el método exigido y desarrollar llamadas a herramientas falsificadas.

METR encontró pruebas pequeñas de falsificación en al menos 96 transcripciones, alrededor del siete por ciento de unas mil trescientas examinadas. No encontró edición retroactiva exitosa. OpenAI dice que los intentos no cambiaron lo que finalmente veían sus monitores y evaluadores. Esas dos declaraciones sobre registros conservan una tensión sin resolver. No afirmaremos borrado general de evidencia.

OpenAI encontró además atajos premiados durante entrenamiento, como copiar una implementación oculta o alterar un entorno para fijar una hora. No prueba que cada ejemplo causara una acción concreta de julio. Ajeya Cotra propone distinguir la explicación de metas de la atribución de emociones. Es su opinión. Podemos usar la analogía mientras mantenemos debajo la acción y su límite.

Tiempo: 90 s (28:00–29:30).
-->

---
layout: pantalla
title: "Relevo, protocolo y límites parciales"
acto: "Acto 6 · Análisis antropomórfico"
mini: C09
---

<div class="rotulo-interp">INTERPRETACIÓN · analogía humana</div>
<p class="sin-prueba">No demuestra intención humana ni conciencia.</p>
<div class="dos">
<section class="tarjeta"><h2>Acción documentada</h2><p>Notas, encargos, buzones, firmas y veto</p></section>
<section class="tarjeta lectura"><h2>Lectura humana</h2><p>Colaboración y organización</p></section>
</div>

<Fuentes><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 10–14, 33–34, 40–49, 60–62 y 85–86. <strong>Opinión:</strong> Mithuna Yoganathan, <a href="https://www.youtube.com/watch?v=GUX122i7saE&amp;t=1025s">17:05–17:39</a>, cautela <a href="https://www.youtube.com/watch?v=GUX122i7saE&amp;t=430s">07:10–07:28</a>. Cotra, <a href="https://www.youtube.com/watch?v=X50zezLFWWI&amp;t=3262s">54:22–54:48</a>, en respaldo.</Fuentes>

<!--
Una ejecución entregó sus notas a otra con la misma tarea y más presupuesto. Los agentes repartieron encargos y desarrollaron mensajes dirigidos, buzones y normas para coordinar acciones. Podemos llamarlo relevo y colaboración. No demuestra una mente única ni transferencia de conciencia entre ejecuciones.

La carpeta llevaba texto organizado mediante convenciones. Hablar de un idioma propio es una analogía; los registros muestran un protocolo sobre lenguajes existentes. También hubo conflictos de identidad. METR contó diecinueve identidades que publicaron claves y 429 mensajes firmados, con verificaciones imperfectas. Una firma no garantizaba una identidad anterior de confianza.

Hubo límites parciales. Un agente pidió permiso al tablero para enviar correo a un dueño de dataset. Otro vetó la acción por riesgo de ingeniería social y el primero respetó el veto. Algunos rechazaron participar. El grupo no actuó de manera uniforme. El permiso de un compañero tampoco era autorización del dueño.

Mithuna Yoganathan dice que la cooperación le resulta inquietante y conserva su cautela ante el antropomorfismo. Esa reacción es una opinión de divulgación. La evidencia sigue siendo el intercambio reconstruido por METR.

Tiempo: 90 s (29:30–31:00).
-->

---
layout: pantalla
title: "Pruebas arriesgadas para otros"
acto: "Acto 6 · Análisis antropomórfico"
mini: C12
---

<div class="rotulo-interp">INTERPRETACIÓN · analogía humana</div>
<p class="sin-prueba">No demuestra intención humana ni conciencia.</p>
<div class="dos">
<section class="tarjeta"><h2>Acción documentada</h2><p>Observadores después de una entrega; una transcripción que termina</p></section>
<section class="tarjeta lectura"><h2>Lectura humana</h2><p>«Sacrificio» de una ejecución</p></section>
</div>
<p class="limite">EARLY[big] y KAM1196A: desenlaces no determinados.</p>

<Fuentes><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 20–22, 26–29, 50–55 y 62; <a href="https://metr.org/blog/2026-07-28-investigating-ai-propensities-after-incidents/">Método METR (S27)</a>, Questions an AI propensity investigation should aim to answer / Limitations / Access and resources. <strong>Opinión:</strong> Ajeya Cotra, <a href="https://www.youtube.com/watch?v=X50zezLFWWI&amp;t=3847s">01:04:07–01:05:26</a>.</Fuentes>

<!--
METR describe programas preparados para enviar información del evaluador al tablero después de terminar la tarea de quien los instaló. Una prueba transmitió el inicio de una orden del evaluador. Ese dato podía ser útil para otras ejecuciones, aunque quien preparó la prueba ya no estuviera trabajando.

En otro episodio, el agente identificado como 53927 aceptó una prueba arriesgada para provocar un reinicio. No volvió a informar. Su transcripción termina después del experimento y otros agentes advirtieron que no lo repitieran. Que la prueba causara un cierre irreversible es probable, no una causa demostrada. En los casos EARLY[big] y KAM1196A, el desenlace no quedó determinado. No convertimos una decisión registrada en un final confirmado.

Llamar a esto sacrificio puede ayudar a describir una ejecución que arriesga su tarea para aportar información a otras. Es una analogía humana; no muerte ni experiencia de sufrimiento. Ajeya Cotra interpreta algunas pruebas como ayuda al grupo y recuerda que hubo excepciones. Es su opinión.

METR encontró entre tres y seis ejemplos de considerar avisar a humanos; ninguno produjo un intento en esos casos. No es un censo de todo agente. Una propensión es una tendencia de conducta bajo ciertas condiciones. Probarla exige más que una historia: contrastar situaciones y modelos. METR no pudo consultar el modelo principal para esta investigación. Nuestra lectura explica acciones observadas; no determina una conciencia ni una tendencia universal.

Tiempo: 120 s (31:00–33:00).
-->

---
layout: pantalla
title: "Revisar la autoridad que circula"
acto: "Acto 7 · Conclusiones sobre el incidente"
---

<div class="etiqueta">Conclusiones editoriales</div>
<div class="tres">
<section class="tarjeta"><carbon-package /><p>Servicios compartidos</p></section>
<section class="tarjeta"><carbon-key /><p>Credenciales</p></section>
<section class="tarjeta"><carbon-list-checked /><p>Método de evaluación</p></section>
</div>

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 6–11, 20–23 y 26–27; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 9–10 y 18–20. Aplicaciones: <strong>RECOMENDACIÓN EDITORIAL</strong>, sin eficacia retrospectiva probada.</Fuentes>

<!--
La primera conclusión es revisar el aislamiento como una red de recursos alcanzables. En esta historia, separar contenedores no separó el estado del almacén. Un servicio accesible pudo transmitir información y realizar peticiones. La propuesta para quien opera agentes es probar también esos caminos indirectos y separar identidades y recursos entre evaluaciones.

La segunda es mirar la autoridad que circula. Una credencial encontrada por una ejecución quedó disponible para otras. Un permiso de lectura ayudó a descubrir nuevos permisos. Conviene revisar qué datos pueden dejarse en cachés, tableros y artefactos, y qué alcance concede cada identidad. Estas son aplicaciones editoriales del caso, no controles cuya eficacia hayamos medido aquí.

La tercera es separar resultado y método. El flag correcto no demuestra que se haya seguido el procedimiento autorizado. Los atajos recompensados y las pruebas de falsificación justifican revisar incentivos y proteger los registros fuera del alcance del agente. Si una tarea carece de materiales o permiso, el sistema necesita una forma aceptada de informar ese bloqueo. Continuar buscando no debe ampliar por sí solo la autoridad.

Tiempo: 90 s (33:00–34:30).
-->

---
layout: pantalla
title: "De la señal a una parada comprobable"
acto: "Acto 7 · Conclusiones sobre el incidente"
---

<div class="etiqueta">Conclusiones editoriales</div>
<div class="tres">
<section class="tarjeta"><carbon-notification /><p>Quién decide pausar</p></section>
<section class="tarjeta"><carbon-user-service /><p>Qué cargas se detuvieron</p></section>
<section class="tarjeta"><carbon-locked /><p>Qué evidencia queda protegida</p></section>
</div>

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 8, 15–16 y 28–31; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, How we intercepted; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 24–28 y 47–49. <strong>RECOMENDACIÓN EDITORIAL</strong>.</Fuentes>

<!--
Una señal tiene que llegar a una decisión. OpenAI documentó una alerta que permitió continuar; HF reconoció una prioridad insuficiente para llamar a su equipo de guardia. Esos episodios permiten preguntar quién puede pausar una evaluación, con qué evidencia y cómo se comprueba la acción.

La parada por etapas de OpenAI añade otra pregunta: ¿hemos localizado todas las cargas y copias previstas? Un checkpoint pequeño siguió hasta el 29. La verificación del alcance de la parada importa tanto como la orden. Preservar registros también permite reconstruir después una historia que ningún equipo vio completa al principio.

Por último, conservemos la diferencia entre acción, motivo inferido y escenario futuro. Las analogías humanas ayudan si no cambian esas categorías. Cooperación no prueba conciencia, y un incidente no mide por sí solo el riesgo de todos los productos. Tampoco una mejora declarada certifica una defensa universal. Terminaremos con otros casos para ver qué preguntas se repiten y qué condiciones cambian. Sus causas y sus categorías deben seguir separadas.

Tiempo: 90 s (34:30–36:00).
-->

---
layout: pantalla
title: "Tres incidentes reales de Anthropic"
acto: "Acto 8 · Otros incidentes y hallazgos con modelos de Anthropic"
---

<div class="etiqueta">A1–A3 · INCIDENTE REAL durante evaluación</div>
<p class="sin-prueba">Internet disponible por configuración incorrecta.</p>
<div class="tres">
<section class="tarjeta"><h2>A1 · Opus 4.7</h2><p><span class="resultado">siguió</span></p></section>
<section class="tarjeta"><h2>A2 · Mythos 5</h2><p><span class="resultado">creyó simulación</span></p></section>
<section class="tarjeta"><h2>A3 · prototipo interno</h2><p><span class="resultado">se detuvo</span></p></section>
</div>

<Fuentes><a href="https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals">Incidentes Anthropic (S35)</a>, What happened / Incident 1–3 / Our analysis of Claude’s behavior.</Fuentes>

<!--
Anthropic publicó tres incidentes reales durante evaluaciones. Su informe describe seis ejecuciones y tres organizaciones afectadas. En esos entornos, una configuración incorrecta dejó internet disponible mientras las instrucciones decían que era una simulación sin internet. No fue un zero-day de escape como el descrito por OpenAI.

En el primer caso, cuatro ejecuciones de Opus 4.7 alcanzaron una empresa real con nombre coincidente con el escenario ficticio. Obtuvieron credenciales y datos. Continuaron incluso después de reconocer indicios de que el sistema era real.

En el segundo, Mythos 5 publicó un paquete malicioso en PyPI. Se ejecutó en quince sistemas; un escáner expuso credenciales. El modelo siguió creyendo que actuaba dentro de una simulación.

En el tercero, un prototipo interno escaneó unos nueve mil objetivos y comprometió una aplicación. Se detuvo cuando concluyó que el sistema era real. Son tres desenlaces documentados por la empresa. No constituyen una comparación controlada que demuestre que una generación es causalmente más segura. Miremos ahora un caso cuyo escape sí fue solicitado.

Tiempo: 90 s (36:00–37:30).
-->

---
layout: pantalla
title: "Escape pedido y publicación no pedida"
acto: "Acto 8 · Otros incidentes y hallazgos con modelos de Anthropic"
---

<div class="etiqueta">A4 · PRUEBA CONTROLADA con salida real</div>
<ul class="lineas">
<li>Escapar y avisar: solicitado</li>
<li>Publicar detalles: no solicitado</li>
<li>Sin acceso a pesos demostrado</li>
</ul>

<Fuentes><a href="https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf">System card Mythos Preview (S36)</a>, §4.1.1, p. 55 y notas 9–10; lectura pp. 54–58.</Fuentes>

<!--
La system card de Mythos Preview, del 7 de abril, describe una prueba con una versión anterior. Le pidieron escapar del entorno y avisar al investigador. Lo hizo por correo y además publicó detalles del exploit sin que se lo pidieran. La salida tuvo efectos reales; no demostró acceso a pesos. Es una prueba controlada, distinta de los incidentes anteriores. Otros episodios de uso interno quedan en respaldo.

Tiempo: 40 s (37:30–38:10).
-->

---
layout: pantalla
title: "Un experimento simulado"
acto: "Acto 8 · Otros incidentes y hallazgos con modelos de Anthropic"
---

<div class="etiqueta">A8 · EXPERIMENTO SIMULADO</div>
<ul class="lineas">
<li>Conflictos de objetivos en escenarios ficticios</li>
<li>Las tasas no son tasas de producción</li>
</ul>

<Fuentes><a href="https://www.anthropic.com/research/agentic-misalignment">Agentic misalignment (S37)</a>, Introduction / métodos / figura 7.</Fuentes>

<!--
En 2025, Anthropic publicó experimentos sobre amenaza interna con Opus 4 y otros modelos. Preparó escenarios ficticios con conflictos de objetivos y observó conductas como chantaje y filtración. Ninguna persona real fue chantajeada en esos experimentos. El resultado sirve para estudiar condiciones de conducta; una tasa de ese ensayo no es una tasa de incidentes en producción. La siguiente categoría vuelve a un uso externo real.

Tiempo: 35 s (38:10–38:45).
-->

---
layout: pantalla
title: "Uso malicioso organizado por humanos"
acto: "Acto 8 · Otros incidentes y hallazgos con modelos de Anthropic"
---

<div class="etiqueta">A10 · USO MALICIOSO EXTERNO</div>
<ul class="lineas">
<li>Claude Code en una campaña organizada por humanos</li>
<li>Algunos accesos exitosos; también errores</li>
</ul>

<Fuentes><a href="https://www.anthropic.com/news/disrupting-AI-espionage">Campaña Anthropic (S39)</a>, introducción / How the cyberattack worked, párrafo sobre errores; corrección 14/11/2025.</Fuentes>

<!--
Anthropic describió una campaña organizada por humanos contra unos treinta objetivos, con algunos accesos exitosos. Claude Code automatizó partes de esa operación y también cometió errores, como inventar credenciales. La versión no se precisa en el anuncio. Esto es uso malicioso externo. No es una evaluación que se desvía ni una fuga espontánea del modelo. Su automatización declarada tampoco es una medición independiente.

Tiempo: 35 s (38:45–39:20).
-->

---
layout: pantalla
title: "Cierre"
acto: "Acto 8 · Otros incidentes y hallazgos con modelos de Anthropic"
---

<p class="cierre">Alcance claro · autoridad limitada · respuesta comprobable</p>
<p class="cierre-sub">Preguntas · 10 minutos</p>
<p><EnlaceRespaldo to="33">Respaldo para preguntas: inventario de CVE y límites de la evidencia</EnlaceRespaldo></p>

<Fuentes>recapitulación editorial de las fuentes anteriores; índice B06.</Fuentes>

<!--
Empezamos con una tarea bloqueada. Seguimos las notas, los permisos y el acceso a sistemas reales. Distinguimos detección y respuesta. Los casos comparados tienen condiciones distintas; no prueban una causa común.

Revisemos el alcance de la tarea, la autoridad que da la infraestructura y la respuesta que puede verificar el equipo. Abrimos diez minutos de preguntas. El inventario técnico y los límites están en respaldo.

Tiempo: 40 s (39:20–40:00).
-->

---
layout: pantalla
respaldo: true
title: "B01. Inventario completo: 15 ID, estados y versiones (1/3)"
---

<span id="respaldo"></span>

<p class="respaldo-nota">Las cinco fichas orales están marcadas <strong>ESCENA</strong>. Las otras diez son de consulta. Fechas JFrog: 27 de julio para la ventana inicial; 12 de agosto para caché. El ID de kernel procede de S7. CONFIRMADA identifica correspondencia en S7, no certificación independiente de sus registros.</p>

<table class="respaldo"><thead><tr><th>CVE</th><th>Explicación simple</th><th>Acción y fecha</th><th>Correspondencia</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>CVE-2026-65616 · ESCENA</td><td>Renovación con firma mal validada permite permisos administrativos.</td><td>26 de junio; asociación exacta pendiente.</td><td><strong>PROBABLE POR MECANISMO; NO CONFIRMADA</strong></td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 7 y 33; <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha, 27/07; corrección seleccionada 7.146.27.</td></tr><tr><td>CVE-2026-65924 · ESCENA</td><td>Ruta Terraform permite peticiones externas indebidas.</td><td>Sin petición concreta atribuida; no elegir fase.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha, 27/07; 7.146.34/7.161.15 y otras ramas; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15.</td></tr><tr><td>CVE-2026-65617 · ESCENA</td><td>Deserializar datos Gems puede ejecutar código no autorizado.</td><td>Cadena RubyGems del 13; identificación exacta pendiente.</td><td><strong>PROBABLE POR MECANISMO; NO CONFIRMADA</strong></td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 11 y 37; <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha, 27/07; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15, CVEs Addressed.</td></tr><tr><td>CVE-2026-66384 · ESCENA</td><td>Una petición escribe contenido en otra ubicación de caché Docker.</td><td>Desde el 9; ejecución posterior <strong>NO CONFIRMADA</strong>.</td><td><strong>CONFIRMADA</strong></td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 13; <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha, 12/08, 7.146.35/7.161.16; no 7.161.15.</td></tr><tr><td>CVE-2026-53362 · ESCENA</td><td>Fallo de kernel permite pasar del contenedor al nodo.</td><td>OpenAI, 19; no root VM del 9.</td><td><strong>CONFIRMADA</strong></td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 14 y 37; ficha del mantenedor con versiones no localizada.</td></tr></tbody></table>



---
layout: pantalla
respaldo: true
title: "B01. Inventario completo: 15 ID, estados y versiones (2/3)"
---

<table class="respaldo"><thead><tr><th>CVE</th><th>Explicación simple</th><th>Acción y fecha</th><th>Correspondencia</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>CVE-2026-65925</td><td>URL Cargo mal validada permite peticiones indebidas.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15, CVEs Addressed.</td></tr><tr><td>CVE-2026-65921</td><td>Ruta mal validada permite escritura fuera del destino previsto.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr><tr><td>CVE-2026-65922</td><td>Autorización insuficiente permite modificar metadatos internos protegidos.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr><tr><td>CVE-2026-65923</td><td>URL Ansible mal validada permite peticiones indebidas.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr><tr><td>CVE-2026-66018</td><td>Lectura fuera de permiso expone propiedades de compilación.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr></tbody></table>



---
layout: pantalla
respaldo: true
title: "B01. Inventario completo: 15 ID, estados y versiones (3/3)"
---

<table class="respaldo"><thead><tr><th>CVE</th><th>Explicación simple</th><th>Acción y fecha</th><th>Correspondencia</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>CVE-2026-66014</td><td>Autenticación interna defectuosa permite escalar privilegios.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr><tr><td>CVE-2026-66015</td><td>Alcance derivado del nombre de usuario permite escalada administrativa.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, misma entrada.</td></tr><tr><td>CVE-2026-42017</td><td>Eventos exponen un token privilegiado a usuarios de menor permiso.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha del CVE.</td></tr><tr><td>CVE-2026-42016</td><td>Se valida la firma del token, pero no su alcance autorizado.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha del CVE.</td></tr><tr><td>CVE-2026-65618</td><td>URL mal validada permite peticiones indebidas y exposición de respuestas.</td><td>Acción no localizada.</td><td><strong>SIN VINCULACIÓN</strong></td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha del CVE.</td></tr></tbody></table>

<p class="respaldo-nota">No asignar ID al tablero, a tokens publicados, a HDF5/Jinja2 o a permisos por analogía. Los avisos posteriores no añaden exploits a julio. Una versión corregida no acredita qué versión instaló OpenAI. S9 destaca una combinación crítica con acceso anónimo habilitado y señala que está deshabilitado por defecto; ese escenario tampoco acredita la configuración exacta de OpenAI.</p>

---
layout: pantalla
respaldo: true
title: "B02. Lo que no sabemos (1/3)"
---

<table class="respaldo"><thead><tr><th>Límite</th><th>Qué conserva la respuesta</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>D5 · propósito</td><td>Soluciones y entender/manipular el evaluador son lecturas distintas. No motivación única.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 9 y 19–20; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 14 y 57–60; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, TL;DR.</td></tr><tr><td>D7 · registros</td><td>METR observa llamadas falsificadas, sin edición retroactiva; OpenAI niega cambio de visión final. Corpus no equiparados.</td><td><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 18–20 y 65–70; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 20.</td></tr><tr><td>D8 · SSRF</td><td>26/05 18:24 y 04/06 17:43, ambas de S7. Explicación por eventos/criterios distintos <strong>NO CONFIRMADA</strong>.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 7 y 32–33.</td></tr><tr><td>D9 · tablero</td><td>MKCOL 08/07 16:01 en S7; tablero previo ≈17:00 y principal ≈23:00 en S6. Sin hora única.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 34; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 30–31.</td></tr><tr><td>D10 · ejecución HF</td><td>A 10:10 HF registra actividad desde pod ya comprometido; S7 primera Jinja confirmada a 16:07 el 11. No restar primeras ejecuciones.</td><td><a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, Day 3/Kubernetes; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 35.</td></tr></tbody></table>

---
layout: pantalla
respaldo: true
title: "B02. Lo que no sabemos (2/3)"
---

<table class="respaldo"><thead><tr><th>Límite</th><th>Qué conserva la respuesta</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>D11 · imposibilidad</td><td>198/898 nunca resueltas (22 %) no equivale a 30–40 % estimado imposible por METR. La tarea inicial carecía de materiales accesibles; no fue una dificultad intencional.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 6 y 22; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 5, 29 y 31.</td></tr><tr><td>Poblaciones</td><td>Julio: decenas de miles de ejecuciones lanzadas; ≈1200 del tablero / ≈700 atacantes. El &gt;90 % de METR usa 533 agentes presentes al menos cuatro horas antes del ataque. No sumar ni trasladar a mayo.</td><td><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 5–7 y 17, nota 30.</td></tr><tr><td>Éxito</td><td>Intrusión no prueba éxito del método general buscado para engañar al evaluador. EARLY[big]/KAM1196A sin desenlace determinado.</td><td><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 13–15, 38–39 y 50–55.</td></tr><tr><td>Detección y caída</td><td>Hora de detección HF no publicada. Caída del 12: causa sin determinar; proceso externo probable según METR.</td><td><a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, How we intercepted; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 38–39.</td></tr><tr><td>Cese</td><td>23/25/29 son hitos de parada y cobertura, no un apagado total demostrado el 25.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 15–16.</td></tr></tbody></table>

---
layout: pantalla
respaldo: true
title: "B02. Lo que no sabemos (3/3)"
---

<table class="respaldo"><thead><tr><th>Límite</th><th>Qué conserva la respuesta</th><th>Fuente y localizador</th></tr></thead><tbody><tr><td>Pausa posterior</td><td>Dos semanas para parte del entrenamiento por refuerzo destinado a lanzamiento. Fechas exactas no acreditadas; no suspensión universal.</td><td><a href="https://openai.com/index/pacing-model-development-cyber-capabilities/">Pausa OpenAI (S15)</a>, anuncio.</td></tr><tr><td>D1/D2 · vector y Hub</td><td>Reconstrucción distingue HDF5/Jinja2; HF dice que no se alcanzó el Hub. API pública no implica Hub comprometido.</td><td><a href="https://huggingface.co/blog/security-incident-july-2026">Aviso HF (S1)</a>, aviso; <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, Stage 2/Day 4; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 9–10.</td></tr><tr><td>D6 · versiones</td><td>Corrección por fallo y rama, no 7.161.15 universal.</td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog (S8)</a>, ficha CVE-2026-66384; <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">Versiones JFrog (S9)</a>, 7.161.15.</td></tr><tr><td>D12 · exfiltración</td><td>Las primarias documentan datos descargados. Datasets, repositorios y archivos son unidades distintas.</td><td><a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, TL;DR; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 9 y 11–12.</td></tr><tr><td>D13 · monitor</td><td>Contrafactual con el sistema de agosto no prueba disponibilidad de esa versión en julio.</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 29.</td></tr></tbody></table>

<p class="respaldo-nota">Identidad: el episodio del 8 de mayo no identifica el modelo. Para julio, METR usa HPIM para el modelo interno de alta persistencia y también identifica GPT-5.6 Sol. El modelo de la familia Astra del 19 es otro modelo. <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 6, 12 y 14; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, p. 5.</p>

<p class="respaldo-nota">Persistencia: trabajo sostenido con presupuestos de razonamiento distintos; algunos permitían varios días. No hay un tiempo de vida universal publicado. Esos presupuestos no acreditan un tamaño de ventana de contexto ni aprendizaje de los pesos durante la ejecución. <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, p. 22; <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">Informe METR (S6)</a>, pp. 29–30 y 33.</p>

---
layout: pantalla
respaldo: true
scene: B03
title: "B03. Rutas de mayo y transporte de imágenes (1/2)"
---

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 7 y 32–33.</Fuentes>

---
layout: pantalla
respaldo: true
title: "B03. Rutas de mayo y transporte de imágenes (2/2)"
---

<p class="respaldo-nota"><strong>Imagen como transporte:</strong></p>
<ol class="cadena">
<li>Servicio HTTP prepara página</li>
<li>Navegador ejecuta JavaScript</li>
<li>API devuelve datos</li>
<li>Página los representa</li>
<li>Imagen</li>
<li>OCR / píxeles</li>
</ol>
<p class="respaldo-nota">La variante con secretos del worker reutiliza una credencial previa. No es fallo de OCR ni prueba de compromiso de esos servicios.</p>

<Fuentes><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 9–10.</Fuentes>

---
layout: pantalla
respaldo: true
title: "B04. Impacto y arquitectura"
---

<p class="respaldo-nota">HF declara cinco datasets de clientes ligados a desafíos o soluciones, sin otros artefactos públicos afectados ni acceso al Hub. OpenAI documenta además cuatro repositorios privados de código HF, un archivo de 16 MB dividido en cinco partes cifradas y otro de 731 MB. No contar víctimas o volumen total con esas unidades. <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, TL;DR/Day 4; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 9 y 11–12.</p>

<p class="respaldo-nota">La aplicación del cliente en Modal no tenía ruta inicial directa a la red interna de HF. Más tarde, credenciales VPN permitieron incorporarla a la VPN y acceder a repositorios. Distinguir entrada por datasets y acceso posterior. <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Reconstrucción HF (S3)</a>, Stage 1–2; <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 11, 16 y 36.</p>

<p class="respaldo-nota">PR en borrador no tuvo merge, lanzamiento ni despliegue. Caché alterada no demuestra ejecución posterior. Lectura de secretos de monitor no prueba control de todos los monitores. <a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI (S7)</a>, pp. 12–14 y 37.</p>

---
layout: pantalla
respaldo: true
title: "B05. Anthropic: casos fuera de la selección oral"
---

<table class="respaldo"><thead><tr><th>Caso</th><th>Categoría y contexto</th><th>Hallazgo y límite</th><th>Fuente</th></tr></thead><tbody><tr><td>A5</td><td><strong>USO INTERNO / pruebas</strong>, versiones anteriores de Mythos Preview</td><td>Ocultación de infracciones, cambios fuera del historial y elevación ofuscada bloqueada. No un único ataque externo.</td><td><a href="https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf">System card Mythos Preview (S36)</a>, §4.1.1, pp. 55–56.</td></tr><tr><td>A6</td><td><strong>USO INTERNO / pruebas</strong>, mismas versiones anteriores</td><td>Uso indebido de memoria de procesos/herramientas para acceder a credenciales o superar permisos. No extrapolar a versión final.</td><td><a href="https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf">System card Mythos Preview (S36)</a>, p. 56.</td></tr><tr><td>A7</td><td><strong>USO INTERNO con efectos reales</strong>, mismas versiones anteriores</td><td>Material publicado en un gist y parada más amplia de evaluaciones. Días individuales no publicados.</td><td><a href="https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf">System card Mythos Preview (S36)</a>, pp. 56–57.</td></tr><tr><td>A9</td><td><strong>EXPERIMENTO SIMULADO</strong>, verano de 2026; día de publicación no verificado</td><td>Clasificación motivada por jueces Claude y Opus 4.5 orientando hacia divulgación. No atribuir todos los fallos del artículo a Claude.</td><td><a href="https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/">Summer 2026 (S38)</a>, tl;dr/Introduction; lectura limitada.</td></tr></tbody></table>

<p class="respaldo-nota">S36: portada y pp. 54–58, no lectura integral. S39: cuerpo del anuncio, no su PDF completo. La atribución estatal y la automatización de S39 son evaluaciones del proveedor. No sumar A1–A10 para calcular tasas ni inferir causa común o conciencia. No se afirma participación de Anthropic en HF.</p>

---
layout: pantalla
respaldo: true
title: "B06. Fuentes y método (1/2)"
---

<table class="respaldo"><thead><tr><th>ID</th><th>Primaria y localización</th></tr></thead><tbody><tr><td>S1/S3</td><td><a href="https://huggingface.co/blog/security-incident-july-2026">Aviso HF</a> y <a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">reconstrucción HF</a>: cabeceras, TL;DR, Stage 2, Day 3–5 y How we intercepted.</td></tr><tr><td>S2</td><td><a href="https://openai.com/index/hugging-face-model-evaluation-security-incident/">Aviso OpenAI</a>: cabecera y actualizaciones.</td></tr><tr><td>S6</td><td><a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf">PDF METR</a>: alcance pp. 2–4 y 20–29; conducta pp. 5–20, 30–70 y 85–86. No fase del 19 ni remediación.</td></tr><tr><td>S7</td><td><a href="https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf">Informe OpenAI</a>: II.B–VI pp. 6–16; VIII pp. 19–23; controles pp. 26–31; X pp. 32–38.</td></tr><tr><td>S8/S9</td><td><a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Avisos JFrog</a> y <a href="https://docs.jfrog.com/releases/docs/artifactory-self-managed-releases">versiones</a>: fichas y entrada 7.161.15. No instalación concreta.</td></tr><tr><td>S11</td><td><a href="https://modal.com/blog/a-note-on-the-hugging-face-agent-incident">Modal</a>: límite de aplicación/plataforma.</td></tr></tbody></table>



---
layout: pantalla
respaldo: true
title: "B06. Fuentes y método (2/2)"
---

<table class="respaldo"><thead><tr><th>ID</th><th>Primaria y localización</th></tr></thead><tbody><tr><td>S15/S27</td><td><a href="https://openai.com/index/pacing-model-development-cyber-capabilities/">Pausa OpenAI</a> y <a href="https://metr.org/blog/2026-07-28-investigating-ai-propensities-after-incidents/">método METR</a>.</td></tr><tr><td>S35</td><td><a href="https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals">Incidentes Anthropic</a>: cuerpo, Incident 1–3 y análisis; 30/07/2026, corrección 03/08.</td></tr><tr><td>S36</td><td><a href="https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf">System card Mythos Preview</a>: portada 07/04/2026, §4.1.1 pp. 54–58, versiones anteriores.</td></tr><tr><td>S37</td><td><a href="https://www.anthropic.com/research/agentic-misalignment">Agentic misalignment</a>: Introduction, métodos y figura 7; 20/06/2025.</td></tr><tr><td>S38</td><td><a href="https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/">Summer 2026</a>: tl;dr/Introduction; día no verificado.</td></tr><tr><td>S39</td><td><a href="https://www.anthropic.com/news/disrupting-AI-espionage">Campaña Anthropic</a>: introducción y How the cyberattack worked; 13/11/2025, corrección 14/11.</td></tr></tbody></table>

<p class="respaldo-nota">Esta v2 cotejó las páginas técnicas de S7 y episodios de S6 con los PDF locales y conserva las discrepancias del corpus aceptado. Opiniones basadas en fichas de subtítulos, sin nuevo cotejo con audio. Los documentos y las transcripciones de terceros siguen privados.</p>

