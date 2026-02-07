---
title: Docker Installation
description: This article provides a comprehensive guide to installing Docker on various platforms, including Linux and Windows. It covers the necessary commands to set up Docker, configure permissions, and manage containers and images. Perfect for beginners and those looking to enhance their containerization skills.
publishDate: 2022-10-07
tags:
  - docker
  - server
  - tutorial
  - devops
---

## Installing Docker

### Linux Distros with APT Package Manager

To install Docker on Linux distros like Ubuntu or Debian that use the APT package manager, you can do so with the following commands:

```sh
# Remove previous versions:
sudo apt-get remove docker docker-engine docker.io containerd runc

# Add packages to install and add the Docker repository
sudo apt-get install ca-certificates curl gnupg-agent lsb-release

# Add the GPG key for the Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the repository to our sources.list file, which is where APT queries the repositories to download programs
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update repositories to detect the Docker repository
sudo apt update

# Install Docker and its dependencies
sudo apt install docker-ce docker-ce-cli containerd.io
```

Configuration to use Docker without sudo:

```sh
# Add the user to the Docker group
sudo usermod -a -G docker $USER
# To use it without needing to restart, run the following command to "log in" to the group in the current session
newgrp docker
# Grant permissions to the Docker daemon socket
sudo chmod 666 /var/run/docker.sock

# Docker should now work; if it still doesn't, we need to restart the system
reboot now
```

### Windows

To install Docker on Windows:

1. Go to the [Docker website](https://docker.com).
2. Click on the download button for Windows.
3. Once downloaded, follow the installer.
4. Before running Docker, you will also need to install the WSL2 Kernel, which you can download [here](https://aka.ms/wsl2kernel).
5. Install this package, which will enable Docker virtualization.

## Basic Docker Commands

```sh
# Create a Docker container:
docker run -ti --name web ubuntu:latest

# Create a container with an open port:
# The format is LocalPort:ContainerPort
# By connecting to localhost:8000 from our browser, we would connect
# to port 80 of the container
docker run --name web2 -ti -p 8000:80 web:v1

# Create a container with a shared folder
# The format is LocalFolder:FolderInContainer
docker run -ti --name web -ti -p 8000:80 -v C:\\Docker\\web:/var/www/html web:v1

# Create an image from a container:
# If we are inside the container, exit
# docker commit -m "Commit" containername repository:tag
docker commit -m "Image with Apache" web web:v1

# View images in Docker:
docker images

# View containers
docker ps -a

# Remove a container
docker rm web

# Connect to an already running container
docker exec -ti web bash
```

## Conclusion

Docker is an essential tool for modern development and deployment workflows. With these installation steps and basic commands, you're ready to start containerizing your applications and enjoying the benefits of consistent, isolated development environments.