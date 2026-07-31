#!/bin/bash
# =====================================================================
# METRA – Hardened Baseline Backup Script (v1.3)
# ---------------------------------------------------------------------
# ✔ Copies active project only
# ✔ Excludes .git and archive folders
# ✔ Captures correct git tag
# ✔ Zero permission noise
# ✔ Repository Stewardship Report
# =====================================================================

# === PROJECT ROOT (THIS MUST BE THE GIT ROOT) ========================
SOURCE="/Users/johnkelly/Documents/Documents - John’s MacBook Pro/metra-clean-test"

# === BACKUP DESTINATION ==============================================
DEST_BASE="/Users/johnkelly/Documents/Stable backup"

# === DATE + GIT TAG ==================================================
DATE=$(date +"%Y-%m-%d")
TAG=$(git -C "$SOURCE" describe --tags --always 2>/dev/null)

if [ -z "$TAG" ]; then
  TAG="no-git-tag"
fi

BACKUP_FOLDER="$DEST_BASE/METRA-backup-$TAG-$DATE"

echo "Creating backup folder:"
echo "$BACKUP_FOLDER"
mkdir -p "$BACKUP_FOLDER"

# === COPY (EXCLUDE GIT + ARCHIVES) ===================================
echo "Copying project files (excluding .git and archives)..."

rsync -av \
  --exclude ".git" \
  --exclude "*OLD*" \
  --exclude "*ARCHIVE*" \
  --exclude "node_modules" \
  "$SOURCE/" "$BACKUP_FOLDER/"

# === SCREENSHOTS FOLDER ==============================================
mkdir -p "$BACKUP_FOLDER/Screenshots"

# === BASELINE SUMMARY ================================================
echo "Writing BaselineSummary.txt..."

cat <<EOF > "$BACKUP_FOLDER/BaselineSummary.txt"
METRA – Baseline Backup
Tag: $TAG
Date: $DATE
Source: $SOURCE
Backup: $BACKUP_FOLDER
EOF

echo "------------------------------------------------------------"
echo "✅ METRA BACKUP COMPLETE"
echo "------------------------------------------------------------"

# =====================================================================
# REPOSITORY STEWARDSHIP REPORT
# =====================================================================

echo
echo "============================================================"
echo "METRA REPOSITORY STEWARDSHIP"
echo "============================================================"

cd "$SOURCE" || exit 1

COUNT=$(git status --short | grep '^??' | wc -l | tr -d ' ')

echo
echo "Untracked engineering artefacts : $COUNT"

if [ "$COUNT" -le 10 ]; then
    STATUS="GREEN"
elif [ "$COUNT" -le 30 ]; then
    STATUS="AMBER"
else
    STATUS="RED"
fi

echo "Repository Status               : $STATUS"

echo
echo "Artefacts by Stage"
git status --short \
| grep '^??' \
| grep -o 'stage[0-9A-Za-z.-]*' \
| sort \
| uniq -c

echo
echo "Protected Artefacts"
git status --short \
| grep -E 'corrupt|pre-workspace' \
|| echo "None"

echo
echo "Current Working Copies"
git status --short \
| grep '^??' \
| grep 'working' \
|| echo "None"

echo
echo "Final Repository Status"
git status

echo
echo "============================================================"
echo "Repository Stewardship Complete"
echo "============================================================"
