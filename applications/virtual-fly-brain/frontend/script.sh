#!/bin/bash
# Script to rename .js files to .jsx if they contain JSX syntax

cd src

# Find all .js files and check if they contain JSX syntax
find . -name "*.js" -type f | while read -r file; do
    # Check if file contains JSX syntax (looking for common JSX patterns)
    if grep -q -E "(<[A-Z][a-zA-Z0-9]*|</[A-Z][a-zA-Z0-9]*>|<[a-z]+[^>]*>|</[a-z]+>|className=|JSX\.Element|React\.Fragment|<>|</>)" "$file"; then
        # Get the new filename by replacing .js with .jsx
        new_file="${file%.js}.jsx"
        echo "Renaming: $file -> $new_file"
        mv "$file" "$new_file"
    fi
done
