#!/bin/sh

# Credit to David Moody
# https://davidxmoody.com/host-any-static-site-with-github-pages/

set -e

# TODO exit if this fails
npm run build

# Check for uncommitted changes or untracked files
[ -n "$(git status --porcelain)" ] && git status && exit 1

# Switch to gh-pages branch without changing any files
git symbolic-ref HEAD refs/heads/gh-pages
git reset

# Add all changes in the build dir
git --work-tree=build add -A
git --work-tree=build commit -m "Published changes"

# Switch back to master
git symbolic-ref HEAD refs/heads/master
git reset

# Push both branches to GitHub
git push --all origin
