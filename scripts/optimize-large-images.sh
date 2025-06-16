#!/bin/bash

# Script to optimize WebP images larger than 400KB
# Usage: ./optimize-large-images.sh

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install it first."
    echo "On macOS, you can install it with: brew install webp"
    exit 1
fi

# Create backup directory
BACKUP_DIR="images/backup/optimized"
mkdir -p "$BACKUP_DIR"

# Find all WebP images and process them
find images -type f -name "*.webp" | while read -r image; do
    # Get file size in KB
    size=$(du -k "$image" | cut -f1)
    
    if [ "$size" -gt 400 ]; then
        echo "Processing large image: $image (${size}KB)"
        
        # Create backup
        backup_path="$BACKUP_DIR/$(basename "$image")"
        cp "$image" "$backup_path"
        echo "Created backup at: $backup_path"
        
        # Optimize with more aggressive compression
        # -q 60: lower quality factor for smaller file size
        # -m 6: maximum compression method
        # -mt: multi-threading
        # -af: auto-filter
        # -f 80: higher filter strength
        # -sharp_yuv: use sharp RGB->YUV conversion
        # -pass 10: more compression passes
        # -alpha_q 100: preserve alpha channel quality
        cwebp -q 60 -m 6 -mt -af -f 80 -sharp_yuv -pass 10 -alpha_q 100 "$backup_path" -o "$image"
        
        # Get new size
        new_size=$(du -k "$image" | cut -f1)
        reduction=$((size - new_size))
        percent=$((reduction * 100 / size))
        
        echo "Optimized: $image"
        echo "Original size: ${size}KB"
        echo "New size: ${new_size}KB"
        echo "Reduction: ${reduction}KB (${percent}%)"
        echo "----------------------------------------"
    fi
done

echo "Optimization complete!"
echo "Backups are stored in: $BACKUP_DIR" 