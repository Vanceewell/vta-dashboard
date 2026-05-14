# May 11, 2026 - OMNIS Email Recovery Session

## Situation
- Website migrated to Vercel (working)
- New Hostinger mailbox set up (receiving new emails)
- Old historical emails disconnected from OMNIS after DNS/MX changes
- Goal: Recover old emails safely without disrupting current setup

## Key Facts
- **Previous Email Provider:** OMNIS (hosting + email)
- **Current Email Provider:** Hostinger (new, working)
- **Email Account:** jason@jasonsglasstint.com
- **Status:** Old emails NOT deleted - still on OMNIS servers, just unreachable
- **Root Cause:** DNS migration broke connection to old mail server

## Recovery Strategy
Safe, 14-step process:
1. Access OMNIS customer portal
2. Access cPanel
3. Verify jason@jasonsglasstint.com exists
4. Get IMAP/SMTP details
5. Access OMNIS webmail
6. Backup/export emails (3 options: webmail export, Outlook, or Gmail)
7. Verify backup file
8. Prepare Hostinger import
9. Import backup to Hostinger
10. Verify import complete
11. Test send/receive
12. Final verification
13. Optional cleanup

## Documents Created
- `/tmp/OMNIS_STEP_BY_STEP_RECOVERY.md` - Complete 14-step guide with detailed instructions
- Includes troubleshooting section
- Includes success checklist

## Critical Guidelines
- ✅ DO: Follow steps 1-14 in order
- ✅ DO: Back up OMNIS emails before importing
- ✅ DO: Verify Hostinger account before importing
- ✅ DO: Keep OMNIS account active for 30-60 days as backup
- ❌ DO NOT: Change Vercel DNS
- ❌ DO NOT: Delete Hostinger mailbox
- ❌ DO NOT: Delete OMNIS mailbox immediately
- ❌ DO NOT: Overwrite - merge instead

## Timeline
- Step 1-3: 10-15 minutes (access OMNIS)
- Step 4-6: 5-10 minutes (verify email exists)
- Step 7: 30 minutes (backup emails)
- Step 8-9: 5 minutes (prepare Hostinger)
- Step 10-11: 30 minutes (import + verify)
- Step 12-13: 10 minutes (test everything)
- **Total: ~1-2 hours**

## Success Rate
- **Most Likely (95%+):** Full recovery, all emails restored
- **Moderate (4%):** OMNIS account suspended, needs reactivation
- **Unlikely (1%):** Data loss, but OMNIS usually has 30-day backups

## Next Action
User will follow the 14-step guide starting with OMNIS portal access. Will report back on progress at each major step (1, 4, 6, 10, 13).
