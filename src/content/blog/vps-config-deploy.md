---
title: "🛠️ Securize and Deploy your VPS using Docker"
description: "This article provides an updated guide on how I set up my VPS using Docker, including the necessary steps and requirements to secure and deploy your VPS."
pubDate: 2025-4-13
toc: true
topic: devops
draft: true
tags:
  - DevOps
  - VPS
---

<!--toc:start-->

- [1. Instalación de Ubuntu Server](#1-instalación-de-ubuntu-server)
- [2. Securización del Usuario](#2-securización-del-usuario)
  - [Crear un Usuario No Root](#crear-un-usuario-no-root)
  - [Asignar Contraseña y Permisos Sudo](#asignar-contraseña-y-permisos-sudo)
  - [Verificar Acceso con Sudo](#verificar-acceso-con-sudo)
  - [Configurar Clave SSH](#configurar-clave-ssh)
    - [En Windows](#en-windows)
      - [Visualiza la clave pública](#visualiza-la-clave-pública)
      - [Conéctate al servidor y edita el archivo authorized_keys: ￼](#conéctate-al-servidor-y-edita-el-archivo-authorizedkeys)
      - [Pega la clave pública y guarda los cambios. ￼](#pega-la-clave-pública-y-guarda-los-cambios)
    - [En macOS/Linux](#en-macoslinux)
      - [Ejecuta el siguiente comando en la terminal](#ejecuta-el-siguiente-comando-en-la-terminal)
      - [Luego, copia la clave pública al servidor](#luego-copia-la-clave-pública-al-servidor)
- [3. Securización del Servidor](#3-securización-del-servidor)
  - [Configuración de SSH](#configuración-de-ssh)
  - [Configuración de UFW (Uncomplicated Firewall)](#configuración-de-ufw-uncomplicated-firewall)
- [4. Instalación de Docker](#4-instalación-de-docker)
  - [Instala Docker utilizando el script oficial](#instala-docker-utilizando-el-script-oficial)
  - [Agrega tu usuario al grupo docker para evitar usar sudo al ejecutar comandos de Docker: ￼](#agrega-tu-usuario-al-grupo-docker-para-evitar-usar-sudo-al-ejecutar-comandos-de-docker)
- [5. Configuración de Despliegues Automáticos](#5-configuración-de-despliegues-automáticos)
  - [Crear Redes de Frontend y Backend](#crear-redes-de-frontend-y-backend)
  - [Configurar Traefik](#configurar-traefik)
  - [Configurar Watchtower](#configurar-watchtower)
  - [Configurando nuestra primera imagen personalizada](#configurando-nuestra-primera-imagen-personalizada) - [Creación del DockerFile](#creación-del-dockerfile) - [Preparar pipeline para deploy automático](#preparar-pipeline-para-deploy-automático) - [Configurar compose en el servidor para lanzar la imagen](#configurar-compose-en-el-servidor-para-lanzar-la-imagen)
  <!--toc:end-->

En esta guía, exploraremos paso a paso cómo configurar un servidor Ubuntu desde cero, asegurando su seguridad y preparando un entorno eficiente para despliegues automatizados utilizando Docker, Traefik y GitHub Actions.

## 1. Instalación de Ubuntu Server

En esta guia asumiremos que tienes un VPS con Ubuntu Server 22.04 LTS instalado. Si no lo tienes, puedes seguir la guía de instalación de [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-ubuntu-22-04-lts).

## 2. Securización del Usuario

### Crear un Usuario No Root

Después de la instalación, accede al servidor y crea un nuevo usuario para evitar el uso directo de root:

```sh
adduser vpsmanager
```

### Asignar Contraseña y Permisos Sudo

Establece una contraseña segura para el nuevo usuario y otórgale privilegios de sudo:

```sh
usermod -aG sudo vpsmanager
```

Si el servidor nos indica que el grupo sudo no existe prueba con el grupo wheel:

```sh
usermod -aG wheel vpsmanager
```

### Verificar Acceso con Sudo

Cambia al nuevo usuario y verifica que puedes ejecutar comandos con privilegios de superusuario:

```sh
su - vpsmanager
sudo apt update
```

### Configurar Clave SSH

#### En Windows

Utiliza ssh-keygen en PowerShell para generar una clave SSH:

```powershell
ssh-keygen
```

Luego, copia la clave pública al servidor manualmente:

##### Visualiza la clave pública

```powershell
type $env:USERPROFILE\.ssh\id_rsa.pub
```

##### Conéctate al servidor y edita el archivo authorized_keys: ￼

```powershell
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

##### Pega la clave pública y guarda los cambios. ￼

#### En macOS/Linux

##### Ejecuta el siguiente comando en la terminal

```sh
ssh-keygen
```

##### Luego, copia la clave pública al servidor

```sh
ssh-copy-id vpsmanager@ip_del_servidor
```

## 3. Securización del Servidor

### Configuración de SSH

Edita el archivo de configuración de SSH:

```sh
sudo nano /etc/ssh/sshd_config
```

Realiza los siguientes cambios:

- Desactiva la autenticación por contraseña:

```sh
PasswordAuthentication no
```

- Prohíbe el acceso directo como root:

```sh
PermitRootLogin no
```

- Desactiva PAM si solo se utilizará autenticación por clave SSH:

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

Asegúrate de que puedes seguir accediendo al servidor vía SSH después de activar el firewall.

## 4. Instalación de Docker

### Instala Docker utilizando el script oficial

```sh
curl -fsSL <https://get.docker.com> -o get-docker.sh
sudo sh get-docker.sh
```

### Agrega tu usuario al grupo docker para evitar usar sudo al ejecutar comandos de Docker: ￼

```sh
sudo usermod -aG docker vpsmanager
```

Cierra la sesión y vuelve a iniciarla para aplicar los cambios de grupo.

## 5. Configuración de Despliegues Automáticos

### Crear Redes de Frontend y Backend

Define las redes necesarias para tus contenedores:

```sh
docker network create frontend
docker network create backend
```

### Configurar Traefik

Usaremos traefik como reverse-proxy que sera el encargado de enrutar todas las request a su contendor correspondiente.

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
      - CF_DNS_API_TOKEN
    networks:
      - frontend
    restart: unless-stopped

networks:
  frontend:
    external: true
```

En este compose usaremos una imagen fija de traefik ya que para servicios de terceros prefiero actualizarlos manualmente.
Montamos los puertos estandar de protocolo HTTP y HTTPS
Montamos docker.sock para poder conectar con los contenedores, config para la configuracion propia de traefik y certs para almacenar los certificados SSL

Le pasaremos nuestro token de CloudFlare para la generación de certificados SSL, este token debera tener los permisos para modificar zonas DNS que creara registros temporalmente para la verificación.

Montamos la network frontend ya que solo queremos exponer los servicios en esta red.

Por ultimo hacemos que se reincie automaticamente mientras no lo paremos nosotros

#### config/traefik.yml

```yml
---
global:
  checkNewVersion: false
  sendAnonymousUsage: false

# --> (Optional) Change log level and format here ...
#     - level: [TRACE, DEBUG, INFO, WARN, ERROR, FATAL]
log:
  level: INFO
# <--

# --> (Optional) Enable accesslog here ...
# accesslog: {}
# <--

# --> (Optional) Enable API and Dashboard here, don't do in production
# api:
#   dashboard: true
#   insecure: true
# <--

# -- Change EntryPoints here...
entryPoints:
  web:
    address: :80
    # --> (Optional) Redirect all HTTP to HTTPS
    # http:
    #   redirections:
    #     entryPoint:
    #       to: websecure
    #       scheme: https
    # <--
  websecure:
    address: :443

# -- Configure your CertificateResolver here...
certificatesResolvers:
  cloudflare:
    acme:
      email: USUARIO@TUDOMINIO.com # <-- Change this to your email
      storage: /var/traefik/certs/cloudflare-acme.json
      caServer: "https://acme-v02.api.letsencrypt.org/directory"
      dnsChallenge:
        provider: cloudflare # <-- (Optional) Change this to your DNS provider
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"

# --> (Optional) Disable TLS Cert verification check
# serversTransport:
#   insecureSkipVerify: true
# <--

providers:
  docker:
    exposedByDefault: false # <-- (Optional) Change this to true if you want to expose all services
    # Specify discovery network - This ensures correct name resolving and possible issues with containers, that are in multiple networks.
    # E.g. Database container in a separate network and a container in the frontend and database network.
    network: frontend
  file:
    directory: /etc/traefik
    watch: true
```

Con esto configuraremos los servicios principales de traefik como el nivel de log, los puertos de escucha y los certificatesResolvers que usaremos para los certificados SSL
Por ultimo tambien configuraremos los proveedores

#### .env

```env
CF_DNS_API_TOKEN=""
```

Este archivo debe estar al mismo nivel que el compose.yml y define el token de cloudflare que utilizaremos

### Configurar Watchtower

Con esto usará watchtower para actualizar automaticamente los contenedores que utilizaremos.Este servicio ademas de actualizar los servicios nos da la opción de notificarnos cuando lo haga

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

En este caso tengo activado las notificaciones de discord y telegram, para esto deberas crear un bot en telegram y un webhook en discord. En el caso de discord el formato es el siguiente:

```env
#https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
DISCORD_ID=""
DISCORD_TOKEN=""
TELEGRAM_ID=""
TELEGRAM_TOKEN=""
```

### Configurando nuestra primera imagen personalizada

#### Creación del DockerFile

#### Preparar pipeline para deploy automático

#### Configurar compose en el servidor para lanzar la imagen
