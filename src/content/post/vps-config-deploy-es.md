---
title: "🛠️ Asegura y Despliega tu VPS usando Docker"
description: Este artículo proporciona una guía actualizada sobre cómo configurar mi VPS usando Docker, incluyendo los pasos y requisitos necesarios para asegurar y desplegar tu VPS de manera eficiente.
publishDate: 2025-01-14
tags:
  - devops
  - vps
  - docker
  - traefik
  - security
  - tutorial
  - español
pinned: true
lang: es
---

En esta guía, exploraremos paso a paso cómo configurar un servidor Ubuntu desde cero, garantizando su seguridad y preparando un entorno eficiente para despliegues automatizados utilizando Docker, Traefik y GitHub Actions.

## 1. Instalación de Ubuntu Server

En esta guía, asumiremos que tienes un VPS con Ubuntu Server 22.04 LTS instalado. Si no tienes uno, puedes seguir la guía de instalación de la [documentación de Ubuntu](https://documentation.ubuntu.com/server/tutorial/basic-installation/index.html).

## 2. Asegurando el Usuario

### Creando un Usuario No-Root

Después de la instalación, accede al servidor y crea un nuevo usuario para evitar el uso directo de root:

```sh
adduser vpsmanager
```

Evita usar nombres estándar como "admin" o "user" para prevenir ataques de fuerza bruta. Usa un nombre único que no sea fácilmente adivinable.
En esta guía, usaremos "vpsmanager" como nombre de usuario para el ejemplo.

### Asignando Contraseña y Permisos Sudo

Establece una contraseña fuerte para el nuevo usuario y concédele privilegios de sudo:

```sh
usermod -aG sudo vpsmanager
```

Si el servidor indica que el grupo sudo no existe, prueba con el grupo wheel:

```sh
usermod -aG wheel vpsmanager
```

### Verificando el Acceso Sudo

Cambia al nuevo usuario y verifica que puedes ejecutar comandos con privilegios de superusuario:

```sh
su - vpsmanager
sudo ls /
```

### Configurando la Clave SSH

#### En Windows

Usa ssh-keygen en PowerShell para generar una clave SSH:

```powershell
ssh-keygen
```

Luego, copia la clave pública al servidor manualmente:

Ver la clave pública:

```powershell
type $env:USERPROFILE\.ssh\*.pub
```

Conéctate al servidor y edita el archivo authorized_keys:

```powershell
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

Pega la clave pública y guarda los cambios.

#### En macOS/Linux

Ejecuta el siguiente comando en la terminal:

```sh
ssh-keygen
```

Esto generará un par de claves pública/privada en el directorio `~/.ssh`.
Luego, copia la clave pública al servidor:

```sh
ssh-copy-id vpsmanager@ip_del_servidor
```

## 3. Seguridad del Servidor

### Configuración Segura de SSH

Edita el archivo de configuración de SSH:

```sh
sudo nano /etc/ssh/sshd_config
```

Realiza los siguientes cambios:

- Desactivar la autenticación por contraseña:

```sh
PasswordAuthentication no
```

- Prohibir el inicio de sesión directo de root:

```sh
PermitRootLogin no
```

- Desactivar PAM si solo se usará la autenticación por clave SSH (simplifica la cadena de autenticación):

```sh
UsePAM no
```

Reinicia el servicio SSH y verifica en una nueva terminal que puedes acceder con las configuraciones actuales antes de cerrar la sesión:

```sh
sudo systemctl restart ssh
```

### Configuración de UFW (Uncomplicated Firewall)

Establece las reglas del firewall:

```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

Asegúrate de que aún puedes acceder al servidor a través de SSH después de activar el firewall. Si solo estás desplegando una aplicación web, los puertos 80 (HTTP) y 443 (HTTPS) suelen ser los únicos necesarios para abrir desde el exterior. Revisa estas reglas si planeas alojar otros servicios.

## 4. Instalación de Docker

### Instalar Docker usando el script oficial

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Añadir tu usuario al grupo docker para evitar usar sudo al ejecutar comandos de Docker:

```sh
sudo usermod -aG docker vpsmanager
```

Cierra la sesión y vuelve a entrar para aplicar los cambios de grupo.

## 5. Configuración de Despliegue Automático

### Creando Redes Frontend y Backend

Define las redes necesarias para tus contenedores. El uso de redes separadas proporciona aislamiento y gestiona la comunicación interna:

```sh
docker network create frontend
docker network create backend
```

### Configurando Traefik

Usaremos Traefik como proxy inverso, que se encargará de enrutar todas las solicitudes a su contenedor correspondiente.

#### compose.yml

```yaml
---
services:
  traefik-prod-01:
    image: docker.io/library/traefik:v3.3.3
    container_name: traefik
    ports:
      - 80:80
      - 443:443
    volumes:
      - /run/docker.sock:/run/docker.sock:ro
      - ./config/:/etc/traefik/:ro
      - ./certs/:/var/traefik/certs/:rw
    environment:
      - CF_DNS_API_TOKEN # Token de la API de Cloudflare con permisos de modificación de zonas DNS
    networks:
      - frontend
    restart: unless-stopped

networks:
  frontend:
    external: true
```

En este archivo compose, usamos una versión fija de la imagen de Traefik ya que para servicios de terceros, prefiero actualizarlos manualmente.
Mapeamos los puertos estándar de los protocolos HTTP y HTTPS.
Montamos docker.sock para conectar con los contenedores, config para la propia configuración de Traefik, y certs para almacenar los certificados SSL.

Pasamos nuestro token de Cloudflare para la generación de certificados SSL. Este token debe tener permisos para modificar zonas DNS, lo cual creará temporalmente registros para la verificación.

Montamos la red frontend ya que solo queremos exponer servicios en esta red.

Finalmente, lo configuramos para que se reinicie automáticamente a menos que lo detengamos explícitamente.

#### config/traefik.yml

```yml
---
global:
  checkNewVersion: false
  sendAnonymousUsage: false

log:
  level: INFO

entryPoints:
  web:
    address: :80
  websecure:
    address: :443

certificatesResolvers:
  cloudflare:
    acme:
      email: EMAIL@TUDOMINIO.com
      storage: /var/traefik/certs/cloudflare-acme.json
      caServer: "https://acme-v02.api.letsencrypt.org/directory"
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"

providers:
  docker:
    exposedByDefault: false
    network: frontend
  file:
    directory: /etc/traefik
    watch: true
```

Con esta configuración, establecemos los servicios principales de Traefik como el nivel de log, los puertos de escucha y los certificatesResolvers que usaremos para los certificados SSL.
Finalmente, también configuramos los proveedores (providers).

#### .env

```env
CF_DNS_API_TOKEN=""
```

Este archivo debe estar al mismo nivel que el compose.yml y define el token de Cloudflare que usaremos. **Recuerda no subir este archivo a repositorios públicos. También podrías considerar el uso de Docker secrets o un sistema de gestión de secretos dedicado para una mejor seguridad.**

### Configurando Watchtower

Usaremos Watchtower para actualizar automáticamente los contenedores que utilizamos. Este servicio, además de actualizar los servicios, nos da la opción de notificarnos cuando lo hace.

```yaml
services:
  watchtower:
    container_name: watchtower
    image: containrrr/watchtower
    volumes:
      - ~/.docker/config.json:/config.json
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30 --cleanup
    environment:
      WATCHTOWER_NOTIFICATION_REPORT: "true"
      WATCHTOWER_NOTIFICATION_URL: >
        discord://${DISCORD_TOKEN}@${DISCORD_ID} 
        telegram://${TELEGRAM_TOKEN}@telegram?chats=${TELEGRAM_ID}&parseMode=html&preview=Yes
    restart: unless-stopped
```

En este caso, he habilitado las notificaciones de Discord y Telegram. Para esto, necesitarás crear un bot en Telegram y un webhook en Discord. Para Discord, el formato es el siguiente:

```env
DISCORD_ID=""
DISCORD_TOKEN=""
TELEGRAM_ID=""
TELEGRAM_TOKEN=""
```

En este caso, el bot enviará un mensaje al canal donde está configurado el webhook. También puedes usar un bot para enviar mensajes a un canal privado, pero necesitarás añadir el bot a ese canal. Para más información sobre el bot, puedes consultar la [documentación de WatchTower](https://containrrr.dev/watchtower/notifications/).

### Configurando nuestra primera imagen personalizada

Usaremos imágenes personalizadas para desplegar automáticamente nuestros servicios. En este caso, usaremos una imagen de httpd como ejemplo.

### Creación del Dockerfile

Crearemos un repositorio en GitHub donde almacenaremos el Dockerfile, los archivos web y los archivos de configuración de httpd.

Dockerfile:

```dockerfile
FROM httpd:2.4-alpine
COPY web/ /usr/local/apache2/htdocs/
EXPOSE 80
```

web/index.html:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hola Mundo</title>
</head>
<body>
    <h1>Hola Mundo</h1>
    <p>Esta es una página de prueba para mi servidor web.</p>
</body>
</html>
```

Esta imagen creará un contenedor con el servidor httpd y copiará los archivos web al contenedor. En este caso, solo tenemos un index.html, pero puedes añadir lo que necesites.

Si necesitas añadir archivos de configuración de httpd, puedes añadirlos al Dockerfile y copiarlos a la ruta correspondiente:

```dockerfile
COPY config/httpd.conf /usr/local/apache2/conf/httpd.conf
```

#### Preparando el pipeline para el despliegue automático

Ya tenemos un contenedor con nuestros archivos. Ahora, crearemos un pipeline en GitHub Actions para que cada vez que hagamos un push a la rama principal, la imagen se construya y se suba a Docker Hub o a un registro de contenedores.

```yaml
name: Build and Push Docker Image
on:
  push:
    branches:
      - main
permissions:
  contents: write
  pull-requests: write
  id-token: write
  packages: write
env:
  BUILD_PATH: "."

jobs:
  build_and_publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/${{ github.event.repository.name }}:latest
```

Este pipeline se ejecutará cada vez que hagas un push a la rama main y subirá la imagen al registro de imágenes especificado (en este caso, GitHub Container Registry). Puedes adaptar esto a Docker Hub o cualquier otro registro.

### Creando el compose.yml

Ahora, crearemos un archivo compose.yml que consuma la imagen que acabamos de crear y la despliegue en el servidor.

```yaml
services:
  myweb-prod-01:
    image: ghcr.io/TU_USUARIO/TU_REPOSITORIO:latest
    container_name: myweb-prod
    restart: unless-stopped
    networks:
      - frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.myweb.rule=Host(`myweb.dominio.com` ||`www.myweb.dominio.com`)"
      - "traefik.http.routers.myweb.entrypoints=web"
      - "traefik.http.routers.myweb-secure.entrypoints=websecure"
      - "traefik.http.routers.myweb-secure.rule=Host(`myweb.dominio.com` ||`www.myweb.dominio.com`)"
      - "traefik.http.routers.myweb-secure.tls=true"
      - "traefik.http.routers.myweb-secure.tls.certresolver=cloudflare"
      - "traefik.http.services.myweb.loadbalancer.server.port=80"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
networks:
  frontend:
    external: true
```

En este compose.yml, creamos un contenedor con la imagen que acabamos de construir y le asignamos un nombre. También lo asignamos a la red frontend y añadimos las etiquetas necesarias para que Traefik lo reconozca y lo exponga externamente. Recuerda reemplazar TU_USUARIO/TU_REPOSITORIO y tudominio.com con tu información real.

Además, añadimos un healthcheck para verificar que el contenedor se está ejecutando correctamente. Esto permite que Docker y Traefik entiendan el estado de tu aplicación.

Con esta configuración, tienes un contenedor en funcionamiento y expuesto externamente. Cada vez que hagas un push a la rama principal, la imagen se construirá y se subirá a tu registro de contenedores. Luego, tu servidor descargará la nueva imagen y la desplegará automáticamente usando Watchtower.

### Consideraciones sobre la Ubicación y el Versionado de Archivos `compose.yml`

Es importante destacar que los archivos `compose.yml` que definen cómo se desplegarán tus servicios **no tienen por qué residir necesariamente dentro del mismo repositorio que el código fuente de cada imagen Docker**. Aunque el ejemplo anterior creaba un `compose.yml` específico para la imagen `myweb`, existen estrategias más centralizadas y eficientes para gestionar estos archivos de configuración.

### Repositorio de Ejemplo para el Versionado de Configuraciones de Despliegue

Para simplificar el proceso de gestión y versionado de las configuraciones de despliegue, puedes usar un repositorio de plantilla público como [vps-config-deploy-post](https://github.com/usarral/vps-config-deploy-post). Este repositorio sirve como punto de partida para organizar tus archivos `compose.yml` y otras configuraciones relacionadas con el despliegue.

El repositorio está estructurado para proporcionar una clara separación de responsabilidades e incluye directorios para diferentes servicios y entornos. Puedes clonarlo o hacer un fork para adaptarlo a tus necesidades específicas.

**Puntos Destacados del Repositorio:**

- **Gestión Centralizada:** Todas las configuraciones de despliegue se almacenan en un solo lugar.
- **Plantilla Pública:** Cualquier usuario puede usarla como base para su propia configuración de despliegue.
- **Control de Versiones:** Realiza un seguimiento de los cambios, realiza rollbacks y mantén la consistencia entre entornos.

**Estructura de Ejemplo del Repositorio:**

```
vps-config-deploy-post/
|-- docker-compose/
|   |-- myweb/
|   |   |-- compose.yml
|   |-- traefik/
|   |   |-- config/
|   |   |   |-- traefik.yml
|   |   |-- certs/
|   |   |-- compose.yml
|   |   |-- .env (opcional)
|   |-- watchtower/
|   |   |-- compose.yml
|   |   |-- .env (opcional)
|-- README.md
```

Al usar esta plantilla, puedes configurar rápidamente un repositorio de configuración de despliegue robusto y organizado. También te permite separar el código de la aplicación de la infraestructura de despliegue, lo que hace que tu configuración sea más mantenible y escalable.

## Conclusión

En esta guía, hemos visto cómo configurar un VPS desde cero, asegurarlo y prepararlo para despliegues automáticos usando Docker, Traefik y GitHub Actions. Con estos pasos, puedes gestionar tus aplicaciones de forma eficiente y segura.

Recuerda mantener siempre tu servidor actualizado y seguir las mejores prácticas de seguridad para proteger tus datos y aplicaciones. ¡Buena suerte con tu VPS!

Si tienes alguna pregunta o sugerencia, no dudes en contactarme. Estoy aquí para ayudarte.
