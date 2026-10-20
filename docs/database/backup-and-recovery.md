# Craftlane — Backup and Recovery

This document describes backup, restoration, and disaster recovery procedures
for the Craftlane PostgreSQL database.

## Backup Strategy

### Frequency

- **Full database dump**: Daily, during off-peak hours.
- **Schema-only dump**: Weekly, to capture schema drift.
- **Before migrations**: Always take a backup before applying production migrations.

### Retention

- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 3 months

Adjust based on operational requirements and compliance obligations.

## Backup Commands

### Full Database Backup

```bash
pg_dump -h <host> -p <port> -U <user> -d craftlane > craftlane_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Compressed Backup

```bash
pg_dump -h <host> -p <port> -U <user> -d craftlane | gzip > craftlane_backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Schema-Only Backup

```bash
pg_dump -h <host> -p <port> -U <user> -s -d craftlane > craftlane_schema_$(date +%Y%m%d).sql
```

## Restoration

### From Full Backup

```bash
# Create the database if it doesn't exist
createdb -h <host> -p <port> -U <user> craftlane

# Restore
psql -h <host> -p <port> -U <user> -d craftlane < craftlane_backup_*.sql
```

### From Compressed Backup

```bash
gunzip < craftlane_backup_*.sql.gz | psql -h <host> -p <port> -U <user> -d craftlane
```

## Disaster Recovery

1. Provision a new PostgreSQL instance.
2. Restore the most recent full backup.
3. Apply any pending migrations:

   ```bash
   cd backend
   npm run prisma:migrate:deploy
   ```

4. Verify application connectivity and data integrity.
5. Update DNS/application configuration to point to the restored database.

## Testing Restoration

Restoration procedures should be tested periodically (at least quarterly)
against a staging environment to verify backup integrity and recovery time.

## Automation

Backups should be automated using `cron`, a managed backup service, or
the database platform's built-in backup functionality. Backup files should
be stored offsite (e.g., object storage) and encrypted at rest.

## Migration Safety

Never apply production migrations without a recent backup. If a migration
fails:

1. Restore from the pre-migration backup.
2. Investigate the failure.
3. Fix the migration SQL or schema.
4. Re-apply after confirming the fix.
