# ========================
# Stage 1: Build
# ========================
FROM maven:3.9.4-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /workspace

# Copy pom first to leverage caching
COPY pom.xml ./

# Copy source code
COPY src ./src

# Build the JAR (skip tests if CI handles them)
RUN mvn clean package -DskipTests

# ========================
# Stage 2: Runtime
# ========================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /workspace/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Java options for production
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
