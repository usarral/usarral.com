---
title: "HomeLab SSL with Traefik v3 and Local CA"
description: "Learn how to eliminate browser security warnings in your HomeLab by setting up a custom Certificate Authority and configuring Traefik v3 with a wildcard certificate."
pinned: true
publishDate: 2026-02-07
tags: ["homelab", "traefik", "ssl", "security", "docker", "devops"]
draft: false
---

# HomeLab SSL Made Easy: Traefik v3 & Local CA Guide

Tired of seeing "Your connection is not private" every time you access your local dashboard? While services like Let's Encrypt are great for public-facing sites, securing internal-only services requires a different approach.

In this guide, we will create a private **Certificate Authority (CA)** and configure **Traefik v3** to serve a wildcard certificate for your entire local domain (e.g., `*.homelab.local`).

> **📦 Complete Working Example:** All the scripts and configuration files from this guide are available in the [traefik-ssl-demo repository](https://github.com/blogusarral/traefik-ssl-demo-homelab). Clone it and get started in minutes!

---

## Prerequisites

- Docker and Docker Compose installed
- Basic understanding of DNS and certificates
- A local DNS server (AdGuard Home, Pi-hole, or similar)
  - If your router has a built-in DNS server, you can use it instead of setting up a separate one.
  - You can also use host file entries on your devices to point to your local DNS server. If you're using macOS, you can edit `/etc/hosts` to add entries like `192.168.1.100 dashboard.homelab.local`. For Windows, edit `C:\Windows\System32\drivers\etc\hosts`. It must be done on each device that will access your local services.
- Local domain (we'll use `homelab.local` in this guide)

---

## Step 1: Create your Local Certificate Authority

First, we generate a Root CA. Once your devices trust this root, they will trust any certificate signed by it.

```bash
# Create directory structure
mkdir -p ~/local-ca/{certs,private}

# Secure the private directory
chmod 700 ~/local-ca/private

# Generate CA private key (4096 bits for better security)
openssl genrsa -out ~/local-ca/private/ca.key 4096

# Secure the private key
chmod 600 ~/local-ca/private/ca.key

# Generate CA certificate (valid for 10 years)
openssl req -x509 -new -nodes -key ~/local-ca/private/ca.key \
  -sha256 -days 3650 -out ~/local-ca/certs/ca.crt \
  -subj "/C=ES/ST=State/L=City/O=HomeLab/OU=IT/CN=HomeLab Root CA"
```

> **Security Note:** The CA private key is the most sensitive file. Keep it secure and never share it!

---

## Step 2: Generate a Wildcard Certificate

We'll create one wildcard certificate for `*.homelab.local` to cover all current and future services.

### 1. Create the private key and CSR

```bash
# Change to the CA directory
cd ~/local-ca

# Generate 4096-bit private key (matching CA strength)
openssl genrsa -out wildcard-homelab.key 4096

# Secure the key
chmod 600 wildcard-homelab.key

# Create Certificate Signing Request
openssl req -new -key wildcard-homelab.key -out wildcard-homelab.csr \
  -subj "/C=ES/ST=State/L=City/O=HomeLab/OU=IT/CN=*.homelab.local"
```

### 2. Define Subject Alternative Names (SAN)

Modern browsers require SAN fields to validate certificates properly.

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

### 3. Sign the certificate

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

### 4. Verify the certificate

```bash
# Check certificate details
openssl x509 -in wildcard-homelab.crt -text -noout | grep -A1 "Subject Alternative Name"

# Verify certificate against CA
openssl verify -CAfile ~/local-ca/certs/ca.crt wildcard-homelab.crt
```

You should see your SANs and a "OK" verification message.

---

## Step 3: Traefik v3 Setup with Security Best Practices

### Directory Structure

Create the following structure for Traefik:

```bash
mkdir -p stacks/traefik/{configs,certs}
cd stacks/traefik

# Copy certificates
cp ~/local-ca/wildcard-homelab.{crt,key} ./certs/
chmod 600 ./certs/wildcard-homelab.key
```

### 1. TLS Configuration File

**Path:** `stacks/traefik/configs/tls.yml`

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

### 2. Middlewares Configuration

**Path:** `stacks/traefik/configs/middlewares.yml`

```yaml
http:
  middlewares:
    # Security headers
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

    # HTTPS redirect
    https-redirect:
      redirectScheme:
        scheme: https
        permanent: true
```

### 3. Docker Compose Setup

**Path:** `stacks/traefik/docker-compose.yml`

```yaml
services:
  traefik:
    image: traefik:v3.6
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    command:
      # Docker provider
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=traefik_proxy"

      # File provider for configs
      - "--providers.file.directory=/configs/"
      - "--providers.file.watch=true"

      # Entry points
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.websecure.http.tls=true"

      # API and dashboard (optional but recommended)
      - "--api.dashboard=true"
      - "--api.insecure=false"

      # Logging
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
      # Enable Traefik for itself (dashboard)
      - "traefik.enable=true"

      # Dashboard router
      - "traefik.http.routers.dashboard.rule=Host(`traefik.homelab.local`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=security-headers@file"

      # Dummy service (dashboard doesn't need one, but Docker provider requires it)
      - "traefik.http.services.dashboard.loadbalancer.server.port=8080"

networks:
  traefik_proxy:
    name: traefik_proxy
    driver: bridge
```

---

## Step 4: Example Service Configuration

Here's a complete example of a service behind Traefik:

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

## Step 5: Trust the CA on your Devices

Install the `ca.crt` file as a Trusted Root on all your devices to enable the "Green Lock".

### Windows

1. Right-click `ca.crt` → **Install Certificate**
2. Select **Local Machine** → **Next**
3. Choose **Place all certificates in the following store** → **Browse**
4. Select **Trusted Root Certification Authorities** → **OK**
5. **Next** → **Finish**

### macOS

1. Open **Keychain Access**
2. Drag `ca.crt` into the **System** keychain
3. Double-click the certificate
4. Expand **Trust** section
5. Set **When using this certificate** to **Always Trust**
6. Close and enter your password

### Linux (Ubuntu/Debian)

```bash
sudo cp ~/local-ca/certs/ca.crt /usr/local/share/ca-certificates/homelab.crt
sudo update-ca-certificates
```

### Firefox (All Platforms)

Firefox uses its own certificate store and doesn't use the system certificates.

1. Open Firefox → **Settings** → **Privacy & Security**
2. Scroll to **Certificates** → **View Certificates**
3. Go to **Authorities** tab → **Import**
4. Select your `ca.crt` file
5. Check **Trust this CA to identify websites**
6. Click **OK**

---

## Step 6: DNS Configuration

In your DNS server (AdGuard Home, Pi-hole, etc.), create DNS rewrites:

### AdGuard Home

Go to **Filters** → **DNS rewrites** and add:

```
*.homelab.local → 192.168.1.X  (Traefik IP)
```

### Pi-hole

Add to `/etc/dnsmasq.d/02-custom.conf`:

```
address=/homelab.local/192.168.1.X
```

Then restart: `sudo systemctl restart pihole-FTL`

### Host file

Add to `/etc/hosts`:

```
192.168.1.X service.homelab.local
```

---

## Troubleshooting

### Certificate Not Trusted

**Problem:** Browser still shows "Not Secure"

**Solutions:**
1. Verify CA is installed in correct store (System, not User)
2. Clear browser cache and restart browser
3. Check certificate chain: `openssl s_client -connect service.homelab.local:443 -showcerts`
4. For Firefox, ensure CA is imported in Firefox's certificate manager

### DNS Not Resolving

**Problem:** Can't reach `service.homelab.local`

**Solutions:**
1. Check DNS server: `nslookup service.homelab.local`
2. Verify DNS rewrite rule is active
3. Clear DNS cache: `sudo systemd-resolve --flush-caches` (Linux) or `ipconfig /flushdns` (Windows)
4. Ensure your device uses your local DNS server

### Traefik Not Routing

**Problem:** Gets certificate but shows 404

**Solutions:**
1. Check Traefik logs: `docker logs traefik`
2. Verify service labels are correct
3. Ensure service is on `traefik_proxy` network
4. Check Traefik dashboard at `https://traefik.homelab.local`

### Mixed Content Warnings

**Problem:** Site loads but some resources are HTTP

**Solution:** Ensure all internal URLs use HTTPS or relative paths

---

## Certificate Renewal

Your wildcard certificate is valid for 2 years (730 days). To renew:

```bash
# 1. Create new CSR with same key
cd ~/local-ca
openssl req -new -key wildcard-homelab.key -out wildcard-homelab.csr \
  -subj "/C=ES/ST=State/L=City/O=HomeLab/OU=IT/CN=*.homelab.local"

# 2. Sign with CA again
openssl x509 -req -in wildcard-homelab.csr \
  -CA ~/local-ca/certs/ca.crt \
  -CAkey ~/local-ca/private/ca.key \
  -CAcreateserial \
  -out wildcard-homelab.crt \
  -days 730 \
  -sha256 \
  -extfile wildcard-homelab.ext

# 3. Copy to Traefik and reload
cp wildcard-homelab.crt stacks/traefik/certs/
docker restart traefik
```

> **Pro Tip:** Set a calendar reminder 1 month before expiration!

---

## Security Considerations

### ✅ Best Practices

- **Never share your CA private key** - It can sign certificates for any domain
- **Use strong passwords** - Protect any system storing the CA key
- **Rotate certificates regularly** - Don't wait until expiration
- **Limit CA usage** - Only use it for internal services
- **Backup securely** - Keep encrypted backups of your CA

### ⚠️ Limitations

- **Not for public internet** - This setup is for internal networks only. Don't use it on production environments.
- **Trust is manual** - Each device must manually trust your CA
- **No automatic renewal** - Unlike Let's Encrypt, this is manual
- **Certificate validation** - External tools won't recognize your CA

---

## Conclusion

You now have a production-ready HomeLab SSL setup with:

- ✅ **Custom Certificate Authority** with proper security
- ✅ **4096-bit encryption** for both CA and certificates
- ✅ **Wildcard SSL certificate** covering all services
- ✅ **Traefik v3** with automatic HTTPS redirection
- ✅ **Security headers** for enhanced protection
- ✅ **Working example** with dashboard access
- ✅ **Multi-platform support** including Firefox
- ✅ **Troubleshooting guide** for common issues

This setup provides **enterprise-grade security** for your internal services while maintaining the convenience of a single wildcard certificate. Your HomeLab now has the same level of SSL protection as production environments!

### Next Steps

- Add more services to your `docker-compose.yml`
- Explore Traefik middlewares (authentication, rate limiting, etc.)
- Set up monitoring for certificate expiration
- Consider automating certificate renewal with scripts

Happy HomeLab-ing! 🚀🔒
