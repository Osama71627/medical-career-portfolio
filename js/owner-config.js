/* ============================================================
   owner-config.js — the ONE owner password, baked into the site
   ============================================================
   This hash is the SAME for every visitor and every browser,
   because it ships as part of your deployed files — it is not
   saved per-device like the rest of the app's data.

   HOW TO CHANGE YOUR PASSWORD:
   1. Log in as owner on your site, open Settings & Backup.
   2. Use "Generate New Password Hash" — type your new password.
   3. It shows you a long hash value. Copy it.
   4. Paste it below, replacing the OWNER_PASSWORD_HASH value.
   5. Save this file, then commit + push (redeploy) your site.
   Nobody can change it without editing this file and redeploying —
   which only you can do, since only you control the repository.
   ============================================================ */
const OWNER_PASSWORD_HASH = "245bc97ec8d9d70c0a8c2c6048e6afea53965f080a86e9bf1b4130bf3b7af432";
