---
title: "tvcast: mi propia Sunday Box sin internet"
description: Con Armbian en una Sunday Box de 4 €, la convertí en un marco de fotos que crea su propia WiFi, enseña un QR en la tele y recibe las fotos desde el navegador del móvil. Cuento el punto de acceso que no quería funcionar, el arranque sin consola, el mando Bluetooth y los cuelgues.
publishDate: 2026-11-22
draft: true
pinned: false
lang: es
tags:
  - homelab
  - hardware
  - go
  - bluetooth
  - linux
---

En el [post anterior](/es/posts/sunday-box-armbian-es/) conté cómo acabé con Armbian corriendo en una Sunday Box que me costó 4 €. Con Linux en la caja, el siguiente paso era devolverle su propósito original, mandar fotos a la tele de la familia, sin depender de la nube de nadie. Lo he llamado **tvcast**.

tvcast tiene una restricción que lo condiciona todo: **la caja va a una casa sin WiFi**. Así que no puede depender de ninguna red; tiene que **crear la suya**, que se llama `Tele`.

La idea:

- La tele muestra un **código QR**. Lo escaneas con el móvil, te conectas a la WiFi de la caja y se abre una web para **subir fotos**.
- Las fotos salen en la tele como pase de diapositivas.

Por dentro es sencillo: un **binario de Go estático para arm64**, que corre como usuario de sistema bajo **systemd** y escucha en el puerto 80 gracias a `CAP_NET_BIND_SERVICE` (sin ser root). Las fotos las pinta **mpv directamente por DRM/KMS** a 1920×1080, sin X ni gestor de ventanas. El i3 de la primera noche ya sobra. La primera prueba, todavía por la WiFi de casa, recibió fotos a la primera.

## El hallazgo: WPA2 que nunca arranca

Montar el punto de acceso me costó bastante más que el resto. `iw list` decía que el chip soportaba modo AP, así que lo intenté con lo que traía el sistema.

Primero, una sorpresa: Armbian gestionaba el WiFi con **netplan + systemd-networkd**, y NetworkManager lo veía como `unmanaged` por una regla de udev de netplan. Lo pasé a NetworkManager. Después, el punto de acceso de NetworkManager **falló tres veces seguidas**:

1. **`key setting validation failed`** en el log del kernel. Se arregló desactivando PMF (*Protected Management Frames*).
2. **Faltaba `dnsmasq-base`**, que NetworkManager necesita para dar IPs en modo compartido.
3. Y la buena: la red `Tele` aparecía, pero el móvil decía **"contraseña incorrecta"**. Con `iw event` se veía que el móvil **sí se asociaba** (`new station`… `del station`), pero el `wpa_supplicant` que NetworkManager usa en modo AP **nunca empezaba el 4-way handshake** de WPA2 con este Broadcom. Con una **red abierta** sí funcionaba, lo que dejaba el problema aislado en el WPA2 del AP de NetworkManager.

La solución fue sacar a NetworkManager del punto de acceso y montarlo a la antigua, con **hostapd + dnsmasq** en servicios propios (`tele-ap` y `tele-dhcp`). Así el **4-way handshake se completa**: lo comprobé con un iPhone. NetworkManager sigue llevando la WiFi de casa.

Por qué falla exactamente NetworkManager + `brcmfmac` + este firmware no lo sé. Puede tener que ver con el firmware viejo (además, sin `clm_blob`), pero es una sospecha, no algo comprobado.

## Las trampas de una caja que solo tiene WiFi

- **Si cambias la red por SSH, te quedas fuera.** No hay Ethernet, así que tocar el WiFi corta tu propia sesión. Antes de cada cambio programé una **vuelta atrás automática** con `systemd-run --on-active=10m`: si no la cancelo, la red vuelve sola a como estaba.
- **Arrancar sin la WiFi de casa.** Un servicio `tele-auto` espera 40 segundos; si no encuentra la red de casa, levanta `Tele`. Y tvcast se reinicia cada vez que `Tele` sube o baja, para que el QR lleve la IP correcta.
- **Atajos de teclado como salida de emergencia**, con un teclado USB enchufado a la caja (los de Q, S, V y T van con `triggerhappy`):

