#!/bin/bash
set -euo pipefail
export PATH=/usr/local/cpanel/3rdparty/lib/path-bin:/usr/bin:/bin
repo=/home/rossxzni/repositories/rosslauda-portfolio
live=/home/rossxzni/public_html
state=/home/rossxzni/portfolio-deploy
exec 9>"$state/deploy.lock"
flock -n 9 || exit 0
cd "$repo"
test -z "$(git status --porcelain)"
git fetch --quiet https://github.com/broccoli111/port2026.git main
 git merge --ff-only --quiet FETCH_HEAD
revision=$(git rev-parse HEAD)
if [[ -f "$state/deployed-commit" ]] && [[ "$(cat "$state/deployed-commit")" == "$revision" ]]; then exit 0; fi
for file in index.html home.html case-study.html note.html styles.css data.js case-galleries.js site.js .htaccess; do test -f "$file"; done
test -d assets
rsync -a --delete assets/ "$live/assets/"
rsync -a --include='/*.html' --include='/*.css' --include='/*.js' --include='/.htaccess' --exclude='*' ./ "$live/"
printf '%s
' "$revision" > "$state/deployed-commit.tmp"
mv "$state/deployed-commit.tmp" "$state/deployed-commit"
printf '%s deployed %s
' "$(date -u +%FT%TZ)" "$revision"
