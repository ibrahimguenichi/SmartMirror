# SmartMirror - Technical Architecture Diagrams

This document contains all technical diagrams required for a comprehensive presentation of the SmartMirror project.

---

## 1. System Context Diagram (C4 Level 1)

**Description:**  
This diagram shows the SmartMirror system boundary, its primary users (End Users, Administrators), and external systems it integrates with (Ollama LLM, OAuth Providers, Email Service, External APIs for weather/news).

```mermaid
C4Context
    title System Context Diagram - SmartMirror Platform

    Person(endUser, "End User", "FabLab member or visitor interacting with the smart mirror")
    Person(admin, "Administrator", "Manages users, reservations, and system configuration")
    
    System_Boundary(smartMirror, "SmartMirror System") {
        System(mirrorUI, "MagicMirror UI", "Interactive smart mirror interface with modules")
        System(backend, "Spring Boot Backend", "Core business logic, user management, reservations")
        System(aiBackend, "AI Backend", "Face recognition and LLM chat services")
        SystemDb(database, "PostgreSQL + pgvector", "Stores users, reservations, face embeddings")
    }
    
    System_Ext(ollama, "Ollama LLM", "Local language model for conversational AI")
    System_Ext(oauth, "OAuth2 Providers", "Google/GitHub authentication")
    System_Ext(email, "Email Service", "SMTP server for notifications")
    System_Ext(weatherAPI, "Weather API", "OpenMeteo weather data")
    System_Ext(newsAPI, "News RSS Feeds", "External news sources")
    
    Rel(endUser, mirrorUI, "Interacts with", "HTTP/WebSocket")
    Rel(admin, backend, "Manages", "HTTPS/REST")
    
    Rel(mirrorUI, backend, "Fetches data", "REST API")
    Rel(mirrorUI, aiBackend, "Face recognition, Chat", "REST API")
    Rel(backend, database, "Reads/Writes", "JDBC")
    Rel(aiBackend, database, "Stores/Queries embeddings", "JDBC/pgvector")
    Rel(aiBackend, ollama, "Queries", "HTTP API")
    Rel(backend, oauth, "Authenticates", "OAuth2")
    Rel(backend, email, "Sends notifications", "SMTP")
    Rel(mirrorUI, weatherAPI, "Fetches weather", "HTTP")
    Rel(mirrorUI, newsAPI, "Fetches news", "RSS/HTTP")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 2. Container Diagram (C4 Level 2)

**Description:**  
This diagram shows the major containers (deployable components) within the SmartMirror system: MagicMirror Frontend, Spring Boot Backend API, FastAPI AI Backend, PostgreSQL with pgvector extension, and Ollama LLM service. It also depicts how these containers communicate.

```mermaid
C4Container
    title Container Diagram - SmartMirror Architecture

    Person(user, "User", "Interacts with smart mirror")
    
    Container_Boundary(frontend, "Frontend Layer") {
        Container(magicMirror, "MagicMirror", "Node.js, Electron, Socket.io", "Smart mirror UI with modular widgets")
        Container(modules, "MM Modules", "JavaScript", "Weather, News, Camera, Compliments modules")
    }
    
    Container_Boundary(backend, "Backend Layer") {
        Container(springBoot, "Spring Boot API", "Java 17, Spring Boot 3.4", "REST API for business logic, auth, reservations")
        Container(fastAPI, "AI Backend", "Python, FastAPI", "Face recognition (InsightFace) and LLM chat")
    }
    
    Container_Boundary(data, "Data Layer") {
        ContainerDb(postgres, "PostgreSQL", "PostgreSQL 15 + pgvector", "Stores users, reservations, face embeddings (512-dim vectors)")
    }
    
    Container_Boundary(services, "External Services") {
        Container(ollama, "Ollama LLM", "Local LLM Service", "Conversational AI model")
        Container(ngrok, "Ngrok Tunnels", "Reverse Proxy", "Exposes local services publicly")
    }
    
    Rel(user, magicMirror, "Views/Interacts", "HTTP, WebSocket")
    Rel(magicMirror, modules, "Loads", "JavaScript")
    Rel(magicMirror, springBoot, "API Calls", "REST/JSON")
    Rel(magicMirror, fastAPI, "Face & Chat", "REST/JSON")
    
    Rel(springBoot, postgres, "CRUD Operations", "JDBC/JPA")
    Rel(fastAPI, postgres, "Vector Search", "pgvector SQL")
    Rel(fastAPI, ollama, "Chat Requests", "HTTP/JSON")
    Rel(fastAPI, springBoot, "User Profile", "REST API")
    
    Rel(ngrok, springBoot, "Proxies", "HTTP")
    Rel(ngrok, magicMirror, "Proxies", "HTTP")
    
    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="2")
