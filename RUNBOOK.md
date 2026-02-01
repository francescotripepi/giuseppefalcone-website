# Giuseppe Falcone Website - Runbook

## Overview

- **Domain:** giuseppefalcone.com
- **Repository:** https://github.com/francescotripepi/giuseppefalcone-website
- **Stack:** Next.js 14 + PostgreSQL + Caddy + Docker
- **Hosting:** AWS Lightsail

---

## 1. AWS Infrastructure Provisioning

### 1.1 Create Lightsail Instance

```bash
# Create 2GB instance (sufficient for Docker + Postgres + Next.js)
aws lightsail create-instances \
  --instance-names giuseppefalcone-prod \
  --availability-zone us-east-1a \
  --blueprint-id ubuntu_22_04 \
  --bundle-id medium_3_0 \
  --key-pair-name giuseppefalcone-key

# Wait for instance to be running
aws lightsail get-instance --instance-name giuseppefalcone-prod

# Allocate and attach static IP
aws lightsail allocate-static-ip --static-ip-name giuseppefalcone-ip
aws lightsail attach-static-ip \
  --static-ip-name giuseppefalcone-ip \
  --instance-name giuseppefalcone-prod

# Open required ports
aws lightsail open-instance-public-ports \
  --instance-name giuseppefalcone-prod \
  --port-info fromPort=80,toPort=80,protocol=tcp

aws lightsail open-instance-public-ports \
  --instance-name giuseppefalcone-prod \
  --port-info fromPort=443,toPort=443,protocol=tcp
```

### 1.2 Create S3 Bucket + CloudFront

```bash
# Create S3 bucket for media
aws s3 mb s3://giuseppefalcone-media --region us-east-1

# Block public access (we'll use CloudFront)
aws s3api put-public-access-block \
  --bucket giuseppefalcone-media \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning for recovery
aws s3api put-bucket-versioning \
  --bucket giuseppefalcone-media \
  --versioning-configuration Status=Enabled

# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 1.3 Create Backup Bucket

```bash
aws s3 mb s3://giuseppefalcone-backups --region us-east-1

# Set lifecycle policy for backup retention
aws s3api put-bucket-lifecycle-configuration \
  --bucket giuseppefalcone-backups \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "DeleteOldBackups",
      "Status": "Enabled",
      "Filter": {"Prefix": "backups/"},
      "Expiration": {"Days": 30}
    }]
  }'
```

---

## 2. Server Setup

### 2.1 Connect and Install Dependencies

```bash
# Get the public IP
aws lightsail get-static-ip --static-ip-name giuseppefalcone-ip

# SSH into server (replace <IP> with actual IP)
ssh -i ~/.ssh/giuseppefalcone-key.pem ubuntu@<IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
sudo apt install -y awscli

# Install fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban

# Configure UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Logout and reconnect for docker group to take effect
exit
```

### 2.2 Deploy Application

```bash
# Clone repository
sudo mkdir -p /opt/giuseppefalcone
sudo chown ubuntu:ubuntu /opt/giuseppefalcone
cd /opt/giuseppefalcone
git clone git@github.com:francescotripepi/giuseppefalcone-website.git .

# Create production environment file
sudo nano /opt/giuseppefalcone/.env
```

Add the following to `.env`:

```env
# Database
POSTGRES_PASSWORD=<generate-strong-password>

# NextAuth
NEXTAUTH_URL=https://giuseppefalcone.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Admin (change after first login)
ADMIN_SEED_EMAIL=admin@giuseppefalcone.com
ADMIN_SEED_PASSWORD=<strong-initial-password>

# AWS
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=us-east-1
S3_BUCKET=giuseppefalcone-media
CLOUDFRONT_URL=https://d1234567890.cloudfront.net

# Site
SITE_URL=https://giuseppefalcone.com
DOMAIN=giuseppefalcone.com
```

```bash
# Set proper permissions
chmod 600 /opt/giuseppefalcone/.env

