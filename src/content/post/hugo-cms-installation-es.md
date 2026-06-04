---
title: Instalación de Hugo CMS y Creación de un Sitio Básico
description: Aprende cómo instalar Hugo CMS en Linux, Windows y macOS, y crea un sitio básico usando un tema. Despliega el sitio de forma gratuita usando GitHub y Vercel.
publishDate: 2022-09-28
lang: es
tags:
  - hugo
  - cms
  - tutorial
  - web development
---

## Instalando Hugo en Linux

### Comprobar si Snap está instalado

Para instalar Hugo en Linux, utilizaremos el gestor de paquetes Snap. Por lo tanto, lo primero que haremos será comprobar si este gestor está instalado utilizando el siguiente comando:

```sh
snap version
```

Esto debería devolver una respuesta como la siguiente:

```sh
snap    2.55.3+22.04
snapd   2.55.3+22.04
series  16
ubuntu  22.04
kernel  5.15.0-48-generic
```

Si es así, significa que Snap está instalado y podemos proceder con la instalación.

### Instalar el paquete hugo-extended

Utilizando el gestor Snap, instalaremos el paquete _hugo-extended_.

```sh
snap install hugo --channel=extended
```

## Instalando Hugo en Windows

Para instalar la última versión de Hugo en Windows, el primer paso es ir al siguiente [enlace](https://github.com/gohugoio/hugo/releases).

Una vez allí, descarga la última versión con un formato de nombre de archivo _hugo_extended_x.x.x_windows-amd64.zip_, donde x.x.x corresponde a la versión.

Este zip contendrá el CMS, pero tendremos que realizar la instalación manualmente.

Extrae el zip y, por comodidad, mueve el archivo Hugo.exe resultante al directorio _C:\Hugo\bin_, que crearemos.

Una vez lo tengamos, en la barra de búsqueda de Windows, accede a _Editar las variables de entorno del sistema_ buscándolo.

Se abrirá una ventana llamada Propiedades del sistema, y en ella haremos clic en _Variables de entorno_.

En la lista que aparece, buscaremos la variable PATH y añadiremos 'C:\Hugo\bin' al final.

Con esto, tras reiniciar el sistema, tendremos Hugo instalado y accesible en nuestro sistema.

## Instalando Hugo en macOS

Si no lo tenemos ya instalado, instalaremos el gestor de paquetes brew con el siguiente comando:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Una vez instalado, utilizaremos este comando para instalar Hugo:

```sh
brew install hugo
```

## Creando el Sitio con Hugo

### Creando el Sitio

Siguiendo el tutorial anterior, ya deberíamos tener Hugo instalado en nuestro sistema.

Ahora, para crear un sitio con el CMS, utilizaremos los siguientes comandos:

```sh
# ADVERTENCIA: ESTOS COMANDOS DEBEN EJECUTARSE DESDE NUESTRO USUARIO NORMAL, NUNCA DESDE SUDO
hugo new site nombre_del_sitio
cd nombre_del_sitio
```

Nuestro sitio está creado, pero aún no es funcional. Para que lo sea, primero necesitamos encontrar un tema para usar.

### Instalando un Tema en el Sitio

Como ejemplo, utilizaré el tema [PaperMod](https://github.com/adityatelange/hugo-PaperMod), pero hay muchos disponibles en línea que podemos usar. Para instalar el tema, haremos lo siguiente (cada tema puede tener su propio método de instalación, pero la mayoría son así):

```sh
echo "theme = 'hugo-PaperMod'" >> config.toml
cd themes
# Clona o descarga el tema que te guste en esta carpeta.
git clone https://github.com/adityatelange/hugo-PaperMod
# Entra en la carpeta del tema
cd hugo-PaperMod
# Elimina la carpeta .git de este tema para evitar problemas
# al subir nuestra página
rm -rf .git
```

Con esto, tendremos el tema instalado y podemos iniciar nuestro sitio usando:

```sh
hugo server
```

Después de iniciarlo, el comando devolverá una URL donde podemos ver nuestro sitio mientras este servidor esté en ejecución.

### Creando Artículos en Hugo

Para crear artículos en Hugo, iremos a la carpeta content y, dentro de ella, en la carpeta post, podemos empezar a escribirlos en _Markdown_ o _MD_ para abreviar.

A medida que escribamos, los artículos se añadirán al sitio y serán visibles en nuestro servidor local.

### Subiendo nuestro Sitio a Internet y Publicándolo Gratis

Para subir nuestro sitio, utilizaremos GitHub como hosting, una plataforma de código que nos permite subir archivos estáticos.

Necesitaremos una cuenta de [GitHub](https://github.com) y el programa [GIT](https://git-scm.com/downloads).

Pasos para subir nuestra página a GitHub usando el protocolo GIT:

```sh
# Estos comandos se ejecutan desde la carpeta raíz o base de nuestro sitio.
# Primero, inicializaremos un repositorio.
git init
# Añadiremos nuestros archivos al Staging Area
git add *
# =============
# ADVERTENCIA: Estos comandos separados (git config) solo deben ejecutarse la primera vez que configuramos git.
git config user.name "TU NOMBRE"
git config user.email "TU EMAIL"
#=======
# Añadiremos el "ASUNTO" de la subida.
git commit -m "primer commit"
# Iremos a nuestra cuenta de GitHub y crearemos un repositorio.
# Configuraremos el destino del repositorio remoto,
# esta URL nos la proporcionará GitHub cuando creemos el repositorio.
git remote add origin url_de_github
git branch -M main
# Finalmente, subiremos los cambios al servidor.
git push -u origin main
```

Ahora nuestro código está subido a GitHub y estamos listos para desplegarlo.

### Desplegando en Vercel

Primero, crearemos una cuenta en [Vercel](https://vercel.com). Podemos usar nuestra cuenta de GitHub para esto.

Una vez dentro de nuestra cuenta de Vercel, crearemos un nuevo proyecto.
Para el origen del proyecto, especificaremos que queremos importarlo desde GitHub.

Esto detectará automáticamente que estamos usando Hugo y configurará todo por nosotros.

A veces, el despliegue falla debido a la versión predeterminada de Hugo; si encontramos un error, necesitamos definir una Variable de Entorno llamada HUGO_VERSION con la versión que estamos usando localmente. Para saber esta versión, podemos usar el comando:

```sh
hugo version
```

Con esto, hacemos clic en desplegar y, en cuestión de segundos, nuestra página estará desplegada y nos proporcionará una URL que será nuestra dirección web pública.

Para actualizar el sitio, simplemente actualiza los archivos en GitHub y, en cuestión de minutos, Vercel detectará automáticamente los cambios y desplegará las actualizaciones.
