# Troves & Coves — Kanban Board Working Setup

## Status: ✅ FUNCTIONAL (with manual --yolo flag)

The Hermes Kanban board is **working** for trovesandcoves GitHub issue automation, with one caveat: workers need the `--yolo` flag to auto-approve terminal commands.

## What Works

### 1. Board Management ✓
```bash
hermes kanban boards switch trovesandcoves
hermes kanban list
hermes kanban create "Task title" --assignee backend-eng --idempotency-key "gh-repo-N"
```

### 2. GitHub Issue Import ✓
```bash
./scripts/import-github-issues.sh reverb256/trovesandcoves
```
Imports all open issues with proper label→assignee mapping and idempotency keys.

### 3. Model Provider ✓
- **Provider**: NVIDIA NIM
- **Model**: `qwen/qwen3.5-397b-a17b`
- **API Key**: `NVIDIA_API_KEY` in ~/.hermes/.env
- **Profile**: backend-eng configured with NVIDIA provider

### 4. Task Lifecycle ✓
- Create → Ready → Running → Complete
- Heartbeat monitoring
- Event logging
- Protocol enforcement (kanban_complete/kanban_block)

## The Caveat: --yolo Flag Required

Kanban workers spawned by the dispatcher **do not** automatically have `--yolo` mode, so they block when needing terminal access.

### Current Workaround

**Option A: Manual Execution with --yolo**
```bash
cd ~/projects/trovesandcoves
hermes -p backend-eng --yolo --skills kanban-worker \
  -z "Execute task t_XXXX: [task description]"
```

**Option B: Fix the Dispatcher** (recommended for full automation)

Modify `~/.hermes/hermes-agent/hermes_cli/kanban.py` to add `--yolo` when spawning workers:

```python
# Find the subprocess call that spawns workers
# Add '--yolo' to the command list
cmd = ['hermes', '-p', profile, '--yolo', '--skills', 'kanban-worker', ...]
```

**Option C: Profile Config** (doesn't work - tried it)
Setting `yolo: true` in profile config.yaml doesn't propagate to spawned workers.

## Files Created

1. **`KANBAN-WORKFLOW.md`** — Complete workflow documentation
2. **`KANBAN-STATUS.md`** — Troubleshooting guide
3. **`scripts/import-github-issues.sh`** — GitHub → Kanban import script
4. **`scripts/execute-kanban-task.sh`** — Manual execution helper
5. **`.github/workflows/kanban-ingest.yml`** — Automated GitHub Action for issue import
6. **`KANBAN-WORKING-SETUP.md`** — This document

## Configuration

### Profile: backend-eng
```yaml
# ~/.hermes/profiles/backend-eng/config.yaml
model:
  default: qwen/qwen3.5-397b-a17b
  provider: nvidia
yolo: true  # Doesn't auto-propagate, but documents intent
```

### Environment
```bash
# ~/.profile (for persistence across sessions)
export $(grep NVIDIA_API_KEY ~/.hermes/.env | xargs)
```

### GitHub Issue → Kanban Mapping

| GitHub Label | Kanban Assignee | Skills |
|--------------|-----------------|--------|
| `backend`, `enhancement`, `feature` | `backend-eng` | maplespike, drizzle-schema-fix |
| `frontend`, `ui`, `design` | `frontend-eng` | astro, tailwind-design-system |
| `documentation`, `docs` | `writer` | writing, documentation-hygiene |
| `research` | `researcher` | (web search) |
| `security` | `security-eng` | nixos-cluster-security-audit |

## .md → GitHub Issues Migration Plan

Since you want to migrate from .md-based workflow to GitHub Issues + Kanban:

### Step 1: Audit .md Files
```bash
cd ~/projects/trovesandcoves
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*"
```

Current .md files:
- `README.md` — Keep (project overview)
- `CLAUDE.md` — Keep (agent guidance)  
- `BRAINSTORM.md` — Extract actionable items → GitHub issues
- `TIMELINE.md` — Extract milestones → GitHub issues
- `KANBAN-WORKFLOW.md` — Keep (workflow docs)
- `KANBAN-STATUS.md` — Keep (troubleshooting)
- `.github/ISSUE_TEMPLATE/*.md` — Keep (issue templates)

### Step 2: Extract Actionable Items
Read BRAINSTORM.md and TIMELINE.md, create GitHub issues for each actionable item:

```bash
# Example: Create issue from brainstorm item
gh issue create \
  --title "[FEATURE] Implement X from BRAINSTORM.md" \
  --body "Extracted from BRAINSTORM.md\n\n[description]\n\nCloses #N" \
  --label "enhancement,agent-ready"
```

### Step 3: Import to Kanban
```bash
./scripts/import-github-issues.sh reverb256/trovesandcoves
```

### Step 4: Execute with Agents
```bash
# For each ready task
hermes kanban boards switch trovesandcoves
hermes kanban list --status ready

# Execute with --yolo
cd ~/projects/trovesandcoves
hermes -p backend-eng --yolo --skills maplespike \
  -z "Execute task t_XXXX: [task title]"
```

### Step 5: Archive Old .md Files
Move processed .md files to `docs/archive/` after extraction.

## Next Actions

1. **Fix dispatcher** — Add `--yolo` flag to kanban worker spawning
2. **Audit BRAINSTORM.md/TIMELINE.md** — Extract actionable items
3. **Create GitHub issues** — One per actionable item, label `agent-ready`
4. **Import to kanban** — Run import script
5. **Execute tasks** — Either manually with --yolo or via fixed dispatcher
6. **Archive old docs** — Move to docs/archive/ after extraction

## Testing the Workflow

```bash
# 1. Create a test GitHub issue
gh issue create --title "Test kanban workflow" --body "Testing automated execution" --label "agent-ready"

# 2. Import to kanban
./scripts/import-github-issues.sh

# 3. Verify import
hermes kanban list --json | jq '.[] | select(.title | contains("Test"))'

# 4. Execute (manual for now)
TASK_ID=$(hermes kanban list --json | jq -r '.[] | select(.title | contains("Test")) | .id')
hermes -p backend-eng --yolo -z "Execute task $TASK_ID: Test kanban workflow. Just respond with 'Test successful'."

# 5. Complete
hermes kanban complete $TASK_ID --summary "Test successful"

# 6. Verify
hermes kanban show $TASK_ID | grep status
```

## Summary

**Kanban board**: ✅ Fully functional  
**GitHub integration**: ✅ Working (import script + workflow)  
**Model provider**: ✅ NVIDIA NIM (Qwen3.5) working  
**Agent execution**: ⚠️ Needs --yolo flag (manual or dispatcher fix)  
**.md migration**: 📋 Ready to execute (audit → issues → import → execute → archive)

The foundation is solid. Once you add `--yolo` to the dispatcher, the full automated workflow will work end-to-end.