#!/bin/bash
# Reads the last commit date from git and updates index.html
DATE=$(git log -1 --format="%ci" | awk '{print $1}')
FORMATTED=$(date -d "$DATE" '+%b %d, %Y')
sed -i "s|<!--LAST_PUSHED_DATE-->[^<]*<!--/LAST_PUSHED_DATE-->|<!--LAST_PUSHED_DATE-->$FORMATTED<!--/LAST_PUSHED_DATE-->|g" index.html
echo "Updated last pushed date to: $FORMATTED"
