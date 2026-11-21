# OFFEN EDU - CTFs

OFFEN EDU es una aplicación de retos de ciberseguridad tipo *Capture the Flag* (CTF). Para usarla necesitas credenciales y debes conectarte desde una de las salas del laboratorio, **Q2-103** o **Q2-105**.

## Cómo obtener credenciales { #como-obtener-credenciales }

Envía un correo a [ollerenac@uni.edu.pe](mailto:ollerenac@uni.edu.pe?subject=Solicitud%20de%20credenciales%20para%20OFFEN%20EDU) con estos datos.

- Nombres y apellidos completos
- Código UNI
- Correo institucional UNI

El profesor Oscar Llerena generará tus credenciales y te las enviará por correo.

## Cómo ingresar al laboratorio

**Los laboratorios se pueden usar de lunes a viernes, de 9:00 a. m. a 4:30 p. m.**

Cuando recibas tus credenciales, coordina con el profesor el día y el horario en que quieres ingresar. Después, completa el [formulario de acceso al laboratorio](index.md#solicitud-de-acceso) para solicitar la reserva o registrar tu ingreso.

## Cómo configurar la IP estática en Windows 11 { #ip-estatica-windows-11 }

Antes de abrir OFFEN EDU, busca la etiqueta en el escritorio de tu terminal. Allí está escrita la dirección IPv4 que debes usar en ese equipo.

1. Presiona **Windows + I** para abrir **Configuración**.
2. Entra en **Red e Internet → Ethernet** y selecciona la conexión del laboratorio si Windows muestra más de una.
3. Junto a **Asignación de IP**, pulsa **Editar**. Selecciona **Manual** y activa **IPv4**.
4. Configura los campos de IPv4.

    - En **Dirección IP**, escribe la dirección impresa en la etiqueta de tu escritorio.
    - En **Máscara de subred**, escribe `255.255.255.0`. Si Windows muestra **Longitud del prefijo de subred**, escribe `24`.
    - Deja vacío el campo **Puerta de enlace**.

5. Pulsa **Guardar**.
6. Abre **Símbolo del sistema** y ejecuta `ipconfig`. En el adaptador Ethernet, verifica que la IPv4 coincida con la etiqueta, que la máscara sea `255.255.255.0` y que no aparezca una puerta de enlace IPv4.
7. Desde la red del laboratorio, abre [https://192.168.22.147](https://192.168.22.147) en el navegador. En la pantalla de inicio de sesión de OFFEN EDU, introduce las credenciales que te envió el profesor.

[Configuración de red en Windows — Microsoft](https://support.microsoft.com/es-es/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows)
