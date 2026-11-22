---
title: "El mando BLE de la Sunday Box"
description: El mando de la Sunday Box no es infrarrojo ni un HID normal, es un teclado BLE disfrazado bajo otro UUID que solo habla con un enlace cifrado. Cuento por qué en macOS no llegaba ninguna tecla, el truco del agente de BlueZ y los cuelgues con el Bluetooth interno.
publishDate: 2026-11-22
draft: true
pinned: false
lang: es
tags:
  - bluetooth
  - hardware
  - linux
  - go
  - homelab
---

En el [post principal](/es/posts/sunday-box-armbian-es/) conté cómo convertí una Sunday Box en tvcast, un marco de fotos que crea su propia WiFi. Quedó una cosa fuera, porque me dio más problemas que todo lo demás junto: **el mando original**. Este post va solo de eso.

> **En curso.** El final de este post está abierto: el diagnóstico de los cuelgues con el Bluetooth interno depende de una antena WiFi provisional que todavía tengo que soldar. Lo actualizaré cuando haya resultado.

## Lo primero: no es infrarrojo

El mando oficial **no es infrarrojo**: la placa tiene receptor IR, pero al pulsar no llega nada. Es **Bluetooth LE**, anuncia siempre el nombre `Sunday` y el fabricante es 4MOD. Se empareja con `bluetoothctl` sin PIN ni combinación de teclas.

Lo curioso es que Linux no crea ningún `/dev/input`: el mando imita un teclado HID bajo otro UUID (`0xFF00`). Desde el Mac conectaba, leía batería y firmware, pero **no llegaba ninguna tecla**. Mi explicación, que comprobé en Linux: solo manda teclas con un enlace emparejado y cifrado, y macOS no deja forzar el emparejamiento desde un script. Con BlueZ sí; `btmon` enseña el cifrado AES-CCM y empiezan a llegar las pulsaciones.

Lo que sigue es cómo lo descifré, cómo lo uso desde tvcast y por qué la caja se cuelga a veces.

## Qué manda cada botón

Con `btmon` y un adaptador USB en la torre, cada pulsación manda los bytes del botón y cada suelta manda ceros. Los códigos del teclado son usos HID estándar (0x4f–0x52 flechas, 0x28 Intro); los de consumo son un byte con numeración propia del mando, no una máscara de bits. No hay autorrepetición al mantener pulsado, y mantener el micrófono da lo mismo que una pulsación corta.

| Botón | Dónde llega | Bytes |
|---|---|---|
| Arriba | teclado (`2a4d`, 8 bytes) | `00 00 52 00 00 00 00 00` |
| Abajo | teclado | `00 00 51 00 00 00 00 00` |
| Izquierda | teclado | `00 00 50 00 00 00 00 00` |
| Derecha | teclado | `00 00 4f 00 00 00 00 00` |
| OK | teclado | `00 00 28 00 00 00 00 00` |
| Atrás, Inicio, Play/Pausa, Corazón, Encendido, Vol+, Vol− | consumer (`2a4d`, 1 byte) | `0b`, `05`, `02`, `3c`, `04`, `09`, `0a` |
| Micrófono | `f000b001` + `f000b002` | `04` al pulsar, unas 170 notificaciones de 20 bytes de audio, `00` al soltar |

La luz del mando no responde a escrituras (`fed1`–`fed3` se aceptan y se ignoran): la lleva el firmware con el micrófono.

## Por qué un servicio aparte, en Go

- **Go, no Python.** El repo es Go y la caja recibe binarios estáticos; Python con bleak significaría pip y un venv en una caja sin internet, y bleak necesita ver al mando anunciándose para conectar, algo que estorba al reconectar. La única dependencia nueva es `godbus`, sin cgo.
- **Habla con la API HTTP de tvcast en `127.0.0.1`, sin uinput.** uinput pediría root o una regla de udev, y luego asignaciones de teclas en algún sitio para volver a convertir teclas en acciones.
- **Servicio propio, no dentro de tvcast.** El Bluetooth es la parte arriesgada: `systemctl disable --now tvcast-remote` deja las fotos intactas, y reiniciar tvcast no corta el enlace.
- **Sin dirección en la configuración.** Elige el dispositivo emparejado llamado `Sunday` (o `4MOD 45 BLE`), en cualquier adaptador.
- **Reconexión: reintenta cada 2 s para siempre.** BlueZ solo reconecta solo los dispositivos LE de perfiles que lo piden (HID), y este no.
- **Sin consola ni reinicios desde el mando.** El botón de encendido no hace nada, y el resto de acciones delicadas van por un panel oculto con confirmación.

## Dongle por OTG frente a xHCI

Para probar en la caja usé, de forma provisional, un adaptador USB CSR. En el puerto OTG (dwc2, *full-speed*) el escaneo BLE falló con timeouts (`0x2005` y `0x200b`) y error `-71`; en el USB azul (xHCI) funcionó. Allí descubrí lo del agente de `bluetoothctl`, y con él el mando funcionó en la caja. Después devolví el adaptador a la torre y probé con el chip interno de la caja, que también funcionó, pero ahí empiezan los problemas.

## Cuando el Bluetooth interno cuelga la caja (en curso)

La caja se colgó dos veces con el Bluetooth del chip interno activo (WiFi y Bluetooth comparten el BCM4334): una copiando 192 MB por WiFi y otra con el mando conectado. El journal se cortaba de golpe. Por eso `bluetooth.service` está deshabilitado al arrancar, `journald` sincroniza cada 2 s y `kernel.panic=10` reinicia la caja si el kernel falla. Una tercera prueba aguantó 2,5 min conectado sin colgarse, pero tampoco llegó ninguna tecla.

La idea es usar el Bluetooth interno de todos modos, con un watchdog de hardware que reinicia la caja y un guardián que apaga el Bluetooth si se cuelga dos veces. Ya está desplegado en la caja.

Lo que he visto desde entonces es más raro que un cuelgue limpio: con el chip interno y una subida de fotos en marcha, la caja **pierde la red pero el sistema sigue vivo**. Por eso añadí también un watchdog de red. Y aquí viene el matiz importante: la antena WiFi de la caja es un cable provisional (la pegatina se despegó), la señal es de unos −69 dBm y hay cortes **incluso sin Bluetooth**. Hasta que no suelde la antena, no puedo decir si el culpable es el Bluetooth o la antena. Dejo la conclusión abierta.

## Lo que me llevo

- **Si algo no manda datos en macOS, prueba en Linux** antes de dar el hardware por malo.
- **Un HID disfrazado bajo otro UUID** no aparece en `/dev/input`: hay que suscribirse por GATT desde espacio de usuario.
- **Tras un cuelgue, no culpes al primer sospechoso.** Con una antena provisional y −69 dBm, aún no sé si el culpable es el Bluetooth.
