# Kanban Workflow — Troves & Coves

> **Source of Truth:** GitHub Issues  
> **Working Layer:** Hermes Kanban Board  
> **Execution:** Direct `delegate_task` with skills (NO Kelos/Kagent)

## Architecture (No Kelos)

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Issues                                │
│  Source: https://github.com/reverb256/trovesandcoves/issues     │
│  Labels: agent-ready, enhancement, bug, documentation, etc.      │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ Automated Ingestion (CLI script)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hermes Kanban Board                           │
│  Board: trovesandcoves                                           │
│  Columns: todo → ready → in_progress → done                     │
│  Assignees: backend-eng, frontend-eng, writer, etc.              │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ Manual trigger OR auto-run via cronjob
               │ delegate_task(goal, skills=[...]) → direct execution
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Direct Agent Execution                        │
│  - Hermes agent spawns with delegate_task                       │
│  - Loads required skills (maplespike, astro, etc.)              │
│  - Creates worktree, implements, commits                        │
│  - Opens PR referencing GitHub issue                            │
│  - Completes kanban task                                        │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ PR Merge → Issue Auto-Close
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cherry-pick to prod                           │
│                    Deploy to GitHub Pages                        │
└─────────────────────────────────────────────────────────────────┘
```

## Migration Status

### Phase 1: Setup ✓
- [x] Create kanban board: `hermes kanban boards create trovesandcoves`
- [x] Document workflow in `KANBAN-WORKFLOW.md`
- [x] Create ingestion script: `scripts/import-github-issues.sh`
- [x] Import existing GitHub issue #13

### Phase 2: Direct Execution Workflow
- [ ] Create orchestrator script for task execution
- [ ] Configure skills per profile
- [ ] Test manual execution: `./scripts/execute-kanban-task.sh <task-id>`
- [ ] Set up cronjob for automatic processing

### Phase 3: Automation
- [ ] Add GitHub Action for automatic issue ingestion
- [ ] Configure cronjob to poll kanban board
- [ ] Establish PR review workflow
- [ ] Set up notifications

## Commands Reference

### Board Management
```bash
# Switch to board
hermes kanban boards switch trovesandcoves

# List tasks by status
hermes kanban list --status ready
hermes kanban list --status todo
hermes kanban list --status in_progress

# Show task details
hermes kanban show t_27a7847c

# Move task to ready (unblock)
hermes kanban unblock t_27a7847c
```

### Manual Execution (Current Workflow)
```bash
# For each ready task, execute directly:
cd ~/projects/trovesandcoves

# Agent executes task with appropriate skills
hermes -p backend-eng \
  'Execute task t_27a7847c: implement robustness upgrades for trovesandcoves e-commerce site' \
  --skills maplespike drizzle-schema-fix astro

# Complete the kanban task
hermes kanban complete t_27a7847c --summary "Implemented X, Y, Z. PR #N opened."
```

### Automated Execution (Cron-based)
```bash
# Set up recurring execution (every 30 minutes)
hermes cronjob create \
  --name "trovesandcoves-kanban-worker" \
  --schedule "30m" \
  --prompt "Poll trovesandcoves kanban board for tasks with status=ready. Execute each with delegate_task using appropriate skills. Map GitHub issues to PRs." \
  --skills maplespike astro kanban-orchestrator

# Or create a targeted worker cronjob
hermes cronjob create \
  --name "trovesandcoves-backend-worker" \
  --schedule "30m" \
  --prompt "Check trovesandcoves kanban board. For tasks assigned to backend-eng with status=ready, execute with delegate_task(goal=task.body, skills=['maplespike', 'drizzle-schema-fix']). Open PRs referencing original GitHub issues." \
  --enabled_toolsets '["terminal", "file", "web"]'
```

### Import Issues
```bash
# Manual import
cd ~/projects/trovesandcoves
./scripts/import-github-issues.sh reverb256/trovesandcoves

# Check what was imported
hermes kanban list --json | jq '.[] | {id, title, status, assignee}'
```

## Profile Mapping

| Profile | Skills | Use For |
|---------|--------|---------|
| `backend-eng` | maplespike, drizzle-schema-fix, fastapi-templates | Backend API, database, server logic |
| `frontend-eng` | astro, tailwind-design-system, vercel-react-best-practices | React components, UI, styling |
| `writer` | writing, documentation-hygiene, copy-editing | Docs, README, comments |
| `researcher` | (web search, arxiv) | Competitive analysis, best practices |
| `ops` | kelos-declarative-config, github-actions-ci-fixes | CI/CD, deployment, automation |

## Execution Pattern (delegate_task)

When a task is ready for execution:

```python
# Example: Execute backend task
from hermes_tools import delegate_task

result = delegate_task(
    goal="Implement rate limiting for product API endpoints (GitHub #13)",
    context="""
    - Project: /home/j_kro/projects/trovesandcoves/
    - Branch: Create feat/rate-limiting-13 from main
    - Stack: React + Express + TypeScript
    - Requirements:
      1. Add express-rate-limit to server/
      2. Configure 100 req/min for API routes
      3. Add rate limit headers to responses
      4. Test with curl
    - After implementation:
      1. Commit changes
      2. Push to feat/rate-limiting-13
      3. gh pr create --base main --title "Implement rate limiting" --body "Fixes #13"
    """,
    toolsets=["terminal", "file", "web"],
)

# Then complete the kanban task
print(result["summary"])
```

## Current Issue Status

| GH Issue | Kanban Task | Status | Assignee | Next Action |
|----------|-------------|--------|----------|-------------|
| #13 | t_27a7847c | blocked | backend-eng | Unblock → execute with delegate_task |

## Cronjob Setup (Automated Worker)

```bash
# Backend worker - runs every 30 minutes
hermes cronjob create \
  --name "trovesandcoves-backend" \
  --schedule "30m" \
  --prompt "Check trovesandcoves kanban board for tasks with status=ready and assignee=backend-eng. For each, execute with delegate_task(goal=task.body, skills=['maplespike', 'drizzle-schema-fix']). Open PR referencing GitHub issue. Complete kanban task with PR number." \
  --enabled_toolsets '["terminal", "file"]' \
  --workdir /home/j_kro/projects/trovesandcoves
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Task stuck in in_progress | `hermes kanban reclaim <task-id>` |
| Wrong profile assigned | `hermes kanban reassign <task-id> <profile>` |
| Agent not executing | Check profile has correct skills loaded, verify `delegate_task` is available |
| Issues not importing | Verify GH_TOKEN, check GitHub API rate limits |
| No cronjobs running | `hermes cronjob list` to verify, `hermes cronjob run <job_id>` to manually trigger |

## Files
- `scripts/import-github-issues.sh` — Manual import CLI
- `scripts/execute-kanban-task.sh` — Manual task execution helper (TODO: create)
- `.github/workflows/kanban-ingest.yml` — Automated ingestion on issue events
- `KANBAN-WORKFLOW.md` — This documentation
- `CLAUDE.md` — Project-specific guidance (update with kanban references)

## Next Steps

1. **Unblock current task t_27a7847c**: Review what's blocking it, either fix or reclaim
2. **Create execution helper script**: `scripts/execute-kanban-task.sh <task-id>`
3. **Test manual execution**: Run one full cycle: issue → kanban → delegate_task → PR
4. **Set up cronjob**: Automated polling and execution
5. **Configure notifications**: Gateway ping or message on task completion