#!/bin/bash

# Script to generate project overview diagrams from PROJECT_OVERVIEW_DIAGRAMS.md

DIAGRAMS_DIR="overview-diagrams"
SOURCE_FILE="PROJECT_OVERVIEW_DIAGRAMS.md"

# Create diagrams directory
mkdir -p "$DIAGRAMS_DIR"

echo "Extracting overview diagrams from $SOURCE_FILE..."

# Extract all mermaid code blocks and create individual files
awk '
BEGIN { 
    in_mermaid = 0
    diagram_num = 0
    diagram_names[1] = "overview-01-system-architecture"
    diagram_names[2] = "overview-02-technology-stack"
    diagram_names[3] = "overview-03-user-journey"
    diagram_names[4] = "overview-04-api-gateway-pattern"
    diagram_names[5] = "overview-05-docker-infrastructure"
    diagram_names[6] = "overview-06-feature-map"
}
/^```mermaid/ { 
    in_mermaid = 1
    diagram_num++
    next
}
/^```$/ && in_mermaid { 
    in_mermaid = 0
    next
}
in_mermaid { 
    print > "'"$DIAGRAMS_DIR"'/" diagram_names[diagram_num] ".mmd"
}
' "$SOURCE_FILE"

echo "Converting overview diagrams to PNG..."

# Convert each .mmd file to PNG with larger dimensions for overview diagrams
for mmd_file in "$DIAGRAMS_DIR"/*.mmd; do
    if [ -f "$mmd_file" ]; then
        filename=$(basename "$mmd_file" .mmd)
        echo "Converting $filename..."
        
        # Use larger dimensions for overview diagrams: 3000x2000
        mmdc -i "$mmd_file" -o "$DIAGRAMS_DIR/${filename}.png" -b white -w 3000 -H 2000 -s 2
        
        if [ $? -eq 0 ]; then
            echo "  ✓ Created ${filename}.png"
        else
            echo "  ✗ Failed to convert ${filename}"
        fi
    fi
done

echo ""
echo "Overview diagram generation complete!"
echo "PNG files are located in: $DIAGRAMS_DIR/"
echo ""
ls -lh "$DIAGRAMS_DIR"/*.png 2>/dev/null || echo "No PNG files were generated"
