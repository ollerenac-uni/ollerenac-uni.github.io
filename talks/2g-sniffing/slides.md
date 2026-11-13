---
theme: default
title: "Hacking RF 101: Sniffando la estación base"
info: |
  Recepción pasiva de señalización 2G con SDR: del downlink a la identidad del abonado.
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
layout: portada
---

# Hacking RF 101: Sniffando la estación base

<p class="nombre">Oscar Llerena</p>

<p class="desc">Consultor Ciberseguridad · Telecomunicaciones · IA aplicada</p>

<img class="logo-yachaq" src="./img/yachaqlabs.svg" alt="YachaqLabs" />

<!--
Recepción PASIVA. No se transmite, no se accede a la red, no se descifra tráfico.
Se demuestra una falla de diseño conocida y reportada de 2G: la señalización de
identidad viaja sin protección de confidencialidad. Uso educativo / investigación.
-->

---
layout: pantalla-anim
title: "Punto de partida"
---

<div class="canvas2">
  <section class="zona2 z-op">
    <span class="z-lab">Redes Móviles</span>
    <div class="nodo-tel">
      <carbon-mobile class="ic-big" />
      <span>Teléfono</span>
    </div>
    <div class="flecha1"><span class="b1">1</span></div>
    <div class="nodo-bts" v-motion :initial="{ opacity: 0, y: 16 }" :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 500 } }">
      <carbon-cell-tower class="ic-big" />
      <span>Estación base</span>
      <div class="gens">
        <b v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 1200 } }">5G</b>
        <b v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 1900 } }">4G</b>
        <b v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 2600 } }">3G</b>
        <b class="g2" v-motion :initial="{ opacity: 0, scale: 0.6 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 3300, type: 'spring' } }">2G</b>
      </div>
    </div>
  </section>
  <section class="zona2 z-net dim"><span class="z-lab">Recepción pasiva · PC + SDR</span></section>
  <section class="zona2 z-exp dim"><span class="z-lab">Exposición</span></section>
</div>

<p class="gsm-line" v-motion :initial="{ opacity: 0, y: 12 }" :enter="{ opacity: 1, y: 0, transition: { delay: 4400, duration: 600 } }">GSM, es decir 2G, emite su plano de señalización <strong>sin cifrar</strong></p>

<!--
En nuestras redes móviles, el acceso lo componen los dispositivos móviles y la
estación base — hoy con infraestructura desplegada para 5G, 4G, 3G e, aún, 2G.
Y resulta que GSM, es decir 2G, emite su plano de señalización (RR/MM) sin cifrar.
-->

---
layout: pantalla-anim
title: "IMSI y TMSI"
acto: "Acto 1 · la identidad"
---

<div class="identidad-slide">
<CanvasZonas>
  <template #redes><RedesMoviles /></template>
</CanvasZonas>
<div class="dos">
<section class="tarjeta"><h2>IMSI</h2><p>identificador permanente del abonado</p></section>
<section class="tarjeta lectura"><h2>TMSI</h2><p>alias temporal, reasignado por la red</p></section>
</div>
</div>

<!--
GSM no autentica la red hacia el terminal. El TMSI reduce la exposición del IMSI,
pero hay ventanas donde el IMSI viaja en claro (ver Acto 2).
-->

---
layout: pantalla-anim
title: "El IMSI en el paging"
---

<div class="paging-slide">
  <div class="paging-enlace">
    <div class="paging-nodo" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
      <carbon-mobile class="ic-big" />
      <span>Teléfono</span>
    </div>
    <div class="paging-difusion" v-motion :initial="{ opacity: 0, x: 16 }" :enter="{ opacity: 1, x: 0, transition: { delay: 500, duration: 450 } }">
      <strong>Paging Request · PCH</strong>
      <span class="paging-flecha" aria-hidden="true"></span>
      <span>Downlink · difusión a toda la celda</span>
    </div>
    <div class="paging-nodo" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
      <carbon-cell-tower class="ic-big" />
      <span>Estación base</span>
    </div>
  </div>
  <section class="paging-caso paging-tmsi" v-motion :initial="{ opacity: 0, y: 12 }" :enter="{ opacity: 1, y: 0, transition: { delay: 1200, duration: 450 } }">
    <div><span class="paging-paso">Caso 1</span><h2>Paging por <strong>TMSI</strong></h2></div>
    <div class="paging-resultado"><strong>IMSI protegido</strong><span>Se difunde el alias temporal</span></div>
  </section>
  <section class="paging-caso paging-imsi" v-motion :initial="{ opacity: 0, y: 12 }" :enter="{ opacity: 1, y: 0, transition: { delay: 2500, duration: 450 } }">
    <div><span class="paging-paso">Caso 2</span><h2>Paging por <strong>IMSI</strong></h2></div>
    <div class="paging-resultado"><strong>EN CLARO</strong><span>Identificador permanente expuesto</span></div>
  </section>
  <div class="paging-cierre" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { delay: 3800, duration: 500 } }">
    <div class="paging-contraste"><strong class="paging-identidad">IMSI</strong><span>vs</span><strong class="paging-alias">TMSI</strong></div>
    <p>lo que capturamos pasivamente es el <strong>paging por IMSI</strong></p>
  </div>
