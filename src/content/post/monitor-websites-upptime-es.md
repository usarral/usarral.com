---
title: Monitoriza tus sitios web gratis con Upptime
description: Aprende cómo monitorizar tus sitios web de forma gratuita utilizando Upptime, una herramienta de código abierto potenciada por GitHub Actions. Descubre instrucciones paso a paso para configurar Upptime, personalizar notificaciones y crear una página de estado para rastrear el tiempo de actividad de tu sitio web de manera eficiente sin suscripciones de pago.
publishDate: 2024-12-30
lang: es
tags:
  - monitoring
  - github actions
  - devops
  - tutorial
  - open source
---

## Introducción

En el mundo del desarrollo web, una preocupación común para los desarrolladores es asegurar que sus sitios web permanezcan en línea y funcionales. Aquí es donde entra en juego la monitorización de sitios web. Los sistemas de monitorización te notifican cuando tu sitio web deja de funcionar, lo que te permite tomar medidas rápidas y restaurar la funcionalidad.

Aunque existen numerosos servicios de monitorización, muchos tienen limitaciones como el número de páginas monitorizadas o las comprobaciones diarias. A menudo se requieren suscripciones de pago para evitar estas restricciones.

Este post explora Upptime, una alternativa gratuita y de código abierto que aprovecha GitHub Actions para realizar la monitorización de sitios web. Upptime genera una página de estado que muestra todos tus sitios web monitorizados y ofrece varias opciones de notificación.

