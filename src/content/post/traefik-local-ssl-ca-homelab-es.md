---
title: "SSL en HomeLab con Traefik v3 y CA Local"
description: "Aprende cómo eliminar las advertencias de seguridad del navegador en tu HomeLab configurando una Entidad Certificadora personalizada y configurando Traefik v3 con un certificado wildcard."
pinned: true
publishDate: 2026-02-07
tags: ["homelab", "traefik", "ssl", "security", "docker", "devops", "español"]
draft: false
lang: es
---

# SSL en HomeLab Hecho Fácil: Guía de Traefik v3 y CA Local

¿Cansado de ver "Tu conexión no es privada" cada vez que accedes a tu panel local? Aunque servicios como Let's Encrypt son excelentes para sitios orientados al público, asegurar servicios de uso interno requiere un enfoque diferente.

En esta guía, crearemos una **Entidad Certificadora (CA)** privada y configuraremos **Traefik v3** para servir un certificado wildcard para todo tu dominio local (por ejemplo, `*.homelab.local`).

> **📦 Ejemplo Completo y Funcional:** ¡Todos los scripts y archivos de configuración de esta guía están disponibles en el [repositorio traefik-ssl-demo](https://github.com/blogusarral/traefik-ssl-demo-homelab)! ¡Clónalo y empieza en minutos!

---

## Requisitos Previos

- Docker y Docker Compose instalados.
- Comprensión básica de DNS y certificados.
- Un servidor DNS local (AdGuard Home, Pi-hole o similar).
  - Si tu router tiene un servidor DNS integrado, puedes usarlo en lugar de configurar uno separado.
  - También puedes usar entradas en el archivo hosts de tus dispositivos para que apunten a tu servidor DNS local. Si usas macOS, puedes editar `/etc/hosts` para añadir entradas como `192.168.1.100 dashboard.homelab.local`. Para Windows, edita `C:\Windows\System32\drivers\etc\hosts`. Esto debe hacerse en cada dispositivo que vaya a acceder a tus servicios locales.
- Dominio local (usaremos `homelab.local` en esta guía).

---

## Paso 1: Crea tu Entidad Certificadora Local

Primero, generamos una Root CA. Una vez que tus dispositivos confíen en esta raíz, confiarán en cualquier certificado firmado por ella.

```bash
# Crear estructura de directorios
mkdir -p ~/local-ca/{certs,private}

# Asegurar el directorio privado
chmod 700 ~/local-ca/private

# Generar clave privada de la CA (4096 bits para mejor seguridad)
openssl genrsa -out ~/local-ca/private/ca.key 4096

# Asegurar la clave privada
chmod 600 ~/local-ca/private/ca.key

# Generar certificado de la CA (válido por 10 años)
openssl req -x509 -new -nodes -key ~/local-ca/private/ca.key \
  -sha256 -days 3650 -out ~/local-ca/certs/ca.crt \
  -subj "/C=ES/ST=Estado/L=Ciudad/O=HomeLab/OU=IT/CN=HomeLab Root CA"
```

> **Nota de Seguridad:** La clave privada de la CA es el archivo más sensible. ¡Mantenla segura y nunca la compartas!

---

## Paso 2: Generar un Certificado Wildcard

Crearemos un certificado wildcard para `*.homelab.local` para cubrir todos los servicios actuales y futuros.

### 1. Crear la clave privada y el CSR

```bash
# Cambiar al directorio de la CA
cd ~/local-ca

# Generar clave privada de 4096 bits (coincidiendo con la fuerza de la CA)
openssl genrsa -out wildcard-homelab.key 4096

# Asegurar la clave
chmod 600 wildcard-homelab.key

# Crear la Solicitud de Firma de Certificado (CSR)
openssl req -new -key wildcard-homelab.key -out wildcard-homelab.csr \
  -subj "/C=ES/ST=Estado/L=Ciudad/O=HomeLab/OU=IT/CN=*.homelab.local"
```

### 2. Definir los Nombres Alternativos del Sujeto (SAN)

Los navegadores modernos requieren campos SAN para validar los certificados correctamente.

```bash
cat > wildcard-homelab.ext << 'EOF'
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.homelab.local
DNS.2 = homelab.local
EOF
```

### 3. Firmar el certificado

```bash
openssl x509 -req -in wildcard-homelab.csr \
  -CA ~/local-ca/certs/ca.crt \
  -CAkey ~/local-ca/private/ca.key \
  -CAcreateserial \
  -out wildcard-homelab.crt \
  -days 730 \
  -sha256 \
  -extfile wildcard-homelab.ext
```

### 4. Verificar el certificado

```bash
# Comprobar detalles del certificado
openssl x509 -in wildcard-homelab.crt -text -noout | grep -A1 "Subject Alternative Name"

# Verificar certificado contra la CA
openssl verify -CAfile ~/local-ca/certs/ca.crt wildcard-homelab.crt
```

Deberías ver tus SANs y un mensaje de verificación "OK".

---

## Paso 3: Configuración de Traefik v3 con Mejores Prácticas de Seguridad

### Estructura de Directorios

Crea la siguiente estructura para Traefik:

```bash
mkdir -p stacks/traefik/{configs,certs}
cd stacks/traefik

# Copiar certificados
cp ~/local-ca/wildcard-homelab.{crt,key} ./certs/
chmod 600 ./certs/wildcard-homelab.key
```

### 1. Archivo de Configuración TLS

**Ruta:** `stacks/traefik/configs/tls.yml`

```yaml
tls:
  certificates:
    - certFile: /certs/wildcard-homelab.crt
      keyFile: /certs/wildcard-homelab.key

  stores:
    default:
      defaultCertificate:
        certFile: /certs/wildcard-homelab.crt
        keyFile: /certs/wildcard-homelab.key
```

### 2. Configuración de Middlewares

**Ruta:** `stacks/traefik/configs/middlewares.yml`

```yaml
http:
  middlewares:
    # Encabezados de seguridad
    security-headers:
      headers:
        sslRedirect: true
        forceSTSHeader: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        customFrameOptionsValue: "SAMEORIGIN"

    # Redirección HTTPS
    https-redirect:
      redirectScheme:
        scheme: https
        permanent: true
```

### 3. Configuración de Docker Compose

**Ruta:** `stacks/traefik/docker-compose.yml`

```yaml
services:
  traefik:
    image: traefik:v3.6
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    command:
      # Proveedor Docker
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=traefik_proxy"

      # Proveedor de archivos para configuraciones
      - "--providers.file.directory=/configs/"
      - "--providers.file.watch=true"

      # Puntos de entrada (Entry points)
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.websecure.http.tls=true"

      # API y dashboard (opcional pero recomendado)
      - "--api.dashboard=true"
      - "--api.insecure=false"

      # Logs
      - "--log.level=INFO"
      - "--accesslog=true"

    ports:
      - "80:80"
      - "443:443"

    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./configs:/configs:ro
      - ./certs:/certs:ro

    networks:
      - traefik_proxy

    labels:
      # Habilitar Traefik para sí mismo (dashboard)
      - "traefik.enable=true"

      # Router del Dashboard
      - "traefik.http.routers.dashboard.rule=Host(`traefik.homelab.local`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=security-headers@file"

      # Servicio dummy (el dashboard no necesita uno, pero el proveedor Docker lo requiere)
      - "traefik.http.services.dashboard.loadbalancer.server.port=8080"

networks:
  traefik_proxy:
    name: traefik_proxy
    driver: bridge
```

---

## Paso 4: Ejemplo de Configuración de Servicio

Aquí tienes un ejemplo completo de un servicio detrás de Traefik:

```yaml
services:
  whoami:
    image: traefik/whoami
    container_name: whoami
    restart: unless-stopped
    networks:
      - traefik_proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(`whoami.homelab.local`)"
      - "traefik.http.routers.whoami.entrypoints=websecure"
      - "traefik.http.routers.whoami.tls=true"
      - "traefik.http.routers.whoami.middlewares=security-headers@file"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"

networks:
  traefik_proxy:
    external: true
```

---

## Paso 5: Confiar en la CA en tus Dispositivos

Instala el archivo `ca.crt` como una Raíz de Confianza (Trusted Root) en todos tus dispositivos para habilitar el "Candado Verde".

### Windows

1. Haz clic derecho en `ca.crt` → **Instalar certificado**.
2. Selecciona **Equipo local** → **Siguiente**.
3. Elige **Colocar todos los certificados en el siguiente almacén** → **Examinar**.
4. Selecciona **Entidades de certificación raíz de confianza** → **Aceptar**.
5. **Siguiente** → **Finalizar**.

### macOS

1. Abre **Acceso a Llaveros** (Keychain Access).
2. Arrastra `ca.crt` al llavero de **Sistema**.
3. Haz doble clic en el certificado.
4. Expande la sección **Confiar** (Trust).
5. Establece **Al utilizar este certificado** como **Confiar siempre**.
6. Cierra e introduce tu contraseña.

### Linux (Ubuntu/Debian)

```bash
sudo cp ~/local-ca/certs/ca.crt /usr/local/share/ca-certificates/homelab.crt
sudo update-ca-certificates
```

### Firefox (Todas las plataformas)

Firefox utiliza su propio almacén de certificados y no usa los del sistema.

1. Abre Firefox → **Ajustes** → **Privacidad & Seguridad**.
2. Desplázate hasta **Certificados** → **Ver certificados**.
3. Ve a la pestaña **Autoridades** → **Importar**.
4. Selecciona tu archivo `ca.crt`.
5. Marca **Confiar en esta CA para identificar sitios web**.
6. Haz clic en **Aceptar**.

---

## Paso 6: Configuración DNS

En tu servidor DNS (AdGuard Home, Pi-hole, etc.), crea reescrituras DNS:

### AdGuard Home

Ve a **Filtros** → **Reescrituras DNS** y añade:

```
*.homelab.local → 192.168.1.X  (IP de Traefik)
```

### Pi-hole

Añade a `/etc/dnsmasq.d/02-custom.conf`:

```
address=/homelab.local/192.168.1.X
```

Luego reinicia: `sudo systemctl restart pihole-FTL`

### Archivo hosts

Añade a `/etc/hosts`:

```
192.168.1.X servicio.homelab.local
```

---

## Resolución de Problemas

### Certificado No Confiable

**Problema:** El navegador sigue mostrando "No es seguro".

**Soluciones:**
1. Verifica que la CA esté instalada en el almacén correcto (Sistema, no Usuario).
2. Borra la caché del navegador y reinícialo.
3. Comprueba la cadena de certificados: `openssl s_client -connect servicio.homelab.local:443 -showcerts`.
4. Para Firefox, asegúrate de que la CA esté importada en el administrador de certificados de Firefox.

### DNS No Resuelve

**Problema:** No se puede llegar a `servicio.homelab.local`.

**Soluciones:**
1. Comprueba el servidor DNS: `nslookup servicio.homelab.local`.
2. Verifica que la regla de reescritura DNS esté activa.
3. Borra la caché DNS: `sudo systemd-resolve --flush-caches` (Linux) o `ipconfig /flushdns` (Windows).
4. Asegúrate de que tu dispositivo use tu servidor DNS local.

### Traefik No Enruta

**Problema:** Obtiene el certificado pero muestra un error 404.

**Soluciones:**
1. Revisa los logs de Traefik: `docker logs traefik`.
2. Verifica que las etiquetas (labels) del servicio sean correctas.
3. Asegúrate de que el servicio esté en la red `traefik_proxy`.
4. Revisa el dashboard de Traefik en `https://traefik.homelab.local`.

### Advertencias de Contenido Mixto

**Problema:** El sitio carga pero algunos recursos son HTTP.

**Solución:** Asegúrate de que todas las URLs internas usen HTTPS o rutas relativas.

---

## Renovación del Certificado

Tu certificado wildcard es válido por 2 años (730 días). Para renovar:

```bash
# 1. Crear nuevo CSR con la misma clave
cd ~/local-ca
openssl req -new -key wildcard-homelab.key -out wildcard-homelab.csr \
  -subj "/C=ES/ST=Estado/L=Ciudad/O=HomeLab/OU=IT/CN=*.homelab.local"

# 2. Firmar con la CA de nuevo
openssl x509 -req -in wildcard-homelab.csr \
  -CA ~/local-ca/certs/ca.crt \
  -CAkey ~/local-ca/private/ca.key \
  -CAcreateserial \
  -out wildcard-homelab.crt \
  -days 730 \
  -sha256 \
  -extfile wildcard-homelab.ext

# 3. Copiar a Traefik y recargar
cp wildcard-homelab.crt stacks/traefik/certs/
docker restart traefik
```

> **Consejo Pro:** ¡Ponte un recordatorio en el calendario 1 mes antes de la expiración!

---

## Consideraciones de Seguridad

### ✅ Mejores Prácticas

- **Nunca compartas la clave privada de tu CA** - Puede firmar certificados para cualquier dominio.
- **Usa contraseñas fuertes** - Protege cualquier sistema que almacene la clave de la CA.
- **Rota los certificados regularmente** - No esperes hasta la expiración.
- **Limita el uso de la CA** - Úsala solo para servicios internos.
- **Haz copias de seguridad seguras** - Mantén copias de seguridad cifradas de tu CA.

### ⚠️ Limitaciones

- **No para internet pública** - Esta configuración es solo para redes internas. No la uses en entornos de producción.
- **La confianza es manual** - Cada dispositivo debe confiar manualmente en tu CA.
- **Sin renovación automática** - A diferencia de Let's Encrypt, esto es manual.
- **Validación de certificados** - Las herramientas externas no reconocerán tu CA.

---

## Conclusión

Ahora tienes una configuración SSL para HomeLab lista para producción con:

- ✅ **Entidad Certificadora personalizada** con seguridad adecuada.
- ✅ **Cifrado de 4096 bits** tanto para la CA como para los certificados.
- ✅ **Certificado SSL wildcard** que cubre todos los servicios.
- ✅ **Traefik v3** con redirección automática a HTTPS.
- ✅ **Encabezados de seguridad** para una protección mejorada.
- ✅ **Ejemplo funcional** con acceso al dashboard.
- ✅ **Soporte multiplataforma**, incluyendo Firefox.
- ✅ **Guía de resolución de problemas** para fallos comunes.

Esta configuración proporciona **seguridad de nivel empresarial** para tus servicios internos manteniendo la comodidad de un único certificado wildcard. ¡Tu HomeLab ahora tiene el mismo nivel de protección SSL que los entornos de producción!

### Próximos Pasos

- Añade más servicios a tu `docker-compose.yml`.
- Explora los middlewares de Traefik (autenticación, limitación de tasa, etc.).
- Configura la monitorización para la expiración de certificados.
- Considera automatizar la renovación de certificados con scripts.

¡Feliz HomeLab-ing! 🚀🔒