```

---

## 3. Component Diagram - Spring Boot Backend

**Description:**  
This diagram details the internal components of the Spring Boot backend container, showing controllers, services, repositories, security configuration, and their interactions.

```mermaid
C4Component
    title Component Diagram - Spring Boot Backend

    Container_Boundary(springBoot, "Spring Boot Backend") {
        Component(authController, "AuthController", "REST Controller", "Handles login, registration, OAuth2")
        Component(userController, "UserController", "REST Controller", "User CRUD operations")
        Component(reservationController, "ReservationController", "REST Controller", "Manages reservations")
        Component(faceController, "FaceRecognitionController", "REST Controller", "Saves face embeddings")
        
        Component(authService, "AuthService", "Service", "Authentication business logic")
        Component(userService, "UserServiceImpl", "Service", "User management logic")
        Component(reservationService, "ReservationServiceImpl", "Service", "Reservation logic")
        Component(faceService, "FaceRecognitionServiceImpl", "Service", "Face data management")
        Component(emailService, "EmailService", "Service", "Sends email notifications")
        
        Component(userRepo, "UserRepository", "JPA Repository", "User entity persistence")
        Component(reservationRepo, "ReservationRepository", "JPA Repository", "Reservation persistence")
        Component(faceRepo, "FaceDataRepository", "JPA Repository", "FaceData persistence")
        
        Component(security, "SecurityConfiguration", "Spring Security", "JWT auth, OAuth2, CORS")
        Component(jwtUtil, "JwtTokenProvider", "Utility", "Generate/validate JWT tokens")
    }
    
    ContainerDb(postgres, "PostgreSQL", "Database")
    Container(aiBackend, "AI Backend", "FastAPI")
    
    Rel(authController, authService, "Uses")
    Rel(userController, userService, "Uses")
    Rel(reservationController, reservationService, "Uses")
    Rel(faceController, faceService, "Uses")
    
    Rel(authService, userRepo, "Queries")
    Rel(authService, jwtUtil, "Generates tokens")
    Rel(authService, emailService, "Sends emails")
    Rel(userService, userRepo, "CRUD")
    Rel(reservationService, reservationRepo, "CRUD")
    Rel(faceService, faceRepo, "CRUD")
    
    Rel(userRepo, postgres, "Reads/Writes", "JPA/JDBC")
    Rel(reservationRepo, postgres, "Reads/Writes", "JPA/JDBC")
    Rel(faceRepo, postgres, "Reads/Writes", "JPA/JDBC")
    
    Rel(security, authController, "Secures")
    Rel(security, userController, "Secures")
    Rel(security, reservationController, "Secures")
    
    Rel(aiBackend, faceController, "Sends embeddings", "HTTP POST")
    
    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
