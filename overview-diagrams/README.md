# SmartMirror - Project Overview Diagrams

🎯 **High-level architectural diagrams for project introduction and executive presentation**

These diagrams provide a bird's-eye view of the SmartMirror platform, perfect for stakeholders, presentations, and project documentation.

---

## 📊 Overview Diagrams

### 1️⃣ **System Architecture** 
`overview-01-system-architecture.png` (329KB)

**Purpose**: Complete system overview showing all major components  
**Shows**:
- 🖥️ Frontend layer (MagicMirror UI on multiple devices)
- ⚙️ Backend services (Spring Boot, AI Backend, Ollama LLM)
- 💾 Data layer (PostgreSQL + pgvector)
- 🌐 External integrations (OAuth, Email, Weather, News)

**Best for**: Executive presentations, project kickoffs, architecture reviews

---

### 2️⃣ **Technology Stack**
`overview-02-technology-stack.png` (297KB)

**Purpose**: Comprehensive view of all technologies used  
**Shows**:
- 🎨 Presentation: MagicMirror, Electron, Socket.io, React
- 🔧 Application: Spring Boot, FastAPI, Express
- 🤖 AI/ML: InsightFace, Ollama, ONNX, pgvector
- 💾 Data: PostgreSQL, JPA/Hibernate
- 🔐 Security: Spring Security, JWT, OAuth2
- 🏗️ Infrastructure: Docker, Maven, npm

**Best for**: Technical discussions, hiring, technology assessments

---

### 3️⃣ **User Journey & Data Flow**
`overview-03-user-journey.png` (508KB)

**Purpose**: Complete user interaction flow from login to response  
**Shows**:
- Step 1: Authentication (Email/Password, Face Recognition)
- Step 2: Smart Mirror Interface (Dashboard, Modules, Chat)
- Step 3: Backend Processing (APIs, AI, Business Logic)
- Step 4: Data Storage (Users, Reservations, Face Embeddings)
- Step 5: Response (Display, Notifications, QR Codes)

**Best for**: UX presentations, user onboarding, feature demonstrations

---

### 4️⃣ **API Gateway Pattern**
`overview-04-api-gateway-pattern.png` (315KB)

**Purpose**: Clean architecture showing service layer organization  
**Shows**:
- 📱 Clients: Mobile, Desktop, Smart Mirror
- 🔌 Gateway: REST API, WebSocket real-time
- ⚙️ Services: Authentication, User, Reservation, AI
- 💾 Persistence: Application DB, Vector Store, Cache

**Best for**: API documentation, service architecture, integration guides

---

### 5️⃣ **Docker Infrastructure**
`overview-05-docker-infrastructure.png` (434KB)

**Purpose**: Complete infrastructure and deployment view  
**Shows**:
- 🌐 Internet access via Ngrok tunnels
- 🐳 All Docker containers (Backend, AI, DB, Ollama, PgWeb)
- 💾 Persistent volumes (Data, Models, Knowledge)
- 📦 Network connectivity and health checks
- 💻 Host processes (MagicMirror)

**Best for**: DevOps discussions, deployment planning, infrastructure reviews

---

### 6️⃣ **Feature Map**
`overview-06-feature-map.png` (506KB)

**Purpose**: Comprehensive feature overview in mindmap format  
**Shows**:
- 👥 User Management (Registration, Profiles, Roles)
- 😊 Face Recognition (Registration, Auth, Technology)
- 🤖 AI Assistant (LLM Chat, Knowledge Base)
- 📅 Reservation System (Bookings, QR Codes, Notifications)
- 🪞 Smart Mirror UI (Modules, Real-time, Responsive)
- 🔐 Security (Auth, Authorization, Data Protection)

**Best for**: Product presentations, feature planning, roadmap discussions

---

## 🎨 Diagram Specifications

| Attribute | Value |
|-----------|-------|
| **Format** | PNG (High Resolution) |
| **Dimensions** | 3000x2000 pixels |
| **Scale** | 2x for crisp rendering |
| **Background** | White (suitable for presentations) |
| **Size Range** | 297KB - 508KB per diagram |
| **Tool** | Mermaid CLI v11+ |

---

## 🎯 Use Cases

### 📽️ **Presentations**
- Executive briefings
- Investor pitches
- Stakeholder updates
- Conference talks

### 📚 **Documentation**
- README files
- Wiki pages
- Technical guides
- Onboarding materials

### 💼 **Business**
- Project proposals
- Budget justifications
- Resource planning
- Vendor discussions

### 👨‍💻 **Development**
- Architecture reviews
- Code reviews
- Sprint planning
- Technical debt analysis

---

## 🔄 Regenerating Diagrams

To regenerate all overview diagrams:

```bash
./generate-overview-diagrams.sh
```

This will:
1. Extract all Mermaid diagrams from `PROJECT_OVERVIEW_DIAGRAMS.md`
2. Convert each to high-resolution PNG (3000x2000px)
3. Save to `overview-diagrams/` directory

---

## 📁 File Structure

```
overview-diagrams/
├── README.md (this file)
├── overview-01-system-architecture.png
├── overview-02-technology-stack.png
├── overview-03-user-journey.png
├── overview-04-api-gateway-pattern.png
├── overview-05-docker-infrastructure.png
└── overview-06-feature-map.png
```

---

## 💡 Tips for Presentations

1. **Start with Diagram 1** (System Architecture) - gives the big picture
2. **Use Diagram 6** (Feature Map) - for product/business audiences
3. **Use Diagram 2** (Technology Stack) - for technical audiences
4. **Use Diagram 3** (User Journey) - for UX/product demos
5. **Combine diagrams** - tell a complete story from business to infrastructure

---

## 🆚 Comparison with Detailed Diagrams

| Overview Diagrams | Detailed Diagrams (`diagrams/`) |
|-------------------|----------------------------------|
| High-level views | Low-level implementation |
| Business-friendly | Developer-focused |
| 6 diagrams | 15 diagrams |
| Larger dimensions | Standard dimensions |
| White background | Transparent background |
| Presentation-ready | Documentation-ready |

Both sets complement each other for complete project coverage!

---

## 📄 License

These diagrams are part of the SmartMirror project.  
© 2025 SmartMirror Team

---

**Generated**: November 5, 2025  
**Source**: `PROJECT_OVERVIEW_DIAGRAMS.md`  
**Tool**: @mermaid-js/mermaid-cli
