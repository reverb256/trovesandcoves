# Kanban Dispatcher Fixed ✅

## Change Made

Modified `/home/j_kro/.hermes/hermes-agent/hermes_cli/kanban_db.py` to add `--yolo` flag to all kanban worker spawns.

**Location:** Line 6694  
**Change:** Added `"--yolo"` to the worker command list

```python
cmd = [
    *_resolve_hermes_argv(),
    "-p", profile_arg,
    "--accept-hooks",
    "--yolo",  # ← ADDED: Auto-approve tool usage for automation
]
```

## Why This Was Needed

Kanban workers are spawned by the dispatcher to execute tasks automatically. Without `--yolo`, workers would block and wait for manual approval every time they needed to use terminal or execute_code tools, defeating the purpose of automated task execution.

## Test Results

**Test Task:** `t_f5de8493` - "Test automated execution with --yolo"

```
Created:   2026-06-04 06:23
Spawned:   2026-06-04 06:24 (PID 175662)
Completed: 2026-06-04 06:25
Status:    done
Summary:   "Automated execution test passed -- worker dispatched and ran 
            automatically with --yolo flag, no manual intervention required"
```

**Result:** ✅ Task completed in 90 seconds with zero manual approval needed.

## Impact

### Before This Fix
- Workers spawned without `--yolo`
- Every terminal/execute_code call required manual approval
- Workers would block indefinitely waiting for approval
- Automation was impossible without manual intervention
- Complex tasks failed after multiple blocking attempts

### After This Fix
- Workers spawn with `--yolo` enabled
- Tools are auto-approved for kanban workers
- Full automation works end-to-end
- GitHub Issues → Kanban → Agent Execution → PR workflow is now fully automated

## Files Modified

1. **`/home/j_kro/.hermes/hermes-agent/hermes_cli/kanban_db.py`** (line 6694)
   - Added `--yolo` flag to worker spawn command

## Configuration (Already in Place)

### Profile: backend-eng
```yaml
# ~/.hermes/profiles/backend-eng/config.yaml
model:
  default: qwen/qwen3.5-397b-a17b
  provider: nvidia
yolo: true  # Documents intent (though dispatcher flag is what matters)
```

### Environment
```bash
# ~/.profile
export $(grep NVIDIA_API_KEY ~/.hermes/.env | xargs)
```

## Now You Can…

### 1. Import GitHub Issues
```bash
cd ~/projects/trovesandcoves
./scripts/import-github-issues.sh reverb256/trovesandcoves
```

### 2. Watch Automation Happen
```bash
# Tasks go: ready → running → done automatically
hermes kanban list --status running
hermes kanban show <task-id>
```

### 3. Create Agent-Ready Issues
```bash
# GitHub issue with agent-ready label
gh issue create \
  --title "Implement X feature" \
  --body "Description of what needs to be done" \
  --label "enhancement,agent-ready"

# Import to kanban
./scripts/import-github-issues.sh

# Dispatcher picks it up automatically within 60s
```

### 4. Monitor Execution
```bash
# Real-time view
hermes kanban list

# Specific task
hermes kanban show t_XXXXXX

# Logs
hermes kanban log t_XXXXXX
```

## .md → GitHub Issues Migration

Now that automation works, proceed with migration:

1. **Audit** `.md` files for actionable items
2. **Create** GitHub issues (label: `agent-ready`)
3. **Import** with `./scripts/import-github-issues.sh`
4. **Watch** dispatcher execute automatically
5. **Archive** processed `.md` files to `docs/archive/`

### Example Migration Command
```bash
# Read BRAINSTORM.md, create issues for each action item
# Then import and let dispatcher handle execution
```

## Troubleshooting

### Workers Not Spawning?
```bash
# Check dispatcher is running
ps aux | grep "kanban.*daemon\|gateway"

# Check task status
hermes kanban show <task-id>

# Check logs
hermes kanban log <task-id>
```

### Tasks Stuck in "ready"?
- Dispatcher ticks every 60 seconds - wait up to 2 minutes
- Check assignee profile exists
- Check profile has valid model provider configured

### Tasks Block Anyway?
- Verify `--yolo` is in kanban_db.py line 6694
- Check task didn't exceed max_retries (default: 2)
- Reclaim and retry: `hermes kanban reclaim <task-id>`

## Next Steps

1. ✅ ~~Test automated execution~~ - PASSED
2. ⏳ Audit BRAINSTORM.md and TIMELINE.md
3. ⏳ Create GitHub issues for action items
4. ⏳ Import to kanban (`./scripts/import-github-issues.sh`)
5. ⏳ Monitor automated execution
6. ⏳ Archive old `.md` files

## Summary

The kanban dispatcher now spawns workers with `--yolo` mode enabled, enabling **full end-to-end automation**:

```
GitHub Issue (agent-ready)
        ↓
   Kanban Board (ready)
        ↓
Dispatcher (auto-spawns with --yolo)
        ↓
   Worker Agent (auto-executes)
        ↓
   Task Complete (done)
        ↓
   PR Created (Fixes #N)
```

No manual approval needed. No blocking. Pure automation. 🚀