```

---

## 4. Component Diagram - AI Backend (FastAPI)

**Description:**  
This diagram shows the internal structure of the AI Backend, including API routes, services for face recognition and LLM integration, and the models/detectors used.

```mermaid
C4Component
    title Component Diagram - AI Backend (FastAPI)

    Container_Boundary(aiBackend, "AI Backend (FastAPI)") {
        Component(faceRouter, "FaceRouter", "API Routes", "POST /api/face-recognition/extract-embedding")
        Component(llmRouter, "LLMRouter", "API Routes", "POST /llm/chat")
        Component(healthRouter, "HealthRouter", "API Routes", "GET /api/health")
        
        Component(faceService, "FaceService", "Service", "Face detection and embedding extraction")
        Component(llmClient, "LLMClient", "Service", "Queries Ollama LLM with context")
        Component(apiClient, "APIClient", "HTTP Client", "Communicates with Spring Backend")
        
        Component(faceDetector, "FaceDetector", "Model", "InsightFace model for face embeddings")
        Component(fabLabDocs, "FabLab Docs Loader", "Context", "Loads FabLab documentation for LLM")
    }
    
    Container(ollama, "Ollama LLM", "LLM Service")
    Container(springBoot, "Spring Boot API", "Backend")
    ContainerDb(postgres, "PostgreSQL + pgvector", "Database")
    
    Rel(faceRouter, faceService, "Calls")
    Rel(llmRouter, llmClient, "Calls")
    
    Rel(faceService, faceDetector, "Uses", "InsightFace")
    Rel(faceService, apiClient, "Sends embedding", "HTTP POST")
    Rel(llmClient, ollama, "Queries", "HTTP/JSON")
    Rel(llmClient, apiClient, "Fetches user profile", "HTTP GET")
    Rel(llmClient, fabLabDocs, "Loads context")
    
    Rel(apiClient, springBoot, "HTTP requests", "REST")
    Rel(faceDetector, postgres, "Stores vectors", "pgvector")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 5. Class Diagram - Core Domain Models

**Description:**  
This UML class diagram represents the main domain entities in the Spring Boot backend: User (with Employee and Client subtypes), Reservation, FaceData, and UserConnectedAccount. It shows their attributes, relationships, and inheritance hierarchy.

```mermaid
classDiagram
    class AbstractEntity {
        <<abstract>>
        +Long id
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }
    
    class User {
        <<Entity>>
        +String email
        +String firstName
        +String lastName
        +String phoneNum
        +int age
        +Sexe sexe
        +String trainingLocation
        +String profileImageUrl
        +String password
        +UserRole userRole
        +getUsername() String
        +getAuthorities() Collection~GrantedAuthority~
    }
    
    class Employee {
        <<Entity>>
        +String position
        +String department
    }
    
    class Client {
        <<Entity>>
        +String company
        +String billingAddress
    }
    
    class Reservation {
        <<Entity>>
        +Activity activity
        +AgeGroup ageGroup
        +Task task
        +LocalDate date
        +LocalTime startTime
        +Duration duration
    }
    
    class FaceData {
        <<Entity>>
        +float[] embedding
        +LocalDateTime createdAt
    }
    
    class UserConnectedAccount {
        <<Entity>>
        +String provider
        +String providerId
        +String accessToken
    }
    
    class UserRole {
        <<enumeration>>
        USER
        ADMIN
        EMPLOYEE
    }
    
    class Sexe {
        <<enumeration>>
        MALE
        FEMALE
        OTHER
    }
    
    class Activity {
        <<enumeration>>
        WORKSHOP
        TRAINING
        MACHINE_USE
        EVENT
    }
    
    class AgeGroup {
        <<enumeration>>
        CHILD
        TEEN
        ADULT
        SENIOR
    }
    
    AbstractEntity <|-- User
    User <|-- Employee
    User <|-- Client
    AbstractEntity <|-- Reservation
    AbstractEntity <|-- FaceData
    AbstractEntity <|-- UserConnectedAccount
    
    User "1" -- "0..1" FaceData : has >
    User "1" -- "0..*" Reservation : makes >
    User "1" -- "0..*" UserConnectedAccount : links >
    
    User ..> UserRole : uses
    User ..> Sexe : uses
    Reservation ..> Activity : uses
    Reservation ..> AgeGroup : uses
```

---

## 6. Sequence Diagram - User Authentication Flow (Login)

