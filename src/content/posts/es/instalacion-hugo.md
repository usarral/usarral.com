---
title: "Instalación de Hugo CMS y creación de sitio básico con plantilla"
publishedAt: 2022-09-28
description: ""
topic: terminal
toc: true
lang: es
tags:
    - terminal
    - servidor
isPublish: true
---
## Instalación Hugo

En este tutorial vamos a instalar Hugo, un CMS que poco a poco esta adquiriendo popularidad debido a su velocidad y fluidez a la hora de escribir artículos.

Vamos a instalarlo en su version *extended*, ya que este incluye el paquete base de Hugo y algunas funcionalidades extras que algunos temas nos pueden requerir.

### Instalación Hugo en Linux

#### Comprobar si tenemos instalado Snap

Para instalar Hugo en Linux vamos a utilizar el gestor de paquetes Snap. Por ello lo primero que vamos a hacer es comprobar si tenemos este gestor instalado, para ello utilizaremos el siguiente comando:

```sh
snap version

```

Este nos debería dar una respuesta como la siguiente:

```sh
snap    2.55.3+22.04
snapd   2.55.3+22.04
series  16
ubuntu  22.04
kernel  5.15.0-48-generic

```

En ese caso significará que tenemos snap instalado. Entonces podemos empezar con la instalación.

#### Instalar el paquete hugo-extended

Utilizando el gestor Snap vamos a instalar el paquete *hugo-extended*.

```sh
snap install hugo --channel=extended

```

### Instalación Hugo en Windows

Para instalar la ultima versión de Hugo en Windows lo primero que deberemos hacer es ir al siguiente [link](https://github.com/gohugoio/hugo/releases).

Una vez aquí descargaremos la ultima versión que tenga un nombre del formato *hugo_extended_x.x.x_windows-amd64.zip* donde x.x.x corresponderá a la versión.

Este zip contendrá el CMS, pero la instalación tendremos que realizarla manualmente.

Extraeremos el zip y para mayor facilidad moveremos el archivo Hugo.exe resultante a la ruta  *C:\Hugo\bin* la cual crearemos.

Una vez lo tengamos, en el buscador de Windows, accederemos a *Editar las variables de entorno del sistema* buscando esto en el.

Se nos abrirá una ventana llamada Propiedades del sistema y en esta volveremos a pulsar en *Variables de entorno*.

En la lista que nos mostrará buscaremos la variable PATH, y al final de esta añadiremos 'C:\Hugo\bin'.

Con esto reiniciando el sistema tendremos hugo instalado y accesible en nuestro sistema.

### Instalación Hugo en MacOS

Si no lo tenemos ya instalado, instalaremos el gestor de paquetes brew con el siguiente comando

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Una vez instalado, usaremos este comando para instalar Hugo.

````sh
brew install hugo

````

## Creación del sitio con Hugo

### Creando el sitio

Siguiendo el tutorial anterior ya deberíamos tener instalado Hugo en nuestro sistema.

Ahora para crear un sitio con el CMS utilizaremos los comando:

```sh
# AVISO ESTOS COMANDOS DEBEN REALIZARSE DESDE NUESTRO USUARIO HABITUAL, NUNCA DESDE SUDO
hugo new site nombredelsitio
cd nombredelsitio
```

Nuestro sitio ya esta creado, pero de momento no es funcional. Para que este pueda funcionar primero deberemos encontrar un tema que usar.

### Instalando un tema en el sitio

 Como ejemplo voy a usar el tema [PaperMod](https://github.com/adityatelange/hugo-PaperMod), pero hay muchos por internet que podemos usar. Para instalar el tema lo que haremos en este caso (cada tema puede tener su propio método de instalación, pero la mayoría son de esta manera)

```sh
echo "theme = 'hugo-PaperMod'" >> config.toml
cd themes
#Clonamos o descargamos en esta carpeta el tema que nos guste.
git clone https://github.com/adityatelange/hugo-PaperMod
# Entramos en la carpeta de nuestro tema
cd hugo-PaperMod
# Borramos de este tema la carpeta .git para que no nos cause problemas
#a la hora de subir nuestra pagina
rm -rf .git

 
```

Con esto ya tendremos el tema instalado y podremos arrancar nuestro sitio usando

```sh
hugo-server
```

Después de arrancarlo el comando nos devolverá una URL en la cual podremos ver nuestro sitio mientras este servidor este encendido.

### Creación de artículos en Hugo

Para crear artículos en Hugo deberemos dirigirnos a la carpeta content, y dentro en la carpeta post podremos empezar a escribir estos en formato *MarkDown* o *MD* para abreviar.

Mientras nosotros escribimos este se ira añadiendo al sitio y sera visible en nuestro servidor local.

### Subir a internet nuestro sitio y publicarlo gratis

Para subir nuestro sitio vamos a usar como hosting Github, una plataforma de código en el cual nos deja subir archivos estáticos.

Necesitaremos una cuenta de [Github](https://github.com) y el programa [GIT](https://git-scm.com/downloads).

Pasos para subir nuestra pagina a github usando el protocolo GIT.

```sh
# Estos comandos se ejecutan desde la raíz o carpeta base de nuestro sitio.
# Primero inicializaremos un repositorio.
git init
# Añadiremos nuestros archivos a la Staging Area
git add *
# =============
# AVISO: Estos comandos (git config) que están separados solo deberán
#ejecutarse la primera vez que configuremos git.
git config user.name "TU NOMBRE"
git config user.email "TU EMAIL"
#=======
# Añadiremos el "ASUNTO" de la subida.
git commit -m "primer commit"
#Iremos a nuestra cuenta de github y crearemos un repositorio.
# Configuraremos el repositorio remoto de destino, 
#esta url nos la proporcionará github cuando creemos el repositorio.
git remote add origin urldegithub
git branch -M main
# Por ultimo mandaremos los cambios al servidor.
git push -u origin main
```

Ya tenemos nuestro código subido en Github, ahora vamos a despegarlo.

### Despliegue en Vercel

Primero crearemos una cuenta en [Vercel](https://vercel.com), para ello podemos utilizar nuestra cuenta de Github.

Una vez dentro de nuestra cuenta de Vercel crearemos un nuevo proyecto.
En origen del proyecto le diremos que lo queremos importar de Github.

Este automáticamente detectará que estamos utilizando Hugo y nos configurará todo.

Hay veces que en el despliegue falla por la versión por defecto de Hugo, si nos da un error lo que debemos hacer es en la sección Environment Variables definimos una variable HUGO_VERSION con la versión que estamos utilizando en local. Para saber esta versión usamos en nuestra maquina el comando

```sh
hugo version
```

Y con esto pulsamos deploy en cuestión de unos segundos nuestra pagina se desplegará y nos dará una URL la cual sera nuestra dirección publica de la web.

Para actualizar el sitio simplemente actualizando los archivos en Github y en cuestión de unos minutos Vercel automáticamente detectará los cambios y nos desplegará los cambios.