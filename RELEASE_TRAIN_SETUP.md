# Release Train Pipeline - Setup Instructions

## Overview
This repository implements a GitHub Actions Release Train pipeline with three automated jobs: **verify**, **package**, and **announce**.

## Files Created

- `.github/workflows/release-train.yaml` - Main workflow file
- `app/` - Node.js service application
  - `package.json` - Dependencies and scripts
  - `server.js` - Express server
  - `server.test.js` - Test file
  - `jest.config.js` - Jest configuration
  - `README.md` - App documentation

## Configuration Required

### 1. Repository Variable (DEPLOYMENT_TARGET)

This must be created in the GitHub interface:

1. Go to your repository on GitHub
2. Click **Settings** → **Variables** → **Repository variables**
3. Click **New repository variable**
4. Name: `DEPLOYMENT_TARGET`
5. Value: Enter your deployment target (e.g., `prod.example.com`, `production`, or similar)
6. Click **Add variable**

This value is used in the pipeline and can be changed without editing the workflow file.

### 2. Workflow Variable (SERVICE_NAME)

This is already defined in the workflow file as:
```yaml
env:
  SERVICE_NAME: "node-service"
```

You can modify this in the workflow file if needed.

## Pipeline Triggers

The Release Train runs automatically in three situations:

1. **Pull Request**: When a PR is opened against `main` or new commits are pushed to an open PR
2. **Push to Main**: When code is pushed to the `main` branch
3. **Manual Trigger**: Via `workflow_dispatch` (manually trigger from the Actions tab)

## Jobs

### Job 1: Verify
- Runs on `ubuntu-latest`
- Checks out code and sets up Node.js 18
- Installs dependencies with `npm ci` (optimized for CI)
- Runs the test suite
- Prints Node version, npm version, and node binary location

### Job 2: Package
- Runs only after `verify` succeeds
- Generates a release reference: `{SERVICE_NAME}-{RUN_NUMBER}-{COMMIT_SHA_FIRST_7_CHARS}`
- Creates a `release` folder containing:
  - Metadata file named after the release reference
  - `manifest.json` with structured data
  - Copies of `package.json` and `README.md`
- Installs and uses `jq` to verify manifest.json is valid JSON
- Prints the release folder structure

### Job 3: Announce
- Runs only after `package` succeeds
- Prints:
  - Release reference
  - Deployment target
  - Service name
  - Different messages based on event type (candidate for PR, release for main push)
- Concludes with "✅ Release train complete"

## Running the Pipeline

### Test PR Trigger
1. Create a branch: `git checkout -b test-feature`
2. Make a change and commit: `git add . && git commit -m "Test change"`
3. Push and create a PR: `git push origin test-feature`
4. Open a PR against `main`
5. Go to **Actions** tab to see the workflow run

### Test Commit Push
1. Make another change on the test branch
2. Push to the PR: `git push`
3. Watch the workflow run with an updated run

### Test Main Push
1. Merge the PR to `main`
2. The workflow runs with a different announcement

### Manual Trigger
1. Go to **Actions** → **Release Train**
2. Click **Run workflow** → **Run workflow**

### Test Repository Variable Change
1. Update `DEPLOYMENT_TARGET` in Settings → Variables
2. Manually trigger the workflow
3. Observe the new deployment target in the output

### Break Tests
1. Modify `app/server.test.js` to make a test fail
2. Commit and push to trigger the workflow
3. The verify job will fail, stopping the pipeline

## Handoff

After setting up and testing, provide:
1. Repository URL
2. URLs of four successful runs (PR open, PR update, main push, variable change)
3. URL of failed test run
