# GitHub Workflows - Setup Required

## ❌ Why Workflows Failed

The workflows are failing because **required configuration is missing**. Here's the complete setup:

---

## ✅ FIX 1: Set Repository Variables

Go to GitHub → Your Repository → **Settings** → **Variables** → **Repository variables**

Create these variables:

### Variable 1: DEPLOYMENT_TARGET (for Release Train)
- **Name:** `DEPLOYMENT_TARGET`
- **Value:** `production` (or any deployment target)
- Click **Add variable**

### Variable 2: RETENTION_DAYS (for Pipeline Archive)
- **Name:** `RETENTION_DAYS`
- **Value:** `30` (number of days to keep artifacts)
- Click **Add variable**

---

## ✅ FIX 2: Set Repository Secrets

Go to GitHub → Your Repository → **Settings** → **Secrets and variables** → **Actions**

Create this secret:

### Secret 1: SENSETHELOG_API_KEY (for On-Call Assistant)
- **Name:** `SENSETHELOG_API_KEY`
- **Value:** Your SenseTheLog API key (from https://sensethelog.com)
- Click **Add secret**

---

## ✅ FIX 3: Verify App Folder Setup

The `app/` folder needs these files (already created):
- ✓ `package.json` - with lint, test, build scripts
- ✓ `server.js` - Node.js service
- ✓ `server.test.js` - Jest tests
- ✓ `jest.config.js` - Jest config
- ✓ `.eslintrc.js` - ESLint config
- ✓ `.gitignore`

Install dependencies locally:
```bash
cd app
npm install
```

---

## ✅ FIX 4: Commit and Push

```bash
git add .
git commit -m "Configure workflows and add app setup"
git push origin main
```

---

## ✅ Workflow Dependencies Summary

| Workflow | Type | Variable/Secret | Example Value |
|----------|------|-----------------|----------------|
| Release Train | Variable | `DEPLOYMENT_TARGET` | `production` |
| Pipeline Archive | Variable | `RETENTION_DAYS` | `30` |
| On-Call Assistant | Secret | `SENSETHELOG_API_KEY` | API key from SenseTheLog |
| Incident Switchboard | None | - | - |
| Smart Dispatcher | None | - | - |

---

## ✅ Test Each Workflow

After setup, trigger each workflow:

1. **Release Train**: Push to main or open PR
2. **Incident Switchboard**: Go to Actions → Run workflow → select options
3. **Smart Dispatcher**: Go to Actions → Run workflow → select options
4. **Pipeline Archive**: Push to main or open PR
5. **On-Call Assistant**: Push to main or open PR

---

## 🔍 If Still Failing

Check workflow run logs:
1. Go to GitHub Actions
2. Click on failed run
3. Click on failed job
4. See error message in logs

Most common errors:
- `vars.DEPLOYMENT_TARGET is not defined` → Add repository variable
- `secrets.SENSETHELOG_API_KEY is not defined` → Add repository secret
- `npm: command not found` → Node.js setup issue
- `Can't find coverage folder` → Tests didn't run properly

---

## 📝 Note on Workflows

All 5 workflows are now created:
1. ✅ **Release Train** - Verify → Package → Announce
2. ✅ **Incident Switchboard** - Triage → Tests → Scan → Report
3. ✅ **Smart Dispatcher** - Classify → Gate → Execute → Close
4. ✅ **Pipeline Archive** - Test & Build → Verify Archive
5. ✅ **On-Call Assistant** - Lint → Test → Build → Analyze → Notify

Once you set the repository variables and secrets, all should work! 🚀
