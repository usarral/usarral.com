---
title: "🛠️ Securize and Deploy your VPS using Docker"
description: This article provides an updated guide on how I set up my VPS using Docker, including the necessary steps and requirements to secure and deploy your VPS efficiently.
publishDate: 2025-01-14
tags:
  - devops
  - vps
  - docker
  - traefik
  - security
  - tutorial
pinned: true
---

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

View the public key:

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

Execute the following command in the terminal:

```sh
ssh-keygen
```

This will generate a public/private key pair in the `~/.ssh` directory.
Then, copy the public key to the server:

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
      email: EMAIL@YOURDOMAIN.com
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
    image: ghcr.io/YOUR_USERNAME/YOUR_REPOSITORY:latest
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

### Example Repository for Versioning Deployment Configurations

To simplify the process of managing and versioning deployment configurations, you can use a public template repository like [vps-config-deploy-post](https://github.com/usarral/vps-config-deploy-post). This repository serves as a starting point for organizing your `compose.yml` files and other deployment-related configurations.

The repository is structured to provide a clear separation of concerns and includes directories for different services and environments. You can clone or fork it to adapt it to your specific needs.

**Repository Highlights:**

- **Centralized Management:** All deployment configurations are stored in one place.
- **Public Template:** Any user can use it as a base for their own deployment setup.
- **Version Control:** Track changes, perform rollbacks, and maintain consistency across environments.

**Example Structure of the Repository:**

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
|   |   |-- .env (optional)
|   |-- watchtower/
|   |   |-- compose.yml
|   |   |-- .env (optional)
|-- README.md
```

By using this template, you can quickly set up a robust and organized deployment configuration repository. It also allows you to separate application code from deployment infrastructure, making your setup more maintainable and scalable.

## Conclusion

In this guide, we have seen how to configure a VPS from scratch, secure it, and prepare it for automatic deployments using Docker, Traefik, and GitHub Actions. With these steps, you can manage your applications efficiently and securely.

Remember to always keep your server updated and follow security best practices to protect your data and applications. Good luck with your VPS!

If you have any questions or suggestions, do not hesitate to contact me. I am here to help you.