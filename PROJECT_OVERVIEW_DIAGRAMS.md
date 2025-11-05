# SmartMirror - Project Overview Diagrams

High-level architectural overview diagrams for project introduction and presentation.

---

## Diagram 1: High-Level System Architecture

**Description:**  
A simplified view showing the three main layers of the SmartMirror platform: Frontend (MagicMirror), Backend Services (Spring Boot + AI), and Data Layer (PostgreSQL).

```mermaid
graph TB
    subgraph FRONTEND["🖥️ FRONTEND"]
        Mobile["📱<br/>Mobile Device"]
        Tablet["📱<br/>Tablet"]
        Mirror["🪞<br/>Smart Mirror<br/>Display"]
        
        Mobile -.-> UI
        Tablet -.-> UI
        Mirror -.-> UI
        
        UI["MagicMirror UI<br/>Node.js + Electron<br/>Port: 5173"]
    end
    
    subgraph MIDDLEWARE["⚙️ BACKEND SERVICES"]
        SpringBoot["Spring Boot API<br/>Java 17<br/>Port: 8080<br/><br/>• User Management<br/>• Reservations<br/>• Authentication<br/>• QR Codes"]
        
        AI["AI Backend<br/>FastAPI + Python<br/>Port: 8000<br/><br/>• Face Recognition<br/>• LLM Chatbot<br/>• InsightFace Model"]
        
        LLM["Ollama LLM<br/>Local AI Service<br/>Port: 11434<br/><br/>• Conversational AI<br/>• Context-Aware"]
    end
    
    subgraph DATA["💾 DATA LAYER"]
        DB[("PostgreSQL<br/>+ pgvector<br/>Port: 5432<br/><br/>• Users<br/>• Reservations<br/>• Face Embeddings<br/>• Vector Search")]
    end
    
    subgraph EXTERNAL["🌐 EXTERNAL SERVICES"]
        OAuth["OAuth2 Providers<br/>Google • GitHub"]
        Email["Email Service<br/>SMTP"]
        Weather["Weather API<br/>OpenMeteo"]
        News["News Feeds<br/>RSS"]
    end
    
    UI -->|REST API<br/>JSON| SpringBoot
    UI -->|Face & Chat<br/>JSON| AI
    
    SpringBoot -->|JDBC<br/>JPA| DB
    AI -->|pgvector<br/>Embeddings| DB
    AI -->|HTTP| LLM
    AI -.->|User Profile| SpringBoot
    
    SpringBoot -.->|OAuth2| OAuth
    SpringBoot -.->|Notifications| Email
    UI -.->|HTTP| Weather
    UI -.->|HTTP| News
    
    classDef frontend fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#fff
    classDef backend fill:#2196F3,stroke:#0D47A1,stroke-width:3px,color:#fff
    classDef data fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    classDef external fill:#9C27B0,stroke:#4A148C,stroke-width:2px,color:#fff
    
    class UI frontend
    class SpringBoot,AI,LLM backend
    class DB data
    class OAuth,Email,Weather,News external
```

---

## Diagram 2: Technology Stack Overview

**Description:**  
Visual representation of the complete technology stack used in the SmartMirror project, organized by layer.

