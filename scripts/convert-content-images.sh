#!/bin/bash

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "cwebp is not installed. Please install it first:"
    echo "macOS: brew install webp"
    echo "Ubuntu/Debian: sudo apt-get install webp"
    exit 1
fi

# Define image directories
IMAGE_DIRS=(
    "images"
    "images/events"
    "images/portraits"
)

# Create backup directories
for dir in "${IMAGE_DIRS[@]}"; do
    if [ ! -d "$dir/backup" ]; then
        mkdir -p "$dir/backup"
    fi
done

# Convert images in each directory
for dir in "${IMAGE_DIRS[@]}"; do
    echo "Processing directory: $dir"
    
    # Find all jpg/jpeg files and convert them
    find "$dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
        # Skip if file is in backup directory
        if [[ "$img" == *"/backup/"* ]]; then
            continue
        fi
        
        # Create backup
        cp "$img" "$dir/backup/"
        
        # Get filename without extension
        filename=$(basename "$img")
        name="${filename%.*}"
        
        # Convert to WebP with quality 80
        echo "Converting $img to WebP..."
        cwebp -q 80 "$img" -o "$dir/${name}.webp"
        
        if [ $? -eq 0 ]; then
            echo "Successfully converted $img to WebP"
        else
            echo "Failed to convert $img"
        fi
    done
done

echo "Conversion complete. Original images have been backed up to their respective backup directories." 