</div>

<!--
La estación base difunde Paging Request por el PCH hacia toda la celda.
Con TMSI se anuncia un alias temporal: el IMSI no aparece en ese paging.
Con IMSI se anuncia el identificador permanente en claro. La herramienta captura
pasivamente esos IMSIs del paging/PCH, sin transmitir ni solicitar la identidad.
-->

---
layout: pantalla-anim
title: "Un receptor más"
acto: "Acto 1 · la identidad"
---

<CanvasZonas>
  <template #redes><RedesMoviles /></template>
  <template #recepcion>
    <img class="receptor-foto" src="./img/sdr-setup.webp" alt="USRP B210 conectado por USB 3.0 a una laptop" />
  </template>
</CanvasZonas>

<div class="sdr-rotulo" v-motion :initial="{ opacity: 0, y: 8 }" :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 500 } }">Software-Defined Radio + Linux (Radioconda)</div>

<div class="sdr-flow">
  <div class="fl-item" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { delay: 800, duration: 450 } }">
    <svg class="fl-wave" viewBox="0 0 84 30" aria-hidden="true"><path d="M2 15 Q 12 1 22 15 T 42 15 T 62 15 T 82 15" fill="none" stroke="currentColor" stroke-width="2.6" /></svg>
    <span>Señal de radio</span>
  </div>
  <span class="fl-arrow" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 1200 } }">demodula →</span>
  <div class="fl-item" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { delay: 1600, duration: 450 } }">
    <code class="fl-bits">0 1 0 1 1 0</code>
    <span>Bits</span>
  </div>
  <span class="fl-arrow" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 2000 } }">framing →</span>
  <div class="fl-item fl-canal" v-motion :initial="{ opacity: 0, scale: 0.8 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 2400, type: 'spring' } }">
    <span class="fl-canal-t">Canales</span>
    <span class="fl-canal-s">BCCH · CCCH</span>
  </div>
</div>

<!--
El downlink es un broadcast a toda la celda; un receptor pasivo capta lo mismo sin
emitir nada. El SDR + Linux (Radioconda) entrega la señal; el software la demodula
a bits y los organiza (framing) en canales lógicos.
-->

---
layout: pantalla-anim
title: "Demodulación"
---

<CanvasZonas>
  <template #redes><RedesMoviles /></template>
  <template #recepcion>
    <div class="recep-demod">
      <img class="scan-term" src="./img/scan.png" alt="grgsm_scanner: ARFCNs detectados" v-motion :initial="{ opacity: 0, y: 14 }" :enter="{ opacity: 1, y: 0, transition: { delay: 700, duration: 600 } }" />
      <div class="grgsm-badge" v-motion :initial="{ opacity: 0, y: -6 }" :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 450 } }">gr-gsm · GNU Radio</div>
      <img class="receptor-foto recep-foto-sm" src="./img/sdr-setup.webp" alt="USRP B210 + laptop" />
    </div>
  </template>
</CanvasZonas>

<!--
En el PC, gr-gsm (GNU Radio) sintoniza la ARFCN y demodula GMSK; grgsm_scanner
lista las celdas activas (ARFCNs). La señalización decodificada sale como GSMTAP.
-->

---
layout: pantalla-anim
title: "Canales de señalización abiertos"
---

<CanvasZonas>
  <template #redes><RedesMoviles /></template>
  <template #recepcion>
    <div class="canales-stack">
      <div class="canal-chip abierto" v-motion :initial="{ opacity: 0, x: -14 }" :enter="{ opacity: 1, x: 0, transition: { delay: 300, duration: 400 } }">
        <carbon-unlocked class="canal-ic" />
        <div class="canal-txt"><b>BCCH</b><span>System Information</span></div>
        <span class="canal-tag">abierto</span>
      </div>
      <div class="canal-chip abierto imsi" v-motion :initial="{ opacity: 0, x: -14 }" :enter="{ opacity: 1, x: 0, transition: { delay: 700, duration: 400 } }">
        <carbon-unlocked class="canal-ic" />
        <div class="canal-txt"><b>CCCH · PCH</b><span>Paging</span></div>
        <span class="canal-tag imsi-tag">IMSI aquí</span>
      </div>
      <div class="canal-chip abierto" v-motion :initial="{ opacity: 0, x: -14 }" :enter="{ opacity: 1, x: 0, transition: { delay: 1000, duration: 400 } }">
        <carbon-unlocked class="canal-ic" />
        <div class="canal-txt"><b>SDCCH</b><span>MM · location update</span></div>
        <span class="canal-tag">abierto</span>
      </div>
      <div class="canal-sep" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 1300 } }"></div>
      <div class="canal-chip cifrado" v-motion :initial="{ opacity: 0, x: -14 }" :enter="{ opacity: 1, x: 0, transition: { delay: 1500, duration: 400 } }">
        <carbon-locked class="canal-ic" />
        <div class="canal-txt"><b>TCH</b><span>Tráfico · voz / datos</span></div>
        <span class="canal-tag cifr-tag">A5/x cifrable</span>
      </div>
    </div>
  </template>
</CanvasZonas>

<div class="canales-cierre" v-motion :initial="{ opacity: 0, y: 8 }" :enter="{ opacity: 1, y: 0, transition: { delay: 1900, duration: 500 } }">
  <p>La señalización de identidad temprana viaja <strong>sin cifrar</strong>. El tráfico puede cifrarse (A5/x), pero el <strong>IMSI ya salió</strong> por el paging.</p>
</div>

<!--
BCCH/CCCH transportan los procedimientos de Mobility Management. El IMSI se expone
cuando ocurre un location update sin TMSI aún asignado, o un paging/identity por
IMSI, ANTES de la reasignación del TMSI. El canal de tráfico puede cifrarse (A5/x);
la señalización de identidad temprana es la que queda observable. Acto 2 termina
aquí: los canales abiertos son el puente al Acto 3.
-->

---
layout: pantalla
title: "Del canal a GSMTAP"
acto: "Acto 3 · extracción"
scene: C08
---

<!--
Los paquetes GSMTAP llegan a lo:4729. GSMEvil2 (pyshark) los sniffea y parsea la
señalización GSM_A.CCCH.
-->

---
layout: pantalla
title: "IMSI en claro"
acto: "Acto 3 · extracción"
scene: C09
---

<p class="cierre">Un identificador permanente, extraído sin transmitir nada.</p>

<!--
El momento central: del paging/identity request sale el IMSI del abonado, en claro.
"Este teléfono estuvo en el alcance de la antena."
-->

---
layout: pantalla
title: "No es un abonado"
acto: "Acto 4 · escala"
scene: C10
---

<!--
Sobre una ventana de captura se acumulan miles de IMSIs únicas. La escala convierte
una curiosidad en un problema de privacidad masivo.
-->

---
layout: pantalla
title: "Roamers por MCC"
acto: "Acto 4 · escala"
scene: C11
---

<p class="paises">USA · España · Liechtenstein · Chile · Argentina · …</p>

<!--
El MCC/MNC del IMSI es la red de origen del abonado. Un MCC != 716 (Perú) = roamer.
Datos reales de la captura: decenas de roamers de distintos países.
-->

---
layout: pantalla
title: "Presencia en el tiempo"
acto: "Acto 4 · escala"
scene: C12
---

<!--
La misma IMSI reaparece: primera y última vez vista. Eso es rastreo de presencia de
un individuo, no solo su nacionalidad.
-->

---
layout: pantalla
title: "La interfaz"
acto: "Acto 4 · escala"
---

<div class="galeria-web">
  <figure><img src="./img/web_imsi.png" alt="Tabla IMSI en vivo"/><figcaption>/imsi/ · tabla en vivo</figcaption></figure>
  <figure><img src="./img/web_analytics.png" alt="Panel de analytics: roamers"/><figcaption>/analytics/ · roamers y presencia</figcaption></figure>
</div>

<!--
GSMEvil2 + panel propio: /imsi/ (tabla en vivo), /analytics/ (combos MCC/MNC,
roamers marcados, presencia) y /search/ (¿está tu IMSI entre las capturadas?).
Demo real corriendo en Docker con el B210.
-->

---
layout: pantalla
title: "Falla conocida y reportada"
acto: "Acto 5 · contexto"
scene: C14
---

<!--
La cadena completa. Nada de esto es nuevo: ausencia de autenticación mutua, A5/1
roto hace años, IMSI catchers documentados. Falla de diseño de 2G, reportada hace
décadas. El punto: 2G sigue en servicio en muchas redes.
-->

---
layout: pantalla
title: "Defensa"
acto: "Acto 5 · contexto"
---

<div class="tres">
<section class="tarjeta"><carbon-security /><p>Apagar 2G (sunset)</p></section>
<section class="tarjeta"><carbon-locked /><p>TMSI/GUTI y re-cifrado de identidad</p></section>
<section class="tarjeta"><carbon-checkmark-filled /><p>5G SUCI: identificador cifrado</p></section>
</div>

<!--
Mitigaciones: apagado de 2G por los operadores; uso correcto del TMSI; y, de raíz,
el SUCI de 5G cifra el identificador permanente (SUPI) con la clave pública de la red.
-->

---
layout: pantalla
title: "Cierre"
acto: "Acto 5 · contexto"
---

<div class="cierre-lista">
<p>Recepción pasiva</p>
<p>Canales abiertos</p>
<p>Falla aún no resuelta</p>
</div>

<p class="cierre-preguntas">Preguntas</p>

<!--
Alcance claro: recepción pasiva de señalización 2G no protegida, falla documentada.
Preguntas.
-->
