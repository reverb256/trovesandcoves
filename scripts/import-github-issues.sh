#!/usr/bin/env bash
# scripts/import-github-issues.sh
# Ingest GitHub issues into Kanban board for automated agent workflow
# Usage: ./scripts/import-github-issues.sh [repo-owner/repo-name]

set -euo pipefail

REPO="${1:-reverb256/trovesandcoves}"
BOARD="trovesandcoves"

echo "══════════════════════════════════════════════"
echo "GitHub Issue → Kanban Import"
echo "══════════════════════════════════════════════"
echo "Repository: $REPO"
echo "Board: $BOARD"
echo ""

# Ensure we're on the right board
hermes kanban boards switch "$BOARD"

# Fetch open issues with labels
echo "Fetching open issues from GitHub..."
gh issue list --repo "$REPO" --state open --json number,title,body,labels,assignees,milestone --jq '.[] | @base64' | while IFS= read -r line; do
    decoded=$(echo "$line" | base64 -d)
    number=$(echo "$decoded" | jq -r '.number')
    title=$(echo "$decoded" | jq -r '.title')
    body=$(echo "$decoded" | jq -r '.body // "No description"')
    labels=$(echo "$decoded" | jq -r '.labels | map(.name) | join(", ")')
    assignees=$(echo "$decoded" | jq -r '.assignees | map(.login) | join(", ")')
    milestone=$(echo "$decoded" | jq -r '.milestone.title // "No milestone"')
    
    # Determine if agent-ready
    is_agent_ready=$(echo "$decoded" | jq -r '.labels | map(.name) | contains(["agent-ready"])')
    
    # Determine assignee based on labels
    assignee="triage"
    if echo "$labels" | grep -q "backend\|enhancement\|feature"; then
        assignee="backend-eng"
    elif echo "$labels" | grep -q "frontend\|ui\|design"; then
        assignee="frontend-eng"
    elif echo "$labels" | grep -q "documentation\|docs"; then
        assignee="writer"
    elif echo "$decoded" | jq -r '.labels | map(.name) | contains(["research"])'; then
        assignee="researcher"
    elif echo "$decoded" | jq -r '.labels | map(.name) | contains(["security"])'; then
        assignee="security-eng"
    fi
    
    # Create task with idempotency key
    idempotency_key="gh-${REPO//\//-}-${number}"
    
    echo "  • GH#$number: $title"
    echo "    Labels: $labels"
    echo "    Status: $([ "$is_agent_ready" = "true" ] && echo "ready" || echo "triage")"
    echo "    Assignee: $assignee"
    
    # Check if task already exists
    existing=$(hermes kanban list --json 2>/dev/null | jq -r ".[] | select(.body | contains(\"$idempotency_key\")) | .id" || echo "")
    
    if [ -n "$existing" ]; then
        echo "    ⚠️  Already exists (task: $existing)"
        echo ""
        continue
    fi
    
    # Create the task
    task_id=$(hermes kanban create "$title" \
        --body "GitHub #$number — $body" \
        --assignee "$assignee" \
        --idempotency-key "$idempotency_key" \
        --json | jq -r '.id')
    
    echo "    ✓ Created task: $task_id"
    echo ""
done

echo "══════════════════════════════════════════════"
echo "Import complete!"
echo ""
echo "Next steps:"
echo "  1. Review triage tasks: hermes kanban list --status todo"
echo "  2. Decompose epics: hermes kanban decompose <task-id>"
echo "  3. Agents will auto-pick up ready tasks"
echo "══════════════════════════════════════════════"