# Stage 1: Build the application
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

# Download all required dependencies into one layer
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the production image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add a non-root system user for security hardening
RUN addgroup -S spring && adduser -S spring -G spring

# Run as non-root user
USER spring:spring

COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
