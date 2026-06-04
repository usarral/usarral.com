---
title: Instalación de Docker
description: Este artículo proporciona una guía completa para instalar Docker en varias plataformas, incluyendo Linux y Windows. Cubre los comandos necesarios para configurar Docker, gestionar permisos y administrar contenedores e imágenes. Perfecto para principiantes y aquellos que buscan mejorar sus habilidades de containerización.
publishDate: 2022-10-07
lang: es
tags:
  - docker
  - server
  - tutorial
  - devops
---

## Instalando Docker

### Distribuciones Linux con Gestor de Paquetes APT

Para instalar Docker en distribuciones de Linux como Ubuntu o Debian que utilizan el gestor de paquetes APT, puedes hacerlo con los siguientes comandos:

```sh
# Eliminar versiones anteriores:
sudo apt-get remove docker docker-engine docker.io containerd runc

# Añadir paquetes para instalar y agregar el repositorio de Docker
sudo apt-get install ca-certificates curl gnupg-agent lsb-release

# Añadir la clave GPG para el repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Añadir el repositorio a nuestro archivo sources.list, que es donde APT consulta los repositorios para descargar programas
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar repositorios para detectar el repositorio de Docker
sudo apt update

# Instalar Docker y sus dependencias
sudo apt install docker-ce docker-ce-cli containerd.io
```

Configuración para usar Docker sin sudo:

```sh
# Añadir el usuario al grupo Docker
sudo usermod -a -G docker $USER
# Para usarlo sin necesidad de reiniciar, ejecuta el siguiente comando para "iniciar sesión" en el grupo en la sesión actual
newgrp docker
# Otorgar permisos al socket del demonio de Docker
sudo chmod 666 /var/run/docker.sock

# Docker debería funcionar ahora; si aún no lo hace, necesitamos reiniciar el sistema
reboot now
```

### Windows

Para instalar Docker en Windows:

1. Ve al [sitio web de Docker](https://docker.com).
2. Haz clic en el botón de descarga para Windows.
3. Una vez descargado, sigue el instalador.
4. Antes de ejecutar Docker, también necesitarás instalar el WSL2 Kernel, que puedes descargar [aquí](https://aka.ms/wsl2kernel).
5. Instala este paquete, que habilitará la virtualización de Docker.

## Comandos Básicos de Docker

```sh
# Crear un contenedor Docker:
docker run -ti --name web ubuntu:latest

# Crear un contenedor con un puerto abierto:
# El formato es PuertoLocal:PuertoContenedor
# Al conectarnos a localhost:8000 desde nuestro navegador, nos conectaríamos
# al puerto 80 del contenedor
docker run --name web2 -ti -p 8000:80 web:v1

# Crear un contenedor con una carpeta compartida
# El formato es CarpetaLocal:CarpetaEnContenedor
docker run -ti --name web -ti -p 8000:80 -v C:\\Docker\\web:/var/www/html web:v1

# Crear una imagen a partir de un contenedor:
# Si estamos dentro del contenedor, salimos
# docker commit -m "Commit" nombrecontenedor repositorio:tag
docker commit -m "Imagen con Apache" web web:v1

# Ver imágenes en Docker:
docker images

# Ver contenedores
docker ps -a

# Eliminar un contenedor
docker rm web

# Conectarse a un contenedor que ya está en ejecución
docker exec -ti web bash
```

## Conclusión

Docker es una herramienta esencial para los flujos de trabajo modernos de desarrollo y despliegue. Con estos pasos de instalación y comandos básicos, estás listo para comenzar a containerizar tus aplicaciones y disfrutar de los beneficios de entornos de desarrollo consistentes y aislados.