```mermaid
graph LR
    subgraph "🎨 PRESENTATION LAYER"
        A1["MagicMirror²<br/>v2.31.0"]
        A2["Electron<br/>Desktop App"]
        A3["Socket.io<br/>Real-time"]
        A4["React<br/>Micro-frontend"]
    end
    
    subgraph "🔧 APPLICATION LAYER"
        B1["Spring Boot<br/>3.4.5"]
        B2["FastAPI<br/>Python 3.11+"]
        B3["Express.js<br/>Node Server"]
    end
    
    subgraph "🤖 AI/ML LAYER"
        C1["InsightFace<br/>Face Recognition"]
        C2["Ollama<br/>LLM Runtime"]
        C3["ONNX Runtime<br/>Model Inference"]
        C4["pgvector<br/>Vector Search"]
    end
    
    subgraph "💾 DATA LAYER"
        D1["PostgreSQL 15<br/>Relational DB"]
        D2["JPA/Hibernate<br/>ORM"]
        D3["JDBC<br/>Connectivity"]
    end
    
    subgraph "🔐 SECURITY LAYER"
        E1["Spring Security<br/>Framework"]
        E2["JWT<br/>Tokens"]
        E3["OAuth2<br/>Social Login"]
        E4["CORS<br/>Policy"]
    end
    
    subgraph "🏗️ INFRASTRUCTURE"
        F1["Docker<br/>Containers"]
        F2["Docker Compose<br/>Orchestration"]
        F3["Ngrok<br/>Tunneling"]
        F4["Maven<br/>Build Tool"]
        F5["npm<br/>Package Manager"]
    end
    
    A1 --> B3
    A2 --> A1
    A3 --> B3
    A4 --> A1
    
    B1 --> D2
    B2 --> C1
    B2 --> C2
    D2 --> D3
    D3 --> D1
    C1 --> C3
    C2 --> C3
    
    B1 --> E1
    E1 --> E2
    E1 --> E3
    B1 --> E4
    
    F1 --> B1
    F1 --> B2
    F1 --> D1
    F2 --> F1
    F4 --> B1
    F5 --> A1
    
    classDef presentation fill:#FF6B6B,stroke:#C44569,stroke-width:2px,color:#fff
    classDef application fill:#4ECDC4,stroke:#1A535C,stroke-width:2px,color:#fff
    classDef ai fill:#95E1D3,stroke:#3D5A80,stroke-width:2px,color:#000
    classDef data fill:#F7DC6F,stroke:#D4AC0D,stroke-width:2px,color:#000
    classDef security fill:#BB8FCE,stroke:#7D3C98,stroke-width:2px,color:#fff
    classDef infra fill:#85C1E2,stroke:#3498DB,stroke-width:2px,color:#000
    
    class A1,A2,A3,A4 presentation
    class B1,B2,B3 application
    class C1,C2,C3,C4 ai
    class D1,D2,D3 data
    class E1,E2,E3,E4 security
    class F1,F2,F3,F4,F5 infra
```

---

## Diagram 3: Data Flow - User Journey

**Description:**  
Complete user journey showing how data flows through the system from user interaction to response.

```mermaid
graph TB
    User([👤 User])
    
    subgraph "Step 1: Authentication"
        Login["🔐 Login<br/>Email/Password or OAuth2"]
        FaceAuth["😊 Face Recognition<br/>Biometric Auth"]
    end
    
    subgraph "Step 2: Smart Mirror Interface"
        Dashboard["📊 Dashboard<br/>Personal View"]
        Modules["🧩 Modules<br/>Weather • News • Calendar"]
        Camera["📷 Camera<br/>Live Face Detection"]
        Chat["💬 AI Assistant<br/>LLM Chat"]
    end
    
    subgraph "Step 3: Backend Processing"
        API["🔌 REST API<br/>Spring Boot"]
        AIService["🤖 AI Service<br/>FastAPI"]
        Business["📋 Business Logic<br/>Reservations • Users"]
        FaceML["🎯 Face ML<br/>InsightFace Model"]
        LLMService["🧠 LLM Service<br/>Ollama"]
    end
    
    subgraph "Step 4: Data Storage"
        UserDB[("👥 Users<br/>PostgreSQL")]
        ReservDB[("📅 Reservations<br/>PostgreSQL")]
        FaceDB[("😊 Face Data<br/>pgvector<br/>512-dim vectors")]
        KnowledgeDB[("📚 Knowledge<br/>FabLab Docs")]
    end
    
    subgraph "Step 5: Response"
        Display["✨ Display<br/>Updated UI"]
        Notification["📧 Notifications<br/>Email/In-App"]
        QRCode["📱 QR Code<br/>Access Token"]
    end
    
    User -->|Interacts| Login
    User -->|Scans Face| FaceAuth
    
    Login --> Dashboard
    FaceAuth -->|Extract Embedding| AIService
    
    Dashboard --> Modules
    Dashboard --> Camera
    Dashboard --> Chat
    
    Modules -->|Fetch Data| API
    Camera -->|Send Image| AIService
    Chat -->|Send Message| AIService
    
    API --> Business
    AIService --> FaceML
    AIService --> LLMService
    
    Business --> UserDB
    Business --> ReservDB
    FaceML --> FaceDB
    LLMService --> KnowledgeDB
    
    UserDB -.->|Return Data| API
    ReservDB -.->|Return Data| API
    FaceDB -.->|Match Vector| FaceML
    KnowledgeDB -.->|Context| LLMService
    
    API -.->|Response| Display
    AIService -.->|AI Response| Display
    API -.->|Trigger| Notification
    API -.->|Generate| QRCode
    
    Display -.->|Show| User
    Notification -.->|Notify| User
    QRCode -.->|Scan| User
    
    classDef userClass fill:#FF6B6B,stroke:#C44569,stroke-width:3px,color:#fff
    classDef authClass fill:#4ECDC4,stroke:#1A535C,stroke-width:2px,color:#fff
    classDef uiClass fill:#95E1D3,stroke:#3D5A80,stroke-width:2px,color:#000
    classDef backendClass fill:#F7DC6F,stroke:#D4AC0D,stroke-width:2px,color:#000
    classDef dataClass fill:#BB8FCE,stroke:#7D3C98,stroke-width:2px,color:#fff
    classDef responseClass fill:#85C1E2,stroke:#3498DB,stroke-width:2px,color:#000
    
    class User userClass
    class Login,FaceAuth authClass
    class Dashboard,Modules,Camera,Chat uiClass
    class API,AIService,Business,FaceML,LLMService backendClass
    class UserDB,ReservDB,FaceDB,KnowledgeDB dataClass
    class Display,Notification,QRCode responseClass
```