> **📦 Repositorio de Ejemplo:** Puedes encontrar un ejemplo completo y funcional de este tutorial en [github.com/blogusarral/upptime-demo](https://github.com/blogusarral/upptime-demo) y ver la página de estado en vivo en [blogusarral.github.io/upptime-demo](https://blogusarral.github.io/upptime-demo/).

## ¿Por qué elegir Upptime?

Esto es lo que hace que Upptime sea una opción atractiva para la monitorización de sitios web:

- **Gratis y de Código Abierto:** Upptime aprovecha GitHub Actions, eliminando la necesidad de suscripciones de pago.
- **Configuración Fácil:** Upptime utiliza una plantilla de repositorio de GitHub, simplificando el proceso de configuración.
- **Notificaciones Personalizables:** Upptime admite varias plataformas de notificación como Discord, Telegram, Slack y Microsoft Teams.
- **Página de Estado:** Upptime genera una página de estado que muestra la salud de todos tus sitios web monitorizados.
- **Automatizado:** GitHub Actions ejecuta comprobaciones programadas cada 5 minutos (configurable) sin intervención manual.
- **Datos Históricos:** Mantiene un registro del historial de tiempo de actividad y tiempos de respuesta con gráficos y estadísticas.

## Cómo funciona

Upptime utiliza GitHub Actions para hacer "ping" periódicamente a tus sitios web y comprobar su disponibilidad. Esto es lo que sucede:

1. **Comprobaciones Programadas:** GitHub Actions se ejecuta cada 5 minutos (por defecto) para revisar tus sitios web.
2. **Creación de Issues:** Cuando un sitio se cae, se crea automáticamente un "issue" en tu repositorio.
3. **Notificaciones:** Recibes notificaciones a través de tus canales configurados (Discord, Slack, etc.).
4. **Actualización de la Página de Estado:** La página de estado se pone al día automáticamente para reflejar el estado actual del sitio.
5. **Cierre de Issues:** Cuando el sitio vuelve a estar en línea, el "issue" se cierra automáticamente.

Todo esto se ejecuta íntegramente en la infraestructura de GitHub, aprovechando el nivel gratuito de GitHub Actions (2.000 minutos/mes para repositorios privados, ilimitado para repositorios públicos).

## Primeros pasos con Upptime

La configuración de Upptime implica crear un repositorio de GitHub y configurar los sitios web que deseas monitorizar. Aquí tienes una guía paso a paso:

### 1. Crear un Repositorio de GitHub

- Visita la plantilla del repositorio Upptime: [https://github.com/upptime/upptime](https://github.com/upptime/upptime)
- Haz clic en "Use this template" para crear un nuevo repositorio.
- **Importante:** Incluye todas las ramas (branches) cuando crees el repositorio. El sitio web de monitorización se aloja en la rama `gh-pages`.
- Nombra tu repositorio (por ejemplo, `upptime-demo` o `status`).
- Decide si quieres que el repositorio sea público o privado. Los repositorios públicos se benefician del uso ilimitado de GitHub Actions, mientras que los privados tienen un límite de 2.000 minutos/mes.

### 2. Configurar Upptime

Edita el archivo `.upptimerc.yml` en tu repositorio:

- Reemplaza los marcadores de posición como `owner` y `repo` con tu nombre de usuario de GitHub y el nombre de tu repositorio, respectivamente.
- Añade los `assignees` para la auto-asignación de issues cuando los sitios se caigan.
- Bajo `sites`, define los sitios web que quieres monitorizar. Especifica el nombre del sitio web y la URL para cada entrada.
- Configura la página de estado bajo `status-website`. Si tienes un dominio personalizado, establece la URL en el campo `cname`. De lo contrario, descomenta la línea `baseUrl` y añade el nombre de tu repositorio.

```yaml
# Cambia esto primero
owner: blogusarral # Tu organización o nombre de usuario de GitHub
repo: upptime-demo # El nombre de este repositorio
assignees:
  - usarral

sites:
  - name: Google
    url: https://www.google.com
  - name: Usarral.com
    url: https://usarral.com
  - name: GitHub
    url: https://github.com
  - name: Este sitio no existe
    url: http://not-exist2.com/

status-website:
  # Añade tu nombre de dominio personalizado, o elimina la línea `cname` si no tienes uno
  # Descomenta la línea `baseUrl` si no tienes un dominio personalizado y añade el nombre de tu repo allí
  # cname: demo.upptime.js.org
  baseUrl: /upptime-demo
  logoUrl: https://raw.githubusercontent.com/upptime/upptime.js.org/master/static/img/icon.svg
  name: Upptime Demo
  introTitle: "**Upptime** es el monitor de tiempo de actividad y página de estado de código abierto"
  introMessage: Esta es una página de estado de muestra que utiliza datos en **tiempo real** de nuestro repositorio de GitHub
  navbar:
    - title: Estado
      href: /
    - title: GitHub
      href: https://github.com/$OWNER/$REPO

# Upptime también admite notificaciones, asignando un usuario diferente según el sitio que se caiga
# status-website:
#   theme: dark
```

### 3. Habilitar GitHub Pages

Después de tu primer commit, GitHub Actions creará una rama `gh-pages`. Necesitas habilitar GitHub Pages:

- Ve a la configuración (Settings) de tu repositorio.
- Navega a "Pages" en la barra lateral izquierda.
- Bajo "Source", selecciona la rama `gh-pages`.
- Haz clic en "Save".

Tu página de estado estará disponible en `https://tunombredeusuario.github.io/nombre-del-repositorio/` en unos minutos.

### 4. Habilitar Notificaciones (Opcional)

Upptime admite varias plataformas de notificación. Aquí tienes un ejemplo usando Discord:

#### Configuración de Discord:

- Crea un webhook de Discord en algún canal del servidor:
  1. Ve a la configuración de tu servidor de Discord
  2. Navega a Integraciones → Webhooks
  3. Haz clic en "Nuevo Webhook" y copia la URL del webhook
- En la configuración de tu repositorio de GitHub, bajo "Secrets and variables" → "Actions", crea tres secretos:
  - `NOTIFICATION_DISCORD`: Establécelo en `true`
  - `NOTIFICATION_DISCORD_WEBHOOK`: Establécelo en `true`
  - `NOTIFICATION_DISCORD_WEBHOOK_URL`: Pega aquí la URL del webhook de Discord

#### Otras Opciones de Notificación:

Upptime también admite:
- **Slack:** Usa `NOTIFICATION_SLACK` y `NOTIFICATION_SLACK_WEBHOOK_URL`
- **Telegram:** Usa `NOTIFICATION_TELEGRAM` y `NOTIFICATION_TELEGRAM_CHAT_ID`
- **Microsoft Teams:** Usa `NOTIFICATION_MS_TEAMS` y `NOTIFICATION_MS_TEAMS_WEBHOOK_URL`
- **Email:** Puede configurarse a través de los archivos de flujo de trabajo (workflow) de GitHub Actions

### 5. Confirmar Cambios y Monitorizar

- Haz commit de tus cambios en el repositorio.
- La GitHub Action se ejecutará automáticamente y:
  - Comprobará todos tus sitios monitorizados
  - Actualizará el archivo README con el estado actual
  - Generará/actualizará la página de estado
  - Creará issues para cualquier sitio que esté caído

La configuración inicial puede tardar entre 2 y 5 minutos en completarse.

## Probando Upptime

Para probar la funcionalidad de Upptime, puedes añadir un sitio web inexistente a tus sitios monitorizados (como se muestra en la configuración de ejemplo anterior con `http://not-exist2.com/`). Cuando hagas commit de este cambio, se activará la GitHub Action:

1. Se creará un issue en tu repositorio con detalles sobre la caída.
2. Se enviará una notificación a tu plataforma elegida (por ejemplo, Discord).
3. La página de estado mostrará el sitio como "Down" con un indicador rojo.
4. El README se actualizará para reflejar el estado actual.

Esto demuestra la capacidad de Upptime para detectar e informar sobre caídas de sitios web en tiempo real.

## Opciones de Personalización

### Configuración Avanzada

Puedes personalizar muchos aspectos de Upptime en el archivo `.upptimerc.yml`:

- **Frecuencia de comprobación:** Modifica el cron schedule en `.github/workflows/uptime.yml`.
- **Comprobaciones de tiempo de respuesta:** Establece tiempos de respuesta esperados y recibe alertas si se superan.
- **Encabezados personalizados:** Añade encabezados de autenticación para endpoints protegidos.
- **Métodos HTTP:** Usa POST, PUT u otros métodos en lugar de GET.
- **Códigos de estado esperados:** Define qué códigos de estado se consideran "up".

### Dominio Personalizado

Si quieres usar un dominio personalizado para tu página de estado:

1. Añade un archivo `CNAME` a tu repositorio con tu nombre de dominio.
2. Actualiza el campo `cname` en `.upptimerc.yml`.
3. Configura tu proveedor de DNS para que apunte a `tunombredeusuario.github.io`.

## Resolución de Problemas

### Problemas Comunes:

**GitHub Actions no se ejecutan:**
- Comprueba que las GitHub Actions estén habilitadas en la configuración de tu repositorio.
- Verifica que los flujos de trabajo no estén desactivados.
- Asegúrate de tener el directorio `.github/workflows` con los archivos de workflow.

**La página de estado no se muestra:**
- Asegúrate de que GitHub Pages esté habilitado y configurado en la rama `gh-pages`.
- Espera unos minutos después del primer despliegue.
- Revisa la pestaña Actions para ver si hay errores en las ejecuciones del workflow.

**Las notificaciones no funcionan:**
- Verifica que tus secretos estén correctamente configurados en los ajustes del repositorio.
- Comprueba que los nombres de los secretos coincidan exactamente (distinguen entre mayúsculas y minúsculas).
- Prueba tu URL de webhook de forma independiente para asegurar que sea válida.

**Límites de tasa (Rate limiting):**
- Si estás monitorizando muchos sitios, podrías alcanzar los límites de tasa de la API de GitHub.
- Considera reducir la frecuencia de comprobación o el número de sitios monitorizados.
- Usa un repositorio público para minutos ilimitados de GitHub Actions.

## Limitaciones de GitHub Actions

Ten en cuenta las siguientes limitaciones al usar Upptime:

- **Límites del nivel gratuito:** Los repositorios privados tienen un límite de 2.000 minutos/mes en GitHub Actions.
- **Tiempo de ejecución:** Cada ejecución de flujo de trabajo tiene un tiempo máximo de 6 horas.
- **Trabajos concurrentes:** Las cuentas gratuitas pueden ejecutar hasta 20 trabajos concurrentes.
- **Almacenamiento:** Los artefactos y registros se conservan durante 90 días por defecto.

Para la mayoría de los casos de uso, estas limitaciones son más que suficientes. Un repositorio público que monitoriza 10 sitios web con intervalos de 5 minutos utiliza aproximadamente 300 minutos al mes.

## Repositorio de Ejemplo

Puedes explorar un ejemplo totalmente funcional en:

- **Repositorio:** [git@github.com:blogusarral/upptime-demo.git](https://github.com/blogusarral/upptime-demo)
- **Página de Estado en Vivo:** [https://usarral.github.io/upptime-demo/](https://usarral.github.io/upptime-demo/)

Clona o haz un fork de este repositorio para empezar rápidamente:

```bash
git clone git@github.com:blogusarral/upptime-demo.git
```

## Conclusión

Upptime ofrece una solución atractiva para una monitorización de sitios web gratuita y efectiva. Su facilidad de uso, capacidad de personalización y naturaleza de código abierto lo convierten en una herramienta valiosa para desarrolladores de todos los niveles.

**Puntos clave:**
- ✅ Completamente gratis para repositorios públicos.
- ✅ Sin infraestructura que mantener.
- ✅ Monitorización automatizada cada 5 minutos.
- ✅ Hermosa página de estado con datos históricos.
- ✅ Múltiples canales de notificación soportados.
- ✅ Seguimiento de incidentes mediante issues.

Si buscas una forma fiable y económica de monitorizar tus sitios web, definitivamente vale la pena considerar Upptime. Ya sea que monitorices proyectos personales, sitios web de clientes o servicios de producción, Upptime proporciona una monitorización de nivel empresarial sin los costes de nivel empresarial.

## Recursos Adicionales

- [Documentación Oficial de Upptime](https://upptime.js.org)
- [Repositorio de GitHub de Upptime](https://github.com/upptime/upptime)
- [Documentación de GitHub Actions](https://docs.github.com/en/actions)
- [Repositorio de Ejemplo - upptime-demo](https://github.com/blogusarral/upptime-demo)
