#!/bin/sh

cd ~/git-repo
/usr/bin/git --git-dir=.git pull
git add image
git commit -m "Add images"
git push