---

## Diagram 4: Simplified Architecture (GraphQL-Style)

**Description:**  
Clean, simplified architecture showing frontend clients, API gateway layer, backend services, and database - similar to a GraphQL architecture pattern.

```mermaid
graph LR
    subgraph CLIENTS["📱 CLIENTS"]
        Mobile["Mobile<br/>Device"]
        Desktop["Desktop<br/>Browser"]
        SmartMirror["Smart<br/>Mirror"]
    end
    
    subgraph GATEWAY["🔌 API GATEWAY LAYER"]
        REST["REST API<br/>http://backend:8080/api<br/><br/>types<br/>queries<br/>mutations"]
        WS["WebSocket<br/>socket.io<br/><br/>real-time events"]
    end
    
    subgraph SERVICES["⚙️ SERVICES LAYER"]
        Auth["Authentication<br/>Service<br/><br/>• JWT<br/>• OAuth2<br/>• Face Auth"]
        
        User["User<br/>Service<br/><br/>• CRUD<br/>• Profiles<br/>• Roles"]
        
        Reservation["Reservation<br/>Service<br/><br/>• Create<br/>• Update<br/>• QR Codes"]
        
        AI["AI<br/>Service<br/><br/>• Face Rec<br/>• LLM Chat<br/>• Vectors"]
    end
    
    subgraph PERSISTENCE["💾 PERSISTENCE LAYER"]
        AppDB[("Application<br/>Database<br/><br/>PostgreSQL")]
        VectorDB[("Vector<br/>Store<br/><br/>pgvector")]
        Cache[("Cache<br/>Layer<br/><br/>In-Memory")]
    end
    
    Mobile -->|HTTP/WS| REST
    Desktop -->|HTTP/WS| REST
    SmartMirror -->|HTTP/WS| REST
    
    Mobile -.->|Real-time| WS
    Desktop -.->|Real-time| WS
    SmartMirror -.->|Real-time| WS
    
    REST --> Auth
    REST --> User
    REST --> Reservation
    REST --> AI
    
    WS -.-> Auth
    WS -.-> User
    
    Auth --> AppDB
    User --> AppDB
    Reservation --> AppDB
    AI --> VectorDB
    AI --> AppDB
    
    Auth -.-> Cache
    User -.-> Cache
    
    AppDB -.-> VectorDB
    
    classDef clients fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#fff
    classDef gateway fill:#2196F3,stroke:#0D47A1,stroke-width:3px,color:#fff
    classDef services fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    classDef persistence fill:#9C27B0,stroke:#4A148C,stroke-width:3px,color:#fff
    
    class Mobile,Desktop,SmartMirror clients
    class REST,WS gateway
    class Auth,User,Reservation,AI services
    class AppDB,VectorDB,Cache persistence
```

---

## Diagram 5: Docker Container Architecture

**Description:**  
Infrastructure overview showing all Docker containers, volumes, and network connectivity.