# Update Caddyfile with domain
sed -i 's/\$DOMAIN:localhost/giuseppefalcone.com/' Caddyfile

# Build and start containers
docker-compose up -d --build

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed admin user
docker-compose exec app npx tsx scripts/seed.ts

# Verify health
curl http://localhost:3000/api/health
```

---

## 3. DNS Configuration

Add these DNS records at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | <Lightsail-Static-IP> | 300 |
| A | www | <Lightsail-Static-IP> | 300 |
| CNAME | _acme-challenge | (auto by Caddy) | 300 |

---

## 4. Operations

### 4.1 Backup Database

Manual backup:
```bash
docker exec giuseppefalcone-db pg_dump -U postgres giuseppefalcone | gzip > backup_$(date +%Y%m%d).sql.gz
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://giuseppefalcone-backups/backups/
```

Automated (add to crontab):
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/giuseppefalcone/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### 4.2 Restore Database

```bash
# Download backup
aws s3 cp s3://giuseppefalcone-backups/backups/backup_YYYYMMDD.sql.gz .

# Restore
gunzip -c backup_YYYYMMDD.sql.gz | docker exec -i giuseppefalcone-db psql -U postgres giuseppefalcone
```

### 4.3 Deploy Updates

```bash
cd /opt/giuseppefalcone
./scripts/deploy.sh
```

### 4.4 View Logs

```bash
# Application logs
docker-compose logs -f app

# Caddy logs
docker-compose logs -f caddy

# Database logs
docker-compose logs -f postgres
```

### 4.5 Add Admin Users

Via database:
```bash
docker exec -it giuseppefalcone-db psql -U postgres giuseppefalcone

-- In psql:
INSERT INTO admin_users (id, email, password_hash, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'new@admin.com',
  -- Generate hash with: node -e "require('bcryptjs').hash('password', 12).then(console.log)"
  '<bcrypt-hash>',
  'New Admin',
  'ADMIN',
  NOW(),
  NOW()
);
```

### 4.6 Upload Videos/Media

1. Login to admin panel: https://giuseppefalcone.com/admin
2. Navigate to Media Library
3. Click Upload and select files
4. Files are automatically uploaded to S3 and records created

---

## 5. Monitoring

### Health Check
```bash
curl -s https://giuseppefalcone.com/api/health | jq
```

### Disk Usage
```bash
df -h
docker system df
```

### Container Status
```bash
docker-compose ps
```

---

## 6. Troubleshooting

### SSL Certificate Issues
```bash
# Restart Caddy to refresh certificate
docker-compose restart caddy
```

### Database Connection Issues
```bash
# Check postgres is running
docker-compose ps postgres

# Check connection
docker exec -it giuseppefalcone-db psql -U postgres -c "SELECT 1"
```

### Application Crashes
```bash
# Check logs
docker-compose logs --tail=100 app

# Restart application
docker-compose restart app
```

### Out of Memory
```bash
# Check memory usage
free -h
docker stats --no-stream

# Prune unused Docker resources
docker system prune -a
```

---

## 7. Security Checklist

- [ ] Change default admin password after first login
- [ ] Disable password SSH (use key-only)
- [ ] Keep system packages updated
- [ ] Monitor fail2ban bans: `sudo fail2ban-client status sshd`
- [ ] Review audit logs periodically in admin panel
- [ ] Rotate AWS credentials periodically
- [ ] Test backup restoration quarterly

---

## 8. Costs Estimate

| Service | Monthly Cost |
|---------|--------------|
| Lightsail 2GB | $12 |
| S3 (10GB estimated) | ~$0.25 |
| CloudFront (10GB transfer) | ~$1 |
| Domain | ~$1 (annual amortized) |
| **Total** | **~$15/month** |

---

## 9. Contact

For technical issues: Check GitHub Issues or repository documentation.
