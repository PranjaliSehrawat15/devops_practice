# On-Call Assistant Workflow Setup

## Overview
The On-Call Assistant workflow integrates SenseTheLog to analyze CI failures across multiple jobs, detect recurring bugs, and post insights directly to pull requests.

## Files Created
- `.github/workflows/on-call-assistant.yaml` - Main workflow
- `app/.eslintrc.js` - ESLint configuration
- `app/package.json` - Updated with lint script and ESLint dependency

## Required Setup

### 1. Set Repository Secret: SENSETHELOG_API_KEY

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name:** `SENSETHELOG_API_KEY`
5. **Value:** Your SenseTheLog API key (get it from SenseTheLog dashboard)
6. Click **Add secret**

### 2. Permissions

The workflow has minimal required permissions:
```yaml
permissions:
  contents: read              # Checkout code
  checks: read                # Read workflow run logs
  statuses: read              # Read run statuses
  pull-requests: write        # Post comments on PRs
```

## Workflow Structure

### Job 1: Lint
- Runs independently
- Executes: `npm run lint` in app folder
- Uses ESLint to check code quality

### Job 2: Test
- Runs independently (parallel with lint)
- Executes: `npm test` in app folder
- Uses Jest for unit tests

### Job 3: Build
- Runs independently (parallel with lint & test)
- Executes: `npm run build` in app folder

### Job 4: Analyze
- Runs **only if at least one job failed** (`if: failure()`)
- Uses SenseTheLog action to analyze all failed jobs in one pass
- Outputs:
  - `is_recurring` - Boolean: has this bug happened before?
  - `error_signature` - String: unique identifier for this error
- Prints analysis results

### Job 5: Notify on Recurrence
- Runs **only if analyze found is_recurring == true**
- Prints warning that failure is recurring and should be prioritized

## Testing Scenarios

### Run 1: All Jobs Pass (PR)
- Create a branch and PR with no errors
- Expected: lint, test, build pass → analyze is **skipped** ✓
- Visible in: Run summary shows analyze job skipped

### Run 2: Break Test Only (PR)
- Add a failing test to `app/server.test.js`
- Push to PR
- Expected: lint & build pass, test fails → analyze runs → SenseTheLog posts comment on PR
- Check: PR comments section for SenseTheLog analysis

### Run 3: Break Lint and Test (PR)
- Add a linting error AND test failure
- Push to PR
- Expected: analyze analyzes **both** failed jobs in one job (not separate jobs)
- Visible in: Run summary shows single analyze job that covered multiple failures

### Run 4: Fix Lint and Test (PR)
- Fix both lint and test errors
- Push to PR
- Expected: all jobs pass → analyze skipped
- Check: PR comment from SenseTheLog updates (doesn't add new comment)

### Run 5: Reintroduce Same Bug on New PR
- Create new branch with different name
- Introduce same test failure as Run 2
- Open new PR
- Expected: test fails → analyze runs → is_recurring = **true** → notify-on-recurrence runs
- Visible in: notify-on-recurrence prints "priority fix" message

### Run 6: Break Build on Direct Push to Main
- Push commit directly to main (no PR) that breaks build
- Expected: build fails → analyze runs → SenseTheLog adds to run comments (not PR comment since no PR)
- Visible in: Workflow run summary shows SenseTheLog output

## Testing Checklist

For each run, record:
1. **Run URL** - From Actions tab
2. **What SenseTheLog did** - Posted comment? Analyzed multiple jobs? Detected recurrence?
3. **Why** - Explain the behavior based on conditions

## Example Script to Test

To break test:
```bash
cd app
# Add to server.test.js:
it('should fail', () => {
  expect(true).toBe(false);
});
```

To break lint:
```bash
cd app
# Add to server.js:
var unusedVar = 123;  // ESLint error: unused variable
```

To break build:
```bash
cd app
# In server.js, cause a syntax error:
const app = require('express' // missing closing paren
```

## Notes

- All job steps run in `./app` folder without repeating `cd`
- Three jobs run independently in parallel
- Analyze only runs if at least one job failed
- SenseTheLog detects if failure is new or recurring
- For PRs: comments appear in PR
- For pushes to main: analysis appears in workflow run