```mermaid
graph TB
    subgraph Internet["🌐 INTERNET"]
        Users["Users"]
        NgrokCloud["Ngrok Cloud<br/>Tunneling Service"]
    end
    
    subgraph DockerHost["🐳 DOCKER HOST (Linux)"]
        subgraph Network["smartmirror_network (Bridge)"]
            
            subgraph Containers["📦 CONTAINERS"]
                Backend["backend<br/>Spring Boot<br/>:8080"]
                AI["AI_backend<br/>FastAPI<br/>:8000"]
                DB["SmartMirror-db<br/>PostgreSQL+pgvector<br/>:5432"]
                Ollama["ollama_service<br/>LLM<br/>:11434"]
                PgWeb["pgweb_dev<br/>DB UI<br/>:55432"]
                NgrokB["ngrok_backend<br/>Tunnel<br/>Backend"]
                NgrokF["ngrok_frontend<br/>Tunnel<br/>Frontend"]
            end
            
            subgraph Volumes["💾 VOLUMES"]
                V1["pgdata<br/>PostgreSQL Data"]
                V2["insightface_models<br/>AI Models"]
                V3["llm_models<br/>Ollama Models"]
                V4["ai_knowledge<br/>FabLab Docs"]
            end
        end
        
        subgraph HostProcess["💻 HOST PROCESS"]
            MagicMirror["MagicMirror<br/>Node.js/Electron<br/>:5173"]
        end
    end
    
    Users -->|HTTPS| NgrokCloud
    NgrokCloud -->|Tunnel| NgrokB
    NgrokCloud -->|Tunnel| NgrokF
    
    NgrokB -.->|Proxy| Backend
    NgrokF -.->|Proxy| MagicMirror
    
    MagicMirror -->|REST| Backend
    MagicMirror -->|REST| AI
    
    Backend -->|JDBC| DB
    AI -->|pgvector| DB
    AI -->|HTTP| Ollama
    AI -.->|API| Backend
    
    PgWeb -->|Admin| DB
    
    DB -.->|Mount| V1
    AI -.->|Mount| V2
    AI -.->|Mount| V4
    Ollama -.->|Mount| V3
    
    Backend -->|Health Check| Backend
    AI -->|Health Check| AI
    DB -->|Health Check| DB
    
    classDef internet fill:#FF5722,stroke:#BF360C,stroke-width:2px,color:#fff
    classDef container fill:#2196F3,stroke:#0D47A1,stroke-width:2px,color:#fff
    classDef volume fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    classDef host fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    
    class Users,NgrokCloud internet
    class Backend,AI,DB,Ollama,PgWeb,NgrokB,NgrokF container
    class V1,V2,V3,V4 volume
    class MagicMirror host
```

---

## Diagram 6: Feature Map

**Description:**  
Overview of all major features and capabilities of the SmartMirror platform.

```mermaid
mindmap
  root((SmartMirror<br/>Platform))
    User Management
      Registration
        Email/Password
        OAuth2 Social
        Google Login
        GitHub Login
      Profile Management
        Personal Info
        Profile Image
        Preferences
        Training Location
      Role-Based Access
        Admin
        Employee
        Client/User
    
    Face Recognition
      Registration
        Image Capture
        Embedding Extraction
        512-dim Vector
      Authentication
        Face Login
        Vector Matching
        Cosine Similarity
      Technology
        InsightFace
        ONNX Runtime
        pgvector DB
    
    AI Assistant
      LLM Chat
        Conversational AI
        Context-Aware
        User Personalization
      Knowledge Base
        FabLab Documentation
        Training Materials
        Operational Info
      Technology
        Ollama
        Local Deployment
        Privacy-First
    
    Reservation System
      Machine Booking
        3D Printers
        Laser Cutters
        CNC Machines
      Workshop Registration
        Training Sessions
        Age Groups
        Activities
      QR Codes
        Access Tokens
        Check-in System
      Notifications
        Email Alerts
        Confirmations
    
    Smart Mirror UI
      Modular Design
        Weather Widget
        News Feed
        Calendar
        Clock
        Custom Modules
      Real-time Updates
        Socket.io
        Live Data
        Event Driven
      Responsive
        Mobile Support
        Touch Interface
        Voice Ready
    
    Security
      Authentication
        JWT Tokens
        Session Management
        Multi-factor
      Authorization
        Role-Based
        Resource Protection
        API Security
      Data Protection
        Encrypted Storage
        Secure Transmission
        GDPR Compliant
```

---

