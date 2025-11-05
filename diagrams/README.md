# SmartMirror Architecture Diagrams

This directory contains all technical architecture diagrams for the SmartMirror project in PNG format.

## 📊 Diagram Index

### System Architecture (C4 Model)

1. **01-system-context.png** - System Context Diagram (C4 Level 1)
   - Shows users, external systems, and overall system boundary
   - Includes OAuth providers, LLM services, APIs

2. **02-container-diagram.png** - Container Diagram (C4 Level 2)
   - Major deployable components: MagicMirror, Spring Boot, FastAPI, PostgreSQL, Ollama
   - Container communication patterns

3. **03-component-spring-boot.png** - Spring Boot Backend Components (C4 Level 3)
   - Controllers, Services, Repositories
   - Security configuration and JWT handling

4. **04-component-ai-backend.png** - AI Backend Components (C4 Level 3)
   - FastAPI routes, services, and models
   - InsightFace integration, LLM client

### Domain & Data Models

5. **05-class-diagram.png** - Domain Class Diagram (UML)
   - User hierarchy (Employee, Client)
   - Reservation, FaceData entities
   - Relationships and inheritance

10. **10-database-er-diagram.png** - Database Entity-Relationship Diagram
    - Complete database schema
    - Tables: users, reservations, face_data, user_connected_accounts
    - Primary keys, foreign keys, pgvector embeddings

### Workflows & Sequences

6. **06-sequence-authentication.png** - User Authentication Flow
   - JWT-based login workflow
   - Spring Security integration

7. **07-sequence-face-recognition.png** - Face Recognition Flow
   - Image capture to embedding extraction
   - pgvector storage process

8. **08-sequence-llm-chat.png** - LLM Chat Interaction
   - Context enrichment with user profile
   - FabLab documentation integration
   - Ollama LLM query

### Infrastructure & Deployment

9. **09-deployment-diagram.png** - Deployment Architecture
   - Docker containers and networking
   - Volumes and data persistence
   - Ngrok tunnels and external services

12. **12-component-magicmirror-modules.png** - MagicMirror Module Architecture
    - Core application and module loader
    - Default and custom modules
    - Socket.io communication

### Process & Data Flows

11. **11-state-machine-reservation.png** - Reservation Lifecycle States
    - State transitions from draft to completion
    - Cancellation and no-show handling

13. **13-cicd-pipeline.png** - CI/CD Pipeline Flow
    - Build, test, and deployment stages
    - Multi-environment deployment

14. **14-data-flow-face-recognition.png** - Face Recognition Data Flow
    - Image processing pipeline
    - Vector similarity search

### Architecture Decisions

15. **15-architecture-decisions.png** - Technology Stack Decisions
    - Frontend, Backend, Database, AI/ML choices
    - Infrastructure and security decisions

## 🎨 Diagram Specifications

- **Format**: PNG with transparent background
- **Resolution**: 2400x1600 pixels (high resolution for presentations)
- **Tool**: Generated from Mermaid diagrams using @mermaid-js/mermaid-cli
- **Source**: TECHNICAL_DIAGRAMS.md in the project root

## 🔄 Regenerating Diagrams

To regenerate all diagrams from the source markdown file:

```bash
./generate-diagrams.sh
```

This will:
1. Extract all Mermaid code blocks from TECHNICAL_DIAGRAMS.md
2. Convert each to a PNG file with transparent background
3. Save all files to this directory

## 📝 Usage

These diagrams are suitable for:
- Technical presentations
- Documentation
- Architecture reviews
- Onboarding materials
- Project proposals

## 📄 License

These diagrams are part of the SmartMirror project and follow the same license.
