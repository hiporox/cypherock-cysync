#!/bin/bash

set -e
# takes pnpm.cjs path as argument or uses default
# https://github.com/develar/app-builder/issues/63#issuecomment-914324662
echo Fixing hash bang for pnpm.cjs...
echo ""

if [ $# -gt 0 ]; then 
	file="$1"
elif [ "$IS_CI" == "true" ]; then
  if [ "$WINDOWS_USERNAME" == "" ]; then USERNAME="runneradmin"; else USERNAME="$WINDOWS_USERNAME"; fi
  file="C:\Users\\$USERNAME\setup-pnpm\node_modules\.pnpm\pnpm@$(pnpm --version)\node_modules\pnpm\bin\pnpm.cjs"
else 
  pnpmPath=$(where pnpm | sed -n 1p)
  path=$(dirname "$pnpmPath")
  file="$path\\node_modules\\pnpm\\bin\\pnpm.cjs"
fi

oldLine=$(head -n 1 "$file")
newLine="#!node"

echo Replacing line \"1: "$oldLine"\" of \""$file"\" with \"1: "$newLine"\"
echo ""

cp "$file" temp
echo "$newLine" > "$file"
tail temp -n+2>> "$file"
rm temp

echo Replaced \"1: "$oldLine"\" with \"1: "$newLine"\" at \""$file"\" 
