#!/bin/bash
# Copy generated FLUX images to public/art folders

echo "🎨 Copying generated art..."

# Create directories
mkdir -p public/art/titans
mkdir -p public/art/terrain
mkdir -p public/art/cards
mkdir -p public/art/bg

# Copy all PNG files from ComfyUI output
for file in /Users/mark/ComfyUI/output/*.png; do
    if [ -f "$file" ]; then
        # Skip test files
        if [[ "$(basename "$file")" == test* ]]; then
            continue
        fi
        
        # Get the prompt ID from filename (flux_output_00001_.png format)
        filename=$(basename "$file")
        
        # Copy to appropriate folder based on content type
        # This is a simple copy - you'll need to rename files appropriately
        echo "Copying: $filename"
        cp "$file" "public/art/temp/$filename"
    fi
done

echo "✅ Art copied to public/art/temp/"
echo "📝 Rename files according to ASSET_MAP.md"
