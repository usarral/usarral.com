---
title: "🛠️ Securize and Deploy your VPS using Docker"
description: "This article provides an updated guide on how I set up my VPS using Docker, including the necessary steps and requirements to secure and deploy your VPS efficiently."
pubDate: 2025-4-13
toc: true
topic: devops
draft: false
tags:
  - DevOps
  - VPS
---

<!--toc:start-->

- [1. Ubuntu Server Installation](#1-ubuntu-server-installation)
- [2. User Securization](#2-user-securization)
  - [Creating a Non-Root User](#creating-a-non-root-user)
  - [Assigning Password and Sudo Permissions](#assigning-password-and-sudo-permissions)
  - [Verifying Sudo Access](#verifying-sudo-access)
  - [Configuring SSH Key](#configuring-ssh-key)
    - [On Windows](#on-windows)
    - [On macOS/Linux](#on-macoslinux)
      - [Execute the following command in the terminal](#execute-the-following-command-in-the-terminal)
- [3. Server Securization](#3-server-securization)
  - [Secure SSH Configuration](#secure-ssh-configuration)
  - [UFW (Uncomplicated Firewall) Configuration](#ufw-uncomplicated-firewall-configuration)
- [4. Docker Installation](#4-docker-installation)
  - [Install Docker using the official script](#install-docker-using-the-official-script)
  - [Add your user to the docker group to avoid using sudo when executing Docker commands:](#add-your-user-to-the-docker-group-to-avoid-using-sudo-when-executing-docker-commands)
- [5. Automatic Deployment Configuration](#5-automatic-deployment-configuration)
  - [Creating Frontend and Backend Networks](#creating-frontend-and-backend-networks)
  - [Configuring Traefik](#configuring-traefik)
    - [compose.yml](#composeyml)
    - [config/traefik.yml](#configtraefikyml)
    - [.env](#env)
  - [Configuring Watchtower](#configuring-watchtower)
  - [Configuring our first custom image](#configuring-our-first-custom-image)
  - [Dockerfile Creation](#dockerfile-creation)
    - [Preparing the pipeline for automatic deployment](#preparing-the-pipeline-for-automatic-deployment)
  - [Creating the compose.yml](#creating-the-composeyml)
  - [Considerations for the Location and Versioning of `compose.yml` Files](#considerations-for-the-location-and-versioning-of-composeyml-files)
- [Conclusion](#conclusion)

In this guide, we will explore step by step how to set up an Ubuntu server from scratch, ensuring its security and preparing an efficient environment for automated deployments using Docker, Traefik, and GitHub Actions.

## 1. Ubuntu Server Installation

In this guide, we will assume that you have a VPS with Ubuntu Server 22.04 LTS installed. If you don't have one, you can follow the installation guide from [Ubuntu Docs](https://documentation.ubuntu.com/server/tutorial/basic-installation/index.html).

## 2. User Securization

### Creating a Non-Root User

After installation, access the server and create a new user to avoid direct use of root:

```sh
adduser vpsmanager
```
Avoid using standard names like "admin" or "user" to prevent brute-force attacks. Use a unique name that is not easily guessable.
On this guide, we will use "vpsmanager" as the username for the example.

### Assigning Password and Sudo Permissions
Set a strong password for the new user and grant it sudo privileges:
```sh
usermod -aG sudo vpsmanager
```
If the server indicates that the sudo group does not exist, try the wheel group:
```sh
usermod -aG wheel vpsmanager
```

### Verifying Sudo Access


Switch to the new user and verify that you can execute commands with superuser privileges:
```sh
su - vpsmanager
sudo ls /
```

### Configuring SSH Key

#### On Windows

Use ssh-keygen in PowerShell to generate an SSH key:
```powershell
ssh-keygen
```

Then, copy the public key to the server manually:

View the public key
```powershell
type $env:USERPROFILE\.ssh\*.pub
```

Connect to the server and edit the authorized_keys file:
```powershell
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```
Paste the public key and save the changes.

#### On macOS/Linux

##### Execute the following command in the terminal
```sh
ssh-keygen
```
This will generate a public/private key pair in the `~/.ssh` directory.
Then, copy the public key to the server
```sh
ssh-copy-id vpsmanager@ip_del_servidor
```

## 3. Server Securization

### Secure SSH Configuration

Edit the SSH configuration file:
```sh
sudo nano /etc/ssh/sshd_config
```

Make the following changes:
- Disable password authentication:
```sh
PasswordAuthentication no
```

- Prohibit direct root login:
```sh
PermitRootLogin no
```

- Disable PAM if only SSH key authentication will be used (simplifies the authentication chain):
```sh
UsePAM no
```

Restart the SSH service and verify in a new terminal that you can access with the current configurations before closing the session:
```sh
sudo systemctl restart ssh
```

### UFW (Uncomplicated Firewall) Configuration

Set the firewall rules:
```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

Ensure that you can still access the server via SSH after activating the firewall. If you are only deploying a web application, ports 80 (HTTP) and 443 (HTTPS) are typically the only necessary ports to open from the outside. Review these rules if you plan to host other services.
## 4. Docker Installation

### Install Docker using the official script
```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Add your user to the docker group to avoid using sudo when executing Docker commands:

```sh
sudo usermod -aG docker vpsmanager
```

Close the session and log back in to apply the group changes.

## 5. Automatic Deployment Configuration

### Creating Frontend and Backend Networks

Define the necessary networks for your containers. Using separate networks provides isolation and manages internal communication:

```sh
docker network create frontend
docker network create backend
```

### Configuring Traefik
We will use Traefik as a reverse proxy, which will be responsible for routing all requests to their corresponding container.


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
      - CF_DNS_API_TOKEN # Cloudflare API token with DNS zone modification permissions
    networks:
      - frontend
    restart: unless-stopped

networks:
  frontend:
    external: true
```

In this compose file, we use a fixed Traefik image version as for third-party services, I prefer to update them manually.
We mount the standard HTTP and HTTPS protocol ports.
We mount docker.sock to connect with the containers, config for Traefik's own configuration, and certs to store SSL certificates.

We pass our Cloudflare token for SSL certificate generation. This token should have permissions to modify DNS zones, which will temporarily create records for verification.

We mount the frontend network as we only want to expose services on this network.

Finally, we set it to restart automatically unless we explicitly stop it.

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
      email: EMAIL@YOURDOMAIN.com # <-- Change this to your email
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
<small> This config is based on the one from [Christian Lempa](https://github.com/ChristianLempa/homelab/blob/main/traefik/traefik-prod-1/config/traefik.yaml), but with some modifications to suit my needs.</small>

With this configuration, we set up the main Traefik services such as the log level, listening ports, and the certificatesResolvers we will use for SSL certificates.
Finally, we also configure the providers.

#### .env

```env
CF_DNS_API_TOKEN=""
```

This file should be at the same level as the compose.yml and defines the Cloudflare token we will use. **Remember not to commit this file to public repositories. You could also consider using Docker secrets or a dedicated secret management system for better security.**
### Configuring Watchtower

We will use Watchtower to automatically update the containers we use. This service, in addition to updating the services, gives us the option to notify us when it does so.


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

In this case, I have enabled Discord and Telegram notifications. For this, you will need to create a bot in Telegram and a webhook in Discord. For Discord, the format is as follows:


```env
DISCORD_ID=""
DISCORD_TOKEN=""
TELEGRAM_ID=""
TELEGRAM_TOKEN=""
```
In this case, the bot will send a message to the channel where the webhook is configured. You can also use a bot to send messages to a private channel, but you will need to add the bot to that channel. For more information about the bot, you can check the [WatchTower docs](https://containrrr.dev/watchtower/notifications/).

### Configuring our first custom image

We will use custom images to automatically deploy our services. In this case, we will use an httpd image as an example.

### Dockerfile Creation
We will create a repository on GitHub where we will store the Dockerfile, the web files, and the httpd configuration files.

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
    <h1>Hello World</h1>
    <p>This is a test page for my web server.</p>
    </p>
</body>
</html>
```

This image will create a container with the httpd server and copy the web files to the container. In this case, we only have an index.html, but you can add whatever you need.

If you need to add httpd configuration files, you can add them to the Dockerfile and copy them to the corresponding path:
```dockerfile
COPY config/httpd.conf /usr/local/apache2/conf/httpd.conf
```
#### Preparing the pipeline for automatic deployment
We already have a container with our files. Now, we will create a pipeline in GitHub Actions so that every time we push to the main branch, the image is built and uploaded to Docker Hub or a container registry.

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
This pipeline will run every time you push to the main branch and will upload the image to the specified image registry (in this case, GitHub Container Registry). You can adapt this to Docker Hub or any other registry.

### Creating the compose.yml
Now, we will create a compose.yml file that consumes the image we just created and deploys it to the server.

```yaml
services:
  myweb-prod-01:
    image: ghcr.io/YOUR_USERNAME/YOUR_REPOSITORY:latest # Replace with your image registry and repository
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
In this compose.yml, we create a container with the image we just built and assign it a name. We also assign it to the frontend network and add the necessary labels for Traefik to recognize and expose it externally. Remember to replace YOUR_USERNAME/YOUR_REPOSITORY and yourdomain.com with your actual information.

Additionally, we add a healthcheck to verify that the container is running correctly. This allows Docker and Traefik to understand the state of your application.


With this setup, you have a container running and exposed externally. Every time you push to the main branch, the image will be built and uploaded to your container registry. Then, your server will download the new image and deploy it automatically using Watchtower.

### Considerations for the Location and Versioning of `compose.yml` Files

It's important to note that the `compose.yml` files that define how your services will be deployed **do not necessarily have to reside within the same repository as the source code for each Docker image**. While the previous example created a specific `compose.yml` for the `myweb` image, there are more centralized and efficient strategies for managing these configuration files.

**Single Repository for Deployment Configuration:**

A recommended practice is to keep all your `compose.yml` files (and other deployment-related configurations in a **single, dedicated repository**. This offers several advantages:

* **Centralized Management:** Simplifies the administration and tracking of all deployment configurations in one place.
* **Unified Versioning:** Allows you to version all deployment configurations consistently using Git. This is crucial for tracking changes, performing rollbacks, and maintaining consistency across your environments.
* **Separation of Concerns:** Clearly separates the management of application code (in the image repositories) from the management of the deployment infrastructure (in the configuration repository).
* **Facilitates Environment Management:** You can organize your configuration repository with directories or branches to represent different environments (development, staging, production), allowing for environment-specific configurations.

**Example Structure of a Configuration Repository:**
```
deploy-config/
|-- docker-compose/
|   |-- myweb
|   |   |-- compose.yml
|   |-- traefik
|   |   |-- config
|   |   |   |-- traefik.yml
|   |   |-- certs
|   |   |-- compose.yml
|   |   |-- .env (optional)
|   |-- watchtower
|   |   |-- compose.yml
|   |   |-- .env (optional)
|   |-- ...
|-- README.md
```
In this scenario, the GitHub Actions pipeline that builds and publishes your Docker image would not be directly involved in the deployment. Instead, you would have a separate process (manual or automated via another CI/CD system or even scripts on your VPS) that would:

1.  Access the configuration repository (`deploy-config`).
2.  Select the appropriate `compose.yml` file for the desired service and environment.
3.  Use `docker compose up -d -f <path_to_compose.yml>` on your VPS to deploy or update the service using the image already published in your container registry.

**Additional Benefits of Versioning:**

By versioning your `compose.yml` files, you gain a complete history of the changes made to your deployment configuration. This allows you to:

* **Audit changes:** Know who, when, and why a service's configuration was modified.
* **Perform rollbacks:** In case of issues after a configuration update, you can easily revert to a previous version.
* **Maintain consistency:** Ensure that the deployment configuration across different environments is consistent (or intentionally different).

In summary, while the example focuses on having a `compose.yml` for a specific service, consider the option of **centralizing and versioning your deployment configuration files in a dedicated repository** for more robust and organized management of your Docker infrastructure.
 
## Conclusion

In this guide, we have seen how to configure a VPS from scratch, secure it, and prepare it for automatic deployments using Docker, Traefik, and GitHub Actions. With these steps, you can manage your applications efficiently and securely.

Remember to always keep your server updated and follow security best practices to protect your data and applications. Good luck with your VPS!

If you have any questions or suggestions, do not hesitate to contact me. I am here to help you.