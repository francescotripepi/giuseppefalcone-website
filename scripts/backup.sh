#!/bin/bash
# Backup script for Giuseppe Falcone website database
# Run via cron: 0 2 * * * /opt/giuseppefalcone/scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/var/backups/giuseppefalcone"
S3_BUCKET="${S3_BACKUP_BUCKET:-giuseppefalcone-backups}"
RETENTION_DAYS=14
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="db_backup_${DATE}.sql.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get database password from environment or docker secrets
PGPASSWORD="${POSTGRES_PASSWORD}"

# Dump database
echo "Creating database backup..."
docker exec giuseppefalcone-db pg_dump -U postgres giuseppefalcone | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Upload to S3 (encrypted)
echo "Uploading to S3..."
aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" "s3://${S3_BUCKET}/backups/${BACKUP_FILE}" --sse AES256

# Clean up old local backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Clean up old S3 backups (using lifecycle rules is preferred, but this is a fallback)
aws s3 ls "s3://${S3_BUCKET}/backups/" | while read -r line; do
  createDate=$(echo "$line" | awk '{print $1" "$2}')
  createDate=$(date -d "$createDate" +%s)
  olderThan=$(date -d "-${RETENTION_DAYS} days" +%s)
  if [[ $createDate -lt $olderThan ]]; then
    fileName=$(echo "$line" | awk '{print $4}')
    if [[ $fileName != "" ]]; then
      aws s3 rm "s3://${S3_BUCKET}/backups/$fileName"
    fi
  fi
done

echo "Backup completed: ${BACKUP_FILE}"
