#!/bin/bash

# Script to extract Mermaid diagrams from TECHNICAL_DIAGRAMS.md and convert to PNG

DIAGRAMS_DIR="diagrams"
SOURCE_FILE="TECHNICAL_DIAGRAMS.md"

# Create diagrams directory
mkdir -p "$DIAGRAMS_DIR"

echo "Extracting Mermaid diagrams from $SOURCE_FILE..."

# Extract all mermaid code blocks and create individual files
awk '
BEGIN { 
    in_mermaid = 0
    diagram_num = 0
    diagram_names[1] = "01-system-context"
    diagram_names[2] = "02-container-diagram"
    diagram_names[3] = "03-component-spring-boot"
    diagram_names[4] = "04-component-ai-backend"
    diagram_names[5] = "05-class-diagram"
    diagram_names[6] = "06-sequence-authentication"
    diagram_names[7] = "07-sequence-face-recognition"
    diagram_names[8] = "08-sequence-llm-chat"
    diagram_names[9] = "09-deployment-diagram"
    diagram_names[10] = "10-database-er-diagram"
    diagram_names[11] = "11-state-machine-reservation"
    diagram_names[12] = "12-component-magicmirror-modules"
    diagram_names[13] = "13-cicd-pipeline"
    diagram_names[14] = "14-data-flow-face-recognition"
    diagram_names[15] = "15-architecture-decisions"
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

echo "Converting Mermaid diagrams to PNG..."

# Convert each .mmd file to PNG
for mmd_file in "$DIAGRAMS_DIR"/*.mmd; do
    if [ -f "$mmd_file" ]; then
        filename=$(basename "$mmd_file" .mmd)
        echo "Converting $filename..."
        mmdc -i "$mmd_file" -o "$DIAGRAMS_DIR/${filename}.png" -b transparent -w 2400 -H 1600
        if [ $? -eq 0 ]; then
            echo "  ✓ Created ${filename}.png"
        else
            echo "  ✗ Failed to convert ${filename}"
        fi
    fi
done

echo ""
echo "Diagram generation complete!"
echo "PNG files are located in: $DIAGRAMS_DIR/"
echo ""
ls -lh "$DIAGRAMS_DIR"/*.png 2>/dev/null || echo "No PNG files were generated"
