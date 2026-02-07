---
title: Deploying a LAMPP Stack in Docker
description: This article provides a step-by-step guide on deploying a LAMPP (Linux, Apache, MySQL, PHP, phpMyAdmin) stack using Docker. You'll learn how to set up an Ubuntu container, install Apache, configure MariaDB, and run PHP applications. Ideal for both beginners and those looking to enhance their container development skills.
publishDate: 2023-01-23
tags:
  - docker
  - linux
  - apache
  - mysql
  - php
  - tutorial
---

## Description

For this task, you are asked to install a LAMPP stack and run a PHP file on it.

## What is a LAMPP Stack?

A LAMP stack is a set of programs installed on a server to run web applications. These programs are:

- **L**inux: The server operating system.
- **A**pache: The web server.
- **M**ySQL: The database management system.
- **P**HP: The server-side programming language.
- **P**hpMyAdmin: A tool for managing MySQL databases.

## Installing the LAMP Stack

In my case, I will install it in a Docker container. To do this, I will use the official Ubuntu 20.04 image.

### Preparing the Container

To prepare the container, the first step is to create it:

```sh
docker run -ti --name despliegue_lampp -p 3000:80 -v ~/docker/despliegue_lampp:/var/www/html ubuntu:20.04
```

Once created, we update the package repositories and the system:

```sh
apt update && apt upgrade
```

Once done, we can start installing the necessary packages for the LAMPP stack.

### Installing Apache

To run Apache on Ubuntu, the first thing to do is install the `apache2` package:

```sh
apt install apache2
```

While it installs, it will prompt us to configure `tzdata`, which is the package responsible for timezone configuration. In my case, I will choose the Madrid timezone.

Once installed, we can check that the service is stopped:

```sh
service apache2 status
```

To start it, we run the following command and check that it has started correctly:

```sh
service apache2 start
service apache2 status
```

With this, we have Apache installed and running. Being a container, we can access it from our host machine's browser. To do this, we need to navigate to `http://localhost:3000`.

### Installing MySQL

In my case, I will install MariaDB, which is a fork of MySQL. To install it, we execute the following command:

```sh
apt install mariadb-server
```

Once installed, we can check that the service is stopped, and to start it we use the following command and check that it has started correctly:

```sh
service mysql status
service mysql start
service mysql status
```

With this, we have MySQL installed and running.

Now we will use the command `mysql_secure_installation` to set the root user's password and remove anonymous users, test users, and test databases. To do this, we execute the following command:

```sh
mysql_secure_installation
```

It will ask us a series of questions, to which we must respond with `y` or `n`:

- **Enter current password for root**: Press enter (no password by default)
- **Set root password?**: Y (and enter your desired password)
- **Remove anonymous users?**: Y
- **Disallow root login remotely?**: Y (we'll create a separate user for phpMyAdmin)
- **Remove test database?**: Y
- **Reload privilege tables?**: Y

With this, we have MySQL configured and secured.

#### Create a Connection User for phpMyAdmin

Since we have disabled remote access for the root user, we will create a connection user for phpMyAdmin. To do this, we execute the following command:

```sh
mysql -u root -p
```

This will take us to the MySQL console. Now we will create the connection user for phpMyAdmin:

```sql
CREATE USER 'webmanager'@'%' identified by 'password';
GRANT ALL PRIVILEGES ON *.* TO 'webmanager'@'%';
FLUSH PRIVILEGES;
exit
```

We can verify that we can access with the user we created:

```sh
mysql -u webmanager -p
```

## Installing PHP

The installation of PHP is very straightforward; we just need to execute the following command:

```sh
apt install php libapache2-mod-php php-mysql
```

With this, we have PHP installed and working. We can verify it with the following command:

```sh
php -v
```

To be able to run PHP files in Apache, we need to restart the service, as it was started before we had PHP installed. To restart the service, we execute the following command:

```sh
service apache2 restart
```

Once restarted, we can verify that we can run PHP files in the browser. To do this, we create an `index.php` file in the `/var/www/html` directory:

```sh
echo "<?php phpinfo(); ?>" > /var/www/html/index.php
```

Now if we access `http://localhost:3000` in our browser, we should see the PHP information page.

## Conclusion

With this, we have successfully deployed a complete LAMPP stack in a Docker container. This setup is perfect for development environments and can be easily replicated across different machines. The containerized approach ensures consistency and makes it easy to manage multiple development environments.