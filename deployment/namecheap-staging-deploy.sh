#!/bin/bash
set -euo pipefail
export PATH=/usr/local/cpanel/3rdparty/lib/path-bin:/usr/bin:/bin
repo=/home/rossxzni/repositories/rosslauda-portfolio-staging
live=/home/rossxzni/staging.rosslauda.com
state=/home/rossxzni/portfolio-staging-deploy
[[ "$live" != /home/rossxzni/public_html ]]
[[ "$(readlink -f "$live")" == /home/rossxzni/staging.rosslauda.com ]]
[[ "$(readlink -f "$repo")" == /home/rossxzni/repositories/rosslauda-portfolio-staging ]]
exec 9>"$state/deploy.lock"
flock -n 9 || exit 0
cd "$repo"
[[ "$(git branch --show-current)" == staging ]]
test -z "$(git status --porcelain)"
timeout 90 git fetch --quiet origin staging
git merge --ff-only --quiet origin/staging
revision=$(git rev-parse HEAD)
(cd "$live" && sha256sum --status -c "$state/protection-before.sha256")
if [[ -f "$state/deployed-commit" ]] && [[ "$(cat "$state/deployed-commit")" == "$revision" ]]; then exit 0; fi
for file in home.html case-study.html note.html styles.css data.js case-galleries.js site.js; do test -f "$file" && test ! -L "$file"; done
test -d assets
payload=$(mktemp -d "$state/payload.XXXXXX")
trap 'rm -rf "$payload"' EXIT
python3 - "$repo" "$payload" <<'PY'
from pathlib import Path
import shutil, sys
source, target = map(Path, sys.argv[1:])
for item in (source / 'assets').rglob('*'):
    if item.is_symlink():
        raise RuntimeError('Symlink assets are not deployable')
shutil.copytree(source / 'assets', target / 'assets')
for item in source.iterdir():
    if item.name in {'index.html', 'auth.js', 'gate.js'} or item.suffix not in {'.html', '.css', '.js'}:
        continue
    if item.is_symlink() or not item.is_file():
        raise RuntimeError('Invalid source file')
    output = target / item.name
    if item.suffix == '.html':
        text = item.read_text()
        if '<head>' not in text:
            raise RuntimeError('HTML page has no head element')
        text = text.replace('<head>', '<head>' + chr(10) + '  <script src="/auth.js"></script>', 1)
        output.write_text(text)
    else:
        shutil.copy2(item, output)
PY
rsync -a --delete "$payload/assets/" "$live/assets/"
rsync -a --include='/*.html' --include='/*.css' --include='/*.js' --exclude='*' "$payload/" "$live/"
(cd "$live" && sha256sum --status -c "$state/protection-before.sha256")
printf '%s
' "$revision" > "$state/deployed-commit.tmp"
mv "$state/deployed-commit.tmp" "$state/deployed-commit"
printf '%s staging deployed %s
' "$(date -u +%FT%TZ)" "$revision"
