---
title: Generador de Carteles para el Club GDM La Merced
description: Aprende cómo construir un generador automático de carteles para eventos deportivos utilizando PHP, IMAP, NodeJS y JavaScript. Descubre cómo leer correos electrónicos, extraer datos de partidos y generar carteles listos para imprimir de manera eficiente sin necesidad de instalar software adicional. Perfecto para clubes y equipos que buscan automatizar tareas repetitivas como la creación de carteles semanales de partidos.
publishDate: 2022-11-25
lang: es
tags:
  - php
  - automation
  - web development
  - imap
  - project
  - español
---

## Introducción

Durante estos últimos días, he estado trabajando en un generador de carteles para el club GDM La Merced.

El generador de carteles es una aplicación web que accede a una bandeja de entrada de correo electrónico donde se envían los horarios de los partidos y sus respectivos datos. Estos datos son procesados y se genera un cartel con los detalles del partido.

Esta aplicación web nació de la necesidad de crear semanalmente carteles para los partidos, incluyendo sus horarios, una tarea tediosa y repetitiva.

Este proceso solía ser realizado por un miembro del club, quien se encargaba de revisar los correos electrónicos con los horarios de los partidos, cargar la plantilla del cartel en un software de edición de imágenes y rellenar los datos del partido en la plantilla.

Hace unos meses, creé un programa en NodeJS que lee datos de un archivo JSON y genera un cartel con los detalles del partido. Esto solucionó la parte de generar el cartel, pero no la de obtener los datos del partido, y el programa aún tenía que ejecutarse manualmente.

Por eso, durante estas semanas, a medida que he estado aprendiendo PHP en clase, vi la posibilidad de usar variables PHP para imprimir los datos del partido en la plantilla del cartel y así generar automáticamente el cartel.

Además, descubrí a través de la investigación que PHP puede leer correos electrónicos utilizando el protocolo IMAP. Entonces, se me ocurrió que si podía leer los correos, podría extraer los datos del partido y pasarlos a la plantilla del cartel.

## Objetivos

- Generar automáticamente los carteles de los partidos.
- Evitar tener que instalar programas en el dispositivo.
- Poder ejecutar el programa desde cualquier dispositivo.

## Proceso de Uso

El proceso es el siguiente:

1. La bandeja de entrada designada recibe un correo electrónico con los detalles del partido, como se muestra en la imagen de abajo:
   ![Email](https://ik.imagekit.io/usarral/posts/generador-carteles/email.png?updatedAt=1706967701996)
2. El correo electrónico es leído y procesado por la aplicación web, que extrae los datos del partido.
3. Una vez que se leen todos los correos, se muestra una lista de los partidos de esa semana para incluir en el cartel:
   ![Lista](https://ik.imagekit.io/usarral/posts/generador-carteles/procesados.png?updatedAt=1706967704667)
4. Al hacer clic en el botón "Imprimir Cartel", se genera el cartel con los detalles del partido seleccionado y se muestra una vista previa de impresión para imprimir en PDF o directamente en papel:
   ![Vista Previa de Impresión](https://ik.imagekit.io/usarral/posts/generador-carteles/vista_impresion.png?updatedAt=1706967706517)

## Tecnologías

Se utilizaron las siguientes tecnologías en el desarrollo de esta aplicación:

- PHP
- HTML
- CSS
- JavaScript

### Backend

El backend fue desarrollado usando PHP. Se utilizó la librería PHP IMAP para leer los correos electrónicos, lo que permite a la aplicación recuperar mensajes de un servidor IMAP. Una vez que se leen los correos, los datos del partido se procesan y se almacenan en memoria. Una vez guardados, los datos se muestran en la interfaz de la lista.

### Frontend

El frontend fue desarrollado usando HTML, CSS y JavaScript. La interfaz de usuario se basa en una plantilla de cartel existente de Photoshop, aunque se planea un rediseño pronto. Se utilizó JavaScript para activar la vista previa de impresión sin requerir que el usuario haga clic en el botón de imprimir del navegador.

## Conclusiones

Desarrollar esta aplicación ha sido muy interesante, ya que aprendí a usar la librería PHP IMAP para leer correos de un servidor IMAP.
Además, me ayudó a aprender cómo migrar un proyecto originalmente desarrollado en NodeJS a PHP, ya que el proveedor de hosting donde se aloja la aplicación no admite NodeJS. Este método también es mucho más sencillo para un usuario que no tiene conocimientos de programación.
