# Kanban Board Status — Troves & Coves

## Current Status: ⚠️ BLOCKED (Provider Issue)

### Board Inventory
| Task ID | Title | Status | Assignee | Issue |
|---------|-------|--------|----------|-------|
| t_27a7847c | [ROBUSTNESS UPGRADE / P1] Bring E-Commerce Site to MapleSpike Standards | blocked → unblocked | backend-eng | Z.AI provider out of credits |

### Root Cause
The `backend-eng` profile attempted to execute the task but failed because:
1. Profile defaulted to Z.AI provider (glm-5.1 model)
2. Z.AI account has **no balance/credits** (HTTP 429 error)
3. Worker exited without calling `kanban_complete()` or `kanban_block()` → protocol violation
4. Task marked as `blocked` after 2 failed attempts

### What Works ✓
- Kanban board itself is **fully functional**
- GitHub issue ingestion script created and tested
- Task creation with idempotency keys works
- Board switching and task management works
- Event logging and diagnostics work

### What's Broken ✗
- **No working model provider configured** for agent execution:
  - `zai` (ZhipuAI): Out of credits
  - `nvidia`: No API key set (NVIDIA_API_KEY not in environment)
  - `context7`: Available but not configured as default
  
### Available API Keys
```
ZAI_API_KEY=set (but out of credits)
CONTEXT7_API_KEY=ctx7sk-8cf263ab-084d-... (available)
LOCALMAXXING_API_KEY=bhk_76... (available)
```

## Solutions

### Option 1: Recharge Z.AI Account (Recommended for production)
```bash
# Add credits to Z.AI account, then:
hermes kanban reclaim t_27a7847c
# Task will auto-execute on next dispatcher cycle
```

### Option 2: Switch to CONTEXT7 Provider
```bash
# Configure backend-eng profile to use context7
hermes -p backend-eng model context7/context7 --provider context7

# Then reclaim and retry
hermes kanban reclaim t_27a7847c
```

### Option 3: Set NVIDIA API Key
```bash
# Add to ~/.hermes/.env or system environment
export NVIDIA_API_KEY="nvapi-..."

# Then reclaim
hermes kanban reclaim t_27a7847c
```

### Option 4: Manual Execution with Available Provider
```bash
# Execute task directly with CONTEXT7
cd ~/projects/trovesandcoves
hermes -p backend-eng -m context7/context7 --provider context7 \
  --skills maplespike,drizzle-schema-fix \
  -z "Execute task t_27a7847c: [task body]"
  
# Then manually complete
hermes kanban complete t_27a7847c --summary "Implemented X, Y, Z"
```

## Automated Workflow Status

### GitHub → Kanban Ingestion ✓
- Script: `scripts/import-github-issues.sh` (created, executable)
- Imports open issues with idempotency keys
- Maps labels to assignee profiles
- Prevents duplicates

### Kanban → Execution ⚠️ BLOCKED
- Needs working model provider
- Once provider is fixed, workers will auto-execute via dispatcher
- Or use cronjob pattern for scheduled execution

### Execution → PR ✓ (design)
- Workers create feature branches
- Implement changes
- Open PR with `Fixes #N` in body
- Complete kanban task with PR number

### PR → Deploy ✓ (existing workflow)
- Cherry-pick to prod branch
- Deploy to GitHub Pages

## Files Created
1. `KANBAN-WORKFLOW.md` — Complete workflow documentation
2. `scripts/import-github-issues.sh` — GitHub issue ingestion
3. `scripts/execute-kanban-task.sh` — Manual task execution helper
4. `.github/workflows/kanban-ingest.yml` — Automated issue import on GitHub events

## Next Actions

### Immediate (Unblock Current Task)
1. **Choose a provider**: Recharge Z.AI OR switch to CONTEXT7 OR get NVIDIA key
2. **Reclaim task**: `hermes kanban reclaim t_27a7847c`
3. **Execute**: Either auto (dispatcher picks up) or manual (execute-kanban-task.sh)
4. **Complete**: `hermes kanban complete t_27a7847c --summary "..."`

### Short-term (Automation)
1. **Configure provider** for all profiles (backend-eng, frontend-eng, etc.)
2. **Test full cycle**: Issue → Kanban → Execute → PR → Merge
3. **Set up cronjob**: `hermes cronjob create --schedule "30m" ...`
4. **Add GitHub Action**: Already created (`kanban-ingest.yml`), needs HERMES_API_KEY secret

### Long-term (MD → GH Issues Migration)
1. **Audit existing .md plans**: Find all TODOs, plans, specs in .md files
2. **Convert to GitHub issues**: One issue per actionable item
3. **Import with script**: `./scripts/import-github-issues.sh`
4. **Decompose epics**: Break down large issues into executable tasks
5. **Archive old .md files**: Move to `docs/archive/` after conversion

## Provider Configuration Commands

```bash
# Check current provider for a profile
hermes -p backend-eng config get model

# Set provider (examples)
hermes -p backend-eng model context7/context7 --provider context7
hermes -p backend-eng model glm-5.1 --provider zai  # requires Z.AI credits
hermes -p backend-eng model qwen/qwen3.5-397b-a17b --provider nvidia  # requires NVIDIA key

# Verify
hermes -p backend-eng -z "test" 2>&1 | head -5
```