| Atajo | Qué hace |
|---|---|
| Ctrl+Alt+C | Abre una consola |
| Ctrl+Alt+T | Muestra el QR |
| Ctrl+Alt+Q | Deja el QR fijo en pantalla |
| Ctrl+Alt+S | Pase de diapositivas |
| Ctrl+Alt+V | Vacía las fotos |

- **mpv no suelta la pantalla.** Mientras mpv tiene el *DRM master*, Ctrl+Alt+F2 no te lleva a ninguna consola. Por eso existe el atajo Ctrl+Alt+C. Ya en consola hay comandos cortos para lo habitual: `ayuda`, `casa`, `tele`, `logwifi`, `qr`, `vaciar`…

## UX: dónde poner el QR

Primera versión: el QR salía mientras no hubiera fotos. En cuanto subías unas cuantas, **desaparecía**, y quien llegara después no tenía forma de conectarse. Ahora, durante el pase de fotos hay un **QR pequeño en una esquina con un PIN de 6 cifras**, y **cada 12 fotos aparece el QR completo**.

## Lo que no salió tan bien

- **Di por hecho que el AP de NetworkManager valdría con `brcmfmac`.** Tres intentos hasta aceptar que no y pasar a hostapd.
- **La primera prueba de reinicio pareció fallar.** En realidad `Tele` tardaba unos 65 segundos en aparecer y no esperé lo suficiente. En la segunda prueba funcionó.

## La tele enseñaba la consola al arrancar

En cada arranque en frío, la tele enseñaba la consola unos segundos antes de las fotos. No era la red: tvcast esperaba solo 5 s a que mpv creara su socket IPC y, con la CPU a tope al arrancar, mpv tarda unos 8 s en abrir DRM. tvcast lo daba por muerto, lo mataba (y salía la consola) y lo relanzaba 2 s después. El journal lo delata con `mpv: no IPC socket` nada más arrancar. Ahora espera hasta 30 s mientras el proceso de mpv siga vivo.

Para esconder el resto descarté Plymouth: va en el initramfs y, al salir, deja un hueco (negro o el login) hasta que mpv pinta. En su lugar, `console=serial` en `armbianEnv.txt`, `vt.global_cursor_default=0 logo.nologo` y una imagen pintada directamente en `/dev/fb0` en cuanto arranca systemd. Lo que hace u-boot en los primeros segundos no se puede esconder sin recompilarlo.

La primera versión era una imagen cruda fija de 2560×1440 en BGRX, justo el modo preferido de mi tele (el framebuffer de la consola no va a la resolución de mpv, sino al modo que elija la pantalla). En cuanto enchufé la caja a **otro monitor** (un portátil Arzopa, con un framebuffer de 1920×1080) la imagen no cabía: `cat` fallaba con `ENOSPC` y la pantalla de arranque salía rota. Ahora un pequeño `tvcast-splash` lee por `ioctl` la resolución, los bits por píxel, el orden de los colores y el *stride* del framebuffer, y pinta la imagen adaptada en cada arranque. La lección: nunca supongas que el framebuffer será el de tu tele.

## El mando de Sunday

El mando oficial **no es infrarrojo**: la placa tiene receptor IR, pero al pulsar no llega nada. Es **Bluetooth LE**, anuncia siempre el nombre `Sunday` y el fabricante es 4MOD. Se empareja con `bluetoothctl` sin PIN ni combinación de teclas.

Lo curioso es que Linux no crea ningún `/dev/input`: el mando imita un teclado HID bajo otro UUID (`0xFF00`). Desde el Mac conectaba, leía batería y firmware, pero **no llegaba ninguna tecla**. Mi explicación, que comprobé en Linux: solo manda teclas con un enlace emparejado y cifrado, y macOS no deja forzar el emparejamiento desde un script. Con BlueZ sí; `btmon` enseña el cifrado AES-CCM y empiezan a llegar las pulsaciones.

Para tvcast hice un servicio aparte, `tvcast-remote`, en Go y hablando con BlueZ por D-Bus (bleak necesita ver al mando anunciándose para conectar, y eso estorba al reconectar). Llama a la API HTTP de tvcast en loopback, sin uinput, y se reconecta solo en unos 2 s. El botón de apagado lo dejé sin mapear a propósito: una pulsación accidental dejaría a la familia con un login en la tele.

Primero lo validé **en la torre**, con un adaptador USB. Después probé ese mismo adaptador, de forma provisional, **en la caja**: en el puerto OTG (dwc2, *full-speed*) el escaneo BLE fallaba con timeouts y error `-71`, y en el USB azul (xHCI) funcionó. Allí descubrí un detalle que me costó un buen rato: BlueZ necesita un *agente* de `bluetoothctl` en la misma sesión que hace el emparejamiento; sin él, el `pair` termina en `Authentication Failed 0x05`. Con el agente, el mando funcionó en la caja. Devolví el adaptador a la torre y repetí la prueba con el chip Bluetooth interno de la caja, que también funcionó.

## Cuando el Bluetooth interno cuelga la caja (en curso)

La caja se colgó dos veces con el Bluetooth del chip interno activo (WiFi y Bluetooth comparten el BCM4334): una copiando 192 MB por WiFi y otra con el mando conectado. El journal se cortaba de golpe. Por eso `bluetooth.service` está deshabilitado al arrancar, `journald` sincroniza cada 2 s y `kernel.panic=10` reinicia la caja si el kernel falla. Una tercera prueba aguantó 2,5 min conectado sin colgarse, pero tampoco llegó ninguna tecla.

La idea es usar el Bluetooth interno de todos modos, con un watchdog de hardware que reinicia la caja y un guardián que apaga el Bluetooth si se cuelga dos veces. Ya está desplegado en la caja.

Lo que he visto desde entonces es más raro que un cuelgue limpio: con el chip interno y una subida de fotos en marcha, la caja **pierde la red pero el sistema sigue vivo**. Por eso añadí también un watchdog de red. Y aquí viene el matiz importante: la antena WiFi de la caja es un cable provisional (la pegatina se despegó), la señal es de unos −69 dBm y hay cortes **incluso sin Bluetooth**. Hasta que no suelde la antena, no puedo decir si el culpable es el Bluetooth o la antena. Dejo la conclusión abierta.

## Un panel de administración oculto

Los atajos sueltos de la tabla de arriba empezaban a ser demasiados, así que los sustituye un **panel de administración oculto**. Se abre con Ctrl+Alt+A o con una combinación en el mando (Corazón, Arriba, Corazón, Abajo). Enseña el estado de la caja, el QR, la red y los logs, y deja borrar fotos, volver a emparejar el mando, cambiar el idioma, reiniciar o abrir la consola. Cada acción destructiva pide confirmación (No/Sí), y las que necesitan root van por systemd y polkit, sin `sudo`.

## Lo que queda a medias

- **Soldar la antena WiFi** de la caja y repetir las pruebas con el Bluetooth interno, para saber de verdad quién cuelga la red (arriba).
- **Quitar los permisos de `sudo` temporales** que dejé para trabajar (el panel ya no los necesita) y publicar tvcast en un repositorio de GitHub (privado de momento).

El repositorio de tvcast es privado de momento; cuando lo abra, lo enlazaré aquí.

## Lo que me llevo

- **Si algo no manda datos en macOS, prueba en Linux** antes de dar el hardware por malo: el mando no mandaba teclas hasta que el enlace estuvo cifrado.
- **Sin pila de reloj, no te fíes de la hora de los logs.** Para ordenar un arranque, `journalctl -o short-monotonic`.
- **Cuando cambies la red de una caja que solo tiene WiFi, programa antes la vuelta atrás.**
- **No supongas el framebuffer de tu tele.** Lee la resolución, el orden de colores y el *stride* al arrancar.
- **Descarta lo físico antes de culpar al software.** Con una antena provisional y −69 dBm, no puedo saber aún si el culpable es el Bluetooth.
