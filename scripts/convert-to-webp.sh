#!/bin/bash

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "cwebp is not installed. Please install it first:"
    echo "On macOS: brew install webp"
    echo "On Ubuntu/Debian: sudo apt-get install webp"
    exit 1
fi

# Directory containing the images
IMAGE_DIR="images/sport-menu"

# Create a backup directory
BACKUP_DIR="${IMAGE_DIR}/backup"
mkdir -p "$BACKUP_DIR"

# Convert all jpg/jpeg files to webp
for img in "$IMAGE_DIR"/*.{jpg,jpeg}; do
    if [ -f "$img" ]; then
        # Get the filename without extension
        filename=$(basename "$img")
        name="${filename%.*}"
        
        # Create backup
        cp "$img" "$BACKUP_DIR/$filename"
        
        # Convert to WebP with quality 80 (good balance between quality and size)
        cwebp -q 80 "$img" -o "$IMAGE_DIR/$name.webp"
        
        echo "Converted $filename to WebP"
    fi
done

echo "Conversion complete. Original images backed up to $BACKUP_DIR" 