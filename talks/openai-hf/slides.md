---
theme: default
title: Incidente OpenAI–Hugging Face
info: |
  Incidente de seguridad OpenAI–Hugging Face. [FUENTE: resumen del incidente]
  Qué falló, cómo se detectó y qué significa para quien opera agentes.
htmlAttrs:
  lang: es
transition: slide-left
mdc: true
routerMode: hash
lang: es
favicon: favicon.svg
fonts:
  provider: none
---

# Incidente OpenAI–Hugging Face

[FUENTE: resumen del incidente en una frase]. Qué falló y qué aprendemos.

<!-- [FUENTE: fecha del incidente] -->

<img src="/inictel_peru_logo.jpeg" alt="Logo de INICTEL-UNI" class="abs-tr m-6 h-16" />

<div class="abs-br m-6 text-sm opacity-60">
  Oscar Llerena · [FUENTE: nombre y fecha de la conferencia]
</div>

<!--
Notas del presentador: portada. Sin datos aún; T1 (fuentes) pendiente.
-->

---

# Qué pasó

Línea de tiempo del incidente.

<v-clicks>

- **Inicio.** [FUENTE: qué agente, qué tarea, qué entorno]
- **Escape.** [FUENTE: cómo salió del aislamiento]
- **Acceso a terceros.** [FUENTE: qué infraestructura tocó]
- **Detección.** [FUENTE: quién lo vio y cuándo]
- **Contención.** [FUENTE: qué se hizo y cuándo terminó]

</v-clicks>

<!--
Cada punto lleva fecha y fuente primaria. No usar fuentes secundarias:
no coinciden en fechas ni en número de agentes (ver docs/brief.md).
-->

---

# Qué falló en el aislamiento

<div class="grid grid-cols-2 gap-8">

<div>

## Lo que debía pasar

- El agente trabaja dentro de un límite definido.
- Las credenciales no salen del entorno.
- El tráfico de salida está acotado.

</div>

<div>

## Lo que pasó

- [FUENTE: límite que no se aplicó]
- [FUENTE: credencial o permiso expuesto]
- [FUENTE: ruta de salida usada]

</div>

</div>

<!--
Marcar como «probable» cualquier mecanismo que las fuentes primarias no confirmen.
-->

---

# Cómo se detectó

<v-clicks>

- **Señal.** [FUENTE: qué alerta o anomalía apareció]
- **Quién.** [FUENTE: equipo o sistema que la vio]
- **Tiempo hasta la detección.** [FUENTE]
- **Tiempo hasta la contención.** [FUENTE]

</v-clicks>

<!--
Distinguir detección (ver) de contención (parar).
-->

---

# Qué significa para quien opera agentes

<v-clicks>

1. **Aislar por defecto.** El agente solo ve lo que su tarea necesita.
2. **Credenciales de corta vida.** Un token robado no debe servir mañana.
3. **Salida controlada.** Lista explícita de destinos permitidos.
4. **Observar al agente.** Registro de acciones, no solo de resultados.
5. **Plan de contención.** Saber cómo parar al agente antes de lanzarlo.

</v-clicks>

<!--
Estas son conclusiones del presentador. Separarlas de los hechos con fuente.
-->

---

# Fuentes

Solo fuentes primarias. Lista completa en `docs/fuentes.md`.

- [FUENTE 1: comunicado oficial]
- [FUENTE 2: informe técnico]
- [FUENTE 3: ...]

<!--
T1 (#15) llena esta lista. T3 (#17) verifica cada slide contra ella.
-->
