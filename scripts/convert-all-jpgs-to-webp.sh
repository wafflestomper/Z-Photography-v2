#!/bin/bash

# Check for cwebp
if ! command -v cwebp &> /dev/null; then
  echo "cwebp not found. Please install it first (brew install webp or sudo apt install webp)."
  exit 1
fi

# Find all jpg files in images/ (excluding backup folders)
find images -type f -iname '*.jpg' ! -path '*/backup/*' | while read -r img; do
  webp_img="${img%.jpg}.webp"
  dir=$(dirname "$img")
  backup_dir="$dir/backup"
  mkdir -p "$backup_dir"
  cp "$img" "$backup_dir/"
  cwebp -q 80 "$img" -o "$webp_img"
  echo "Converted $img -> $webp_img (backup in $backup_dir)"
done

echo "All JPGs converted to WebP. Originals backed up in their respective backup folders." 