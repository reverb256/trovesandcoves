#!/usr/bin/env bash
# scripts/execute-kanban-task.sh
# Execute a kanban task using delegate_task with appropriate skills
# Usage: ./scripts/execute-kanban-task.sh <task-id> [profile]

set -euo pipefail

TASK_ID="${1:-}"
PROFILE="${2:-backend-eng}"

if [ -z "$TASK_ID" ]; then
    echo "Usage: $0 <task-id> [profile]"
    echo "  task-id: Kanban task ID (e.g., t_27a7847c)"
    echo "  profile: Optional profile override (default: backend-eng)"
    exit 1
fi

# Ensure we're on the right board
hermes kanban boards switch trovesandcoves 2>/dev/null

# Get task details
echo "Fetching task $TASK_ID..."
task_json=$(hermes kanban show "$TASK_ID" --json)
title=$(echo "$task_json" | jq -r '.title')
body=$(echo "$task_json" | jq -r '.body')
status=$(echo "$task_json" | jq -r '.status')
assignee=$(echo "$task_json" | jq -r '.assignee')

echo "══════════════════════════════════════════════"
echo "Task: $title"
echo "Status: $status"
echo "Assignee: $assignee"
echo "Profile: $PROFILE"
echo "══════════════════════════════════════════════"

# Check if task is ready
if [ "$status" = "done" ]; then
    echo "⚠️ Task already completed"
    exit 0
fi

if [ "$status" = "in_progress" ]; then
    echo "⚠️ Task already in progress"
    read -p "Reclaim and restart? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        hermes kanban reclaim "$TASK_ID"
    else
        exit 0
    fi
fi

# Determine skills based on profile
case "$PROFILE" in
    backend-eng|spike-eng)
        SKILLS="maplespike drizzle-schema-fix"
        ;;
    frontend-eng)
        SKILLS="astro tailwind-design-system vercel-react-best-practices"
        ;;
    writer|documentation)
        SKILLS="writing documentation-hygiene copy-editing"
        ;;
    researcher)
        SKILLS=""
        ;;
    ops)
        SKILLS="kelos-declarative-config github-actions-ci-fixes"
        ;;
    *)
        SKILLS=""
        ;;
esac

echo "Skills: ${SKILLS:-none}"
echo ""

# Build the goal from task body
# Extract GitHub issue number if present
gh_issue=$(echo "$body" | grep -oP 'GitHub #\K\d+' || echo "")

if [ -n "$gh_issue" ]; then
    goal="Implement GitHub issue #$gh_issue: $title"
else
    goal="$title"
fi

echo "Goal: $goal"
echo ""
echo "Executing with delegate_task..."
echo ""

# Execute the task
cd ~/projects/trovesandcoves

if [ -n "$SKILLS" ]; then
    hermes -p "$PROFILE" \
        "Execute task $TASK_ID: $goal" \
        --skills $SKILLS
else
    hermes -p "$PROFILE" \
        "Execute task $TASK_ID: $goal"
fi

echo ""
echo "══════════════════════════════════════════════"
echo "Execution complete!"
echo ""
echo "Next steps:"
echo "  1. Review changes in workspace"
echo "  2. If successful: hermes kanban complete $TASK_ID --summary \"Implemented. PR #N opened.\""
echo "  3. If failed: hermes kanban block $TASK_ID --reason \"Error: <details>\""
echo "══════════════════════════════════════════════"