**Description:**  
This sequence diagram illustrates the authentication workflow when a user logs in using email/password. It shows interaction between the MagicMirror UI, Spring Boot backend, security components, and database.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant MM as MagicMirror UI
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant Security as SecurityConfig
    participant UserRepo as UserRepository
    participant JWT as JwtTokenProvider
    participant DB as PostgreSQL

    User->>MM: Enter credentials (email, password)
    MM->>AuthCtrl: POST /api/auth/login {email, password}
    AuthCtrl->>AuthSvc: authenticate(LoginRequest)
    AuthSvc->>Security: authenticate(email, password)
    Security->>UserRepo: findByEmail(email)
    UserRepo->>DB: SELECT * FROM users WHERE email = ?
    DB-->>UserRepo: User record
    UserRepo-->>Security: User entity
    Security->>Security: passwordEncoder.matches(password, user.password)
    
    alt Password valid
        Security-->>AuthSvc: Authentication success
        AuthSvc->>JWT: generateToken(user)
        JWT-->>AuthSvc: JWT token
        AuthSvc-->>AuthCtrl: AuthResponse(token, user)
        AuthCtrl-->>MM: 200 OK {token, userDetails}
        MM->>MM: Store token in localStorage
        MM-->>User: Redirect to dashboard
    else Password invalid
        Security-->>AuthSvc: AuthenticationException
        AuthSvc-->>AuthCtrl: Exception
        AuthCtrl-->>MM: 401 Unauthorized
        MM-->>User: Show error message
    end
```

---

## 7. Sequence Diagram - Face Recognition Flow

**Description:**  
This sequence diagram depicts the workflow when a user registers their face embedding. It involves capturing an image, extracting the embedding via AI Backend (InsightFace), and storing it in the database via Spring Boot backend.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant MM as MagicMirror UI
    participant AIBackend as FastAPI AI Backend
    participant FaceDetector as InsightFace Model
    participant APIClient as API Client
    participant SpringBoot as Spring Boot Backend
    participant FaceService as FaceRecognitionService
    participant DB as PostgreSQL (pgvector)

    User->>MM: Click "Register Face"
    MM->>MM: Capture image from camera
    MM->>AIBackend: POST /api/face-recognition/extract-embedding<br/>{userId, imageFile}
    AIBackend->>AIBackend: Save temp file
    AIBackend->>FaceDetector: get_embedding(imagePath)
    FaceDetector->>FaceDetector: Detect face & extract 512-dim vector
    FaceDetector-->>AIBackend: embedding[512]
    
    AIBackend->>APIClient: send_embedding(userId, embedding)
    APIClient->>SpringBoot: POST /api/face-recognition/save_embedding<br/>{userId, embedding}
    SpringBoot->>FaceService: saveFaceEmbedding(userId, embedding)
    FaceService->>DB: INSERT INTO face_data (user_id, embedding, created_at)<br/>VALUES (?, ?::vector, NOW())
    DB-->>FaceService: Success
    FaceService-->>SpringBoot: FaceData entity
    SpringBoot-->>APIClient: 200 OK {status: "success"}
    APIClient-->>AIBackend: Response
    AIBackend-->>MM: 200 OK {status: "success", embedding, backend_response}
    MM-->>User: Display "Face registered successfully"
```

---

## 8. Sequence Diagram - LLM Chat Flow

**Description:**  
This diagram shows how a user interacts with the LLM chatbot. The AI Backend fetches the user profile from Spring Boot, enriches the prompt with FabLab documentation context, and queries the Ollama LLM service.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant MM as MagicMirror UI
    participant AIBackend as FastAPI AI Backend
    participant APIClient as API Client
    participant SpringBoot as Spring Boot Backend
    participant UserService as UserService
    participant DB as PostgreSQL
    participant FabLabDocs as FabLab Docs Loader
    participant Ollama as Ollama LLM Service

    User->>MM: Type message in chat
    MM->>AIBackend: POST /llm/chat {prompt, userId}
    
    alt userId provided
        AIBackend->>APIClient: fetch_ai_profile(userId)
        APIClient->>SpringBoot: GET /api/users/{userId}/ai-profile
        SpringBoot->>UserService: getUserProfile(userId)
        UserService->>DB: SELECT user, preferences, role FROM users WHERE id = ?
        DB-->>UserService: User data
        UserService-->>SpringBoot: UserProfileDTO
        SpringBoot-->>APIClient: 200 OK {userId, fullName, ageGroup, role, language, notes}
        APIClient-->>AIBackend: user_profile
        AIBackend->>AIBackend: Enrich prompt with user context
    end
    
    AIBackend->>FabLabDocs: load_fablabs_docs()
    FabLabDocs-->>AIBackend: fablabs_context (docs content)
    AIBackend->>AIBackend: Build enriched_prompt =<br/>[USER_PROFILE] + [FABLAB_CONTEXT] + prompt
    
    AIBackend->>Ollama: POST /api/generate {model, prompt: enriched_prompt}
    Ollama->>Ollama: Generate response
    Ollama-->>AIBackend: {response: "AI response text"}
    AIBackend-->>MM: 200 OK {response: "AI response text"}
    MM-->>User: Display chatbot response
```

---

## 9. Deployment Diagram

**Description:**  
This diagram illustrates how the SmartMirror system components are deployed across Docker containers, showing the infrastructure setup with Docker Compose, networking, volumes, and external service connections.

```mermaid
graph TB
    subgraph "Host Machine (Linux/Docker)"
        subgraph "Docker Network: smartmirror_network"
            
            subgraph "Backend Container<br/>(smartmirror-backend)"
                SpringBoot[Spring Boot API<br/>Port: 8080<br/>Java 17]
            end
            
            subgraph "AI Backend Container<br/>(AI_backend)"
                FastAPI[FastAPI AI Backend<br/>Port: 8000<br/>Python]
            end
            
            subgraph "Database Container<br/>(SmartMirror-db)"
                Postgres[PostgreSQL 15<br/>+ pgvector<br/>Port: 5432]
            end
            
            subgraph "LLM Container<br/>(ollama_service)"
                Ollama[Ollama LLM<br/>Port: 11434]
            end
            
            subgraph "Web UI Container<br/>(pgweb_dev)"
                PgWeb[PgWeb UI<br/>Port: 55432]
            end
            
            subgraph "Ngrok Tunnels"
                NgrokBack[Ngrok Backend<br/>Exposes :8080]
                NgrokFront[Ngrok Frontend<br/>Exposes :5173]
            end
        end
        
        subgraph "Host Process (Outside Docker)"
            MagicMirror[MagicMirror UI<br/>Node.js/Electron<br/>Port: 5173]
        end
        
        subgraph "Docker Volumes"
            PgData[pgdata<br/>PostgreSQL data]
            InsightFace[insightface_models<br/>AI models]
            LLMModels[llm_models<br/>Ollama models]
            AIKnowledge[ai_knowledge<br/>FabLab docs]
        end
    end
    
    subgraph "External Services"
        Internet[Internet Users]
        OAuth[OAuth2 Providers<br/>Google, GitHub]
        SMTP[Email SMTP Server]
        WeatherAPI[Weather API<br/>OpenMeteo]
    end
    
    MagicMirror -->|REST API| SpringBoot
    MagicMirror -->|Face/Chat API| FastAPI
    SpringBoot -->|JDBC| Postgres
    FastAPI -->|pgvector| Postgres
    FastAPI -->|HTTP API| Ollama
    FastAPI -->|User Profile| SpringBoot
    PgWeb -->|DB Admin| Postgres
    
    Postgres -.->|Persists| PgData
    FastAPI -.->|Loads| InsightFace
    FastAPI -.->|Loads| AIKnowledge
    Ollama -.->|Loads| LLMModels
    
    NgrokBack -->|Tunnel| SpringBoot
    NgrokFront -->|Tunnel| MagicMirror
    Internet -->|HTTPS| NgrokBack
    Internet -->|HTTPS| NgrokFront
    
    SpringBoot -->|OAuth2| OAuth
    SpringBoot -->|SMTP| SMTP
    MagicMirror -->|HTTP| WeatherAPI
    
    classDef container fill:#326CE5,stroke:#fff,stroke-width:2px,color:#fff
    classDef volume fill:#FF6B6B,stroke:#fff,stroke-width:2px,color:#fff
    classDef external fill:#4ECDC4,stroke:#fff,stroke-width:2px,color:#fff
    
    class SpringBoot,FastAPI,Postgres,Ollama,PgWeb,MagicMirror,NgrokBack,NgrokFront container
    class PgData,InsightFace,LLMModels,AIKnowledge volume
    class Internet,OAuth,SMTP,WeatherAPI external
```

---

## 10. Database ER Diagram

**Description:**  
Entity-Relationship diagram showing the database schema with tables for users, reservations, face_data (with pgvector embeddings), and user_connected_accounts. The diagram shows primary keys, foreign keys, and key attributes.

```mermaid
erDiagram
    USERS ||--o{ RESERVATIONS : makes
    USERS ||--o| FACE_DATA : has
    USERS ||--o{ USER_CONNECTED_ACCOUNTS : links
    
    USERS {
        bigint id PK
        varchar email UK
        varchar first_name
        varchar last_name
        varchar phone_num
        int age
        varchar sexe
        varchar training_location
        varchar profile_image_url
        varchar password
        varchar user_role
        varchar user_type
        timestamp created_at
        timestamp updated_at
    }
    
    RESERVATIONS {
        bigint id PK
        bigint user_id FK
        varchar activity
        varchar age_group
        varchar task
        date date
        time start_time
        interval duration
        timestamp created_at
        timestamp updated_at
    }
    
    FACE_DATA {
        bigint id PK
        bigint user_id FK UK
        vector_512 embedding
        timestamp created_at
        timestamp updated_at
    }
    
    USER_CONNECTED_ACCOUNTS {
        bigint id PK
        bigint user_id FK
        varchar provider
        varchar provider_id
        varchar access_token
        timestamp created_at
        timestamp updated_at
    }
```

---

## 11. State Machine Diagram - Reservation Lifecycle

**Description:**  
This state diagram represents the lifecycle of a reservation entity, from creation through various states (pending, confirmed, in-progress, completed, cancelled) based on user and system actions.

**Assumption:** The reservation system includes status tracking (not explicitly found in current code, but typical for reservation systems).

```mermaid
stateDiagram-v2
    [*] --> Draft: User starts creating reservation
    Draft --> Pending: Submit reservation
    Pending --> Confirmed: Admin/System approves
    Pending --> Rejected: Admin rejects
    
    Confirmed --> InProgress: Start time reached & user checks in
    Confirmed --> Cancelled: User cancels before start
    Confirmed --> NoShow: Start time passed, no check-in
    
    InProgress --> Completed: End time reached
    InProgress --> Cancelled: Emergency cancellation
    
    Completed --> [*]
    Cancelled --> [*]
    Rejected --> [*]
    NoShow --> [*]
    
    note right of Pending
        Email notification sent
        to user and admin
    end note
    
    note right of InProgress
        Resources locked
        for this user
    end note
```

---

## 12. Component Interaction Diagram - MagicMirror Modules

**Description:**  
This diagram shows how MagicMirror's modular architecture works, with the core application loading and communicating with various modules (weather, news, camera, compliments, custom modules) via Socket.io and the module API.

```mermaid
graph TB
    subgraph "MagicMirror Core"
        App[App.js<br/>Main Application]
        Loader[Loader.js<br/>Module Loader]
        SocketClient[Socket Client<br/>WebSocket Communication]
        Server[Server.js<br/>Express + Socket.io]
    end
    
    subgraph "Default Modules"
        Clock[Clock Module<br/>Time Display]
        Weather[Weather Module<br/>OpenMeteo API]
        News[News Feed Module<br/>RSS Parser]
        Compliments[Compliments Module<br/>Random Messages]
    end
    
    subgraph "Custom Modules"
        Camera[Camera Module<br/>Face Detection UI]
        ReactMF[React Microfrontend<br/>Custom Components]
    end
    
    subgraph "Backend Services"
        SpringAPI[Spring Boot API<br/>:8080]
        AIAPI[AI Backend<br/>:8000]
    end
    
    App --> Loader
    Loader --> Clock
    Loader --> Weather
    Loader --> News
    Loader --> Compliments
    Loader --> Camera
    Loader --> ReactMF
    
    App --> SocketClient
    SocketClient <--> Server
    
    Weather -->|HTTP GET| WeatherAPI[OpenMeteo API]
    News -->|HTTP GET| RSSAPI[RSS Feeds]
    Camera -->|REST API| AIAPI
    ReactMF -->|REST API| SpringAPI
    
    Server -->|File Serving| App
    
    classDef core fill:#FF6B6B,stroke:#333,stroke-width:2px
    classDef module fill:#4ECDC4,stroke:#333,stroke-width:2px
    classDef backend fill:#95E1D3,stroke:#333,stroke-width:2px
    
    class App,Loader,SocketClient,Server core
    class Clock,Weather,News,Compliments,Camera,ReactMF module
    class SpringAPI,AIAPI backend
```

---

## 13. CI/CD Pipeline Flow (Assumed)

**Description:**  
This diagram represents a typical CI/CD pipeline for the SmartMirror project. While not explicitly defined in the repository, this shows a standard workflow for development, testing, building, and deployment.

**Assumption:** CI/CD pipeline using GitHub Actions or similar CI tool.

```mermaid
flowchart LR
    Start([Developer Push]) --> GitCommit[Git Commit<br/>to main/develop]
    GitCommit --> Trigger[Trigger CI Pipeline]
    
    Trigger --> Lint{Code Quality<br/>Checks}
    Lint -->|ESLint, Prettier| LintJS[Lint JavaScript]
    Lint -->|Maven Checkstyle| LintJava[Lint Java]
    Lint -->|Black, Flake8| LintPython[Lint Python]
    
    LintJS --> Test
    LintJava --> Test
    LintPython --> Test
    
    Test{Run Tests} -->|Jest| TestFrontend[Frontend Tests]
    Test -->|JUnit| TestBackend[Spring Tests]
    Test -->|Pytest| TestAI[AI Backend Tests]
    
    TestFrontend --> Build
    TestBackend --> Build
    TestAI --> Build
    
    Build{Build<br/>Artifacts} -->|npm build| BuildFE[Build MagicMirror]
    Build -->|Maven package| BuildBE[Build Spring JAR]
    Build -->|Docker build| BuildAI[Build AI Image]
    
    BuildFE --> DockerCompose
    BuildBE --> DockerCompose
    BuildAI --> DockerCompose
    
    DockerCompose[Build Docker Images] --> Push[Push to Registry<br/>Docker Hub/GHCR]
    Push --> Deploy{Deploy}
    
    Deploy -->|Dev| DevEnv[Dev Environment]
    Deploy -->|Staging| StagingEnv[Staging Environment]
    Deploy -->|Prod| ProdEnv[Production Environment]
    
    DevEnv --> Notify
    StagingEnv --> Notify
    ProdEnv --> Notify
    
    Notify[Notify Team<br/>Slack/Email] --> End([Pipeline Complete])
    
    classDef checkNode fill:#FFD93D,stroke:#333,stroke-width:2px
    classDef buildNode fill:#6BCB77,stroke:#333,stroke-width:2px
    classDef deployNode fill:#4D96FF,stroke:#333,stroke-width:2px
    
    class Lint,Test checkNode
    class Build,DockerCompose,Push buildNode
    class Deploy,DevEnv,StagingEnv,ProdEnv deployNode
```

---

## 14. Data Flow Diagram - Face Recognition System

**Description:**  
This DFD shows how data flows through the face recognition subsystem: from image capture, through embedding extraction, storage in pgvector database, and retrieval for authentication/matching.

```mermaid
flowchart TB
    User([User])
    Camera[Camera Device]
    
    subgraph "Data Capture"
        ImageCapture[Image Capture<br/>MagicMirror Camera Module]
        ImageData[(Image Binary Data)]
    end
    
    subgraph "AI Processing"
        AIBackend[AI Backend<br/>FastAPI]
        InsightFace[InsightFace Model<br/>Face Detection]
        Embedding[Embedding Extraction<br/>512-dimensional vector]
    end
    
    subgraph "Data Storage"
        SpringBackend[Spring Boot Backend]
        Validation[Validate User<br/>& Embedding]
        PGVector[(PostgreSQL<br/>pgvector extension)]
    end
    
    subgraph "Face Matching"
        SearchQuery[Vector Similarity Search<br/>Cosine Distance]
        Match{Match Found?}
        AuthResult[Authentication Result]
    end
    
    User -->|Faces camera| Camera
    Camera -->|Streams video| ImageCapture
    ImageCapture -->|Sends frame| ImageData
    
    ImageData -->|POST /extract-embedding| AIBackend
    AIBackend -->|Process image| InsightFace
    InsightFace -->|Detect face| Embedding
    
    Embedding -->|Send embedding + userId| SpringBackend
    SpringBackend --> Validation
    Validation -->|Store vector| PGVector
    
    PGVector -.->|Query for login| SearchQuery
    SearchQuery --> Match
    Match -->|Distance < threshold| AuthResult
    Match -->|Distance >= threshold| AuthFail[Authentication Failed]
    
    AuthResult -->|Success| User
    AuthFail -->|Retry or manual login| User
    
    classDef process fill:#4ECDC4,stroke:#333,stroke-width:2px
    classDef storage fill:#FF6B6B,stroke:#333,stroke-width:2px
    classDef decision fill:#FFD93D,stroke:#333,stroke-width:2px
    
    class ImageCapture,AIBackend,InsightFace,Embedding,SpringBackend,Validation,SearchQuery process
    class ImageData,PGVector storage
    class Match decision
```

---

## 15. Architecture Decision Records (ADR) Summary Diagram

**Description:**  
This diagram visualizes key architectural decisions made in the SmartMirror project, showing technology choices and their justifications.

```mermaid
mindmap
    root((SmartMirror<br/>Architecture<br/>Decisions))
        Frontend
            MagicMirror Platform
                Modular architecture
                Electron for desktop app
                Socket.io for real-time
            Node.js v22+
                LTS support
                Modern JavaScript
        Backend
            Spring Boot 3.4
                Enterprise-grade
                JPA/Hibernate ORM
                Spring Security
            Java 17
                LTS version
                Modern features
            FastAPI Python
                Async support
                Fast development
                AI/ML integration
        Database
            PostgreSQL 15
                ACID compliance
                Mature ecosystem
            pgvector Extension
                Vector similarity search
                512-dim embeddings
                Cosine distance
        AI/ML
            InsightFace
                SOTA face recognition
                512-dim embeddings
                ONNX runtime
            Ollama
                Local LLM deployment
                Privacy-focused
                Customizable models
        Infrastructure
            Docker Compose
                Multi-container orchestration
                Development parity
                Easy deployment
            Ngrok
                External access
                Webhook testing
                Demo purposes
        Security
            JWT Authentication
                Stateless
                Scalable
                Standard
            OAuth2
                Google/GitHub login
                Secure delegation
            Spring Security
                Battle-tested
                Filter chain
                CORS handling
```

---

## Summary

These 15 comprehensive diagrams provide a complete technical overview of the SmartMirror project:

1. **System Context** - High-level view of users, system, and external dependencies
2. **Container Diagram** - Major deployable components and their interactions
3. **Component Diagram (Spring Boot)** - Internal structure of backend API
4. **Component Diagram (AI Backend)** - Internal structure of AI services
5. **Class Diagram** - Core domain model entities and relationships
6. **Sequence Diagram (Authentication)** - Login workflow
7. **Sequence Diagram (Face Recognition)** - Face registration process
8. **Sequence Diagram (LLM Chat)** - Chatbot interaction flow
9. **Deployment Diagram** - Docker infrastructure and networking
10. **Database ER Diagram** - Data model and relationships
11. **State Machine Diagram** - Reservation lifecycle states
12. **Component Interaction** - MagicMirror module architecture
13. **CI/CD Pipeline** - Build and deployment workflow (assumed)
14. **Data Flow Diagram** - Face recognition data processing
15. **ADR Summary** - Architectural decision visualization

These diagrams are ready for use in technical presentations, documentation, or architectural reviews. They follow standard notations (C4, UML, ERD) and can be rendered using Mermaid-compatible tools.
