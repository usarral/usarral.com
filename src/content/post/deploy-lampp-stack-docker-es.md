---
title: Desplegando un Stack LAMPP en Docker
description: Esta artículo proporciona una guía paso a paso sobre cómo desplegar un stack LAMPP (Linux, Apache, MySQL, PHP, phpMyAdmin) utilizando Docker. Aprenderás cómo configurar un contenedor Ubuntu, instalar Apache, configurar MariaDB y ejecutar aplicaciones PHP. Ideal tanto para principiantes como para aquellos que buscan mejorar sus habilidades de desarrollo con contenedores.
publishDate: 2023-01-23
lang: es
tags:
  - docker
  - linux
  - apache
  - mysql
  - php
  - tutorial
---

## Descripción

Para esta tarea, se requiere instalar un stack LAMPP y ejecutar un archivo PHP en él.

## ¿Qué es un Stack LAMPP?

Un stack LAMP es un conjunto de programas instalados en un servidor para ejecutar aplicaciones web. Estos programas son:

- **L**inux: El sistema operativo del servidor.
- **A**pache: El servidor web.
- **M**ySQL: El sistema de gestión de bases de datos.
- **P**HP: El lenguaje de programación del lado del servidor.
- **P**hpMyAdmin: Una herramienta para gestionar bases de datos MySQL.

## Instalando el Stack LAMP

En mi caso, lo instalaré en un contenedor Docker. Para hacer esto, utilizaré la imagen oficial de Ubuntu 20.04.

### Preparando el Contenedor

Para preparar el contenedor, el primer paso es crearlo:

```sh
docker run -ti --name despliegue_lampp -p 3000:80 -v ~/docker/despliegue_lampp:/var/www/html ubuntu:20.04
```

Una vez creado, actualizamos los repositorios de paquetes y el sistema:

```sh
apt update && apt upgrade
```

Una vez hecho esto, podemos comenzar a instalar los paquetes necesarios para el stack LAMPP.

### Instalando Apache

Para ejecutar Apache en Ubuntu, lo primero que debemos hacer es instalar el paquete `apache2`:

```sh
apt install apache2
```

Mientras se instala, nos pedirá configurar `tzdata`, que es el paquete responsable de la configuración de la zona horaria. En mi caso, elegiré la zona horaria de Madrid.

Una vez instalado, podemos comprobar que el servicio está detenido:

```sh
service apache2 status
```

Para iniciarlo, ejecutamos el siguiente comando y comprobamos que se ha iniciado correctamente:

```sh
service apache2 start
service apache2 status
```

Con esto, tenemos Apache instalado y en funcionamiento. Al ser un contenedor, podemos acceder a él desde el navegador de nuestra máquina anfitriona (host). Para hacer esto, necesitamos navegar a `http://localhost:3000`.

### Instalando MySQL

En mi caso, instalaré MariaDB, que es un fork de MySQL. Para instalarlo, ejecutamos el siguiente comando:

```sh
apt install mariadb-server
```

Una vez instalado, podemos comprobar que el servicio está detenido, y para iniciarlo usamos el siguiente comando y comprobamos que se ha iniciado correctamente:

```sh
service mysql status
service mysql start
service mysql status
```

Con esto, tenemos MySQL instalado y en funcionamiento.

Ahora utilizaremos el comando `mysql_secure_installation` para establecer la contraseña del usuario root y eliminar usuarios anónimos, usuarios de prueba y bases de datos de prueba. Para hacer esto, ejecutamos el siguiente comando:

```sh
mysql_secure_installation
```

Nos hará una serie de preguntas, a las que debemos responder con `y` (sí) o `n` (no):

- **Enter current password for root**: Presiona Enter (sin contraseña por defecto)
- **Set root password?**: Y (e introduce la contraseña deseada)
- **Remove anonymous users?**: Y
- **Disallow root login remotely?**: Y (crearemos un usuario separado para phpMyAdmin)
- **Remove test database?**: Y
- **Reload privilege tables?**: Y

Con esto, tenemos MySQL configurado y asegurado.

#### Crear un Usuario de Conexión para phpMyAdmin

Como hemos desactivado el acceso remoto para el usuario root, crearemos un usuario de conexión para phpMyAdmin. Para hacer esto, ejecutamos el siguiente comando:

```sh
mysql -u root -p
```

Esto nos llevará a la consola de MySQL. Ahora crearemos el usuario de conexión para phpMyAdmin:

```sql
CREATE USER 'webmanager'@'%' identified by 'password';
GRANT ALL PRIVILEGES ON *.* TO 'webmanager'@'%';
FLUSH PRIVILEGES;
exit
```

Podemos verificar que podemos acceder con el usuario que creamos:

```sh
mysql -u webmanager -p
```

## Instalando PHP

La instalación de PHP es muy sencilla; solo necesitamos ejecutar el siguiente comando:

```sh
apt install php libapache2-mod-php php-mysql
```

Con esto, tenemos PHP instalado y funcionando. Podemos verificarlo con el siguiente comando:

```sh
php -v
```

Para poder ejecutar archivos PHP en Apache, necesitamos reiniciar el servicio, ya que se inició antes de que tuviéramos PHP instalado. Para reiniciar el servicio, ejecutamos el siguiente comando:

```sh
service apache2 restart
```

Una vez reiniciado, podemos verificar que podemos ejecutar archivos PHP en el navegador. Para hacer esto, creamos un archivo `index.php` en el directorio `/var/www/html`:

```sh
echo "<?php phpinfo(); ?>" > /var/www/html/index.php
```

Ahora, si accedemos a `http://localhost:3000` en nuestro navegador, deberíamos ver la página de información de PHP.

## Conclusión

Con esto, hemos desplegado con éxito un stack LAMPP completo en un contenedor Docker. Esta configuración es perfecta para entornos de desarrollo y se puede replicar fácilmente en diferentes máquinas. El enfoque basado en contenedores garantiza la consistencia y facilita la gestión de múltiples entornos de desarrollo.
