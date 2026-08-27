# Spring Boot Banking API

![Java 17](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![CI/CD](https://img.shields.io/badge/CI-GitHub_Actions-brightgreen)

## 1. Executive Summary
This repository serves as a portfolio project demonstrating Senior Java/Spring Boot backend engineering skills. It is a robust, production-ready RESTful API that handles core banking operations including account creation, balance management, and highly concurrent transactional fund transfers.

## 2. Core Features
- **Customer Management**: Register and retrieve customer profiles.
- **Account Management**: Create and manage multiple bank accounts per customer.
- **Transactional Transfers**: Transfer funds atomically between accounts with strict validation (e.g., sufficient balance checks, self-transfer blocks, and active status checks).
- **Transaction History**: Audit trail of all successful fund transfers.

## 3. Technology Stack
- **Language**: Java 17
- **Framework**: Spring Boot 4.1.1 (Spring Web MVC, Spring Data JPA, Spring Security, Spring Validation)
- **Database**: MySQL 8.0 (Production) / H2 (Testing)
- **Database Migrations**: Flyway
- **Containerization**: Docker & Docker Compose
- **Continuous Integration**: GitHub Actions
- **API Documentation**: OpenAPI (Swagger)

## 4. Architecture & Domain Model
The application follows a clean 3-tier architecture:
`Controller Layer` → `Service Layer` → `Repository Layer`

### Domain Model
1. **Customer**: Represents the bank's clients.
2. **Account**: Represents financial accounts tied to a `Customer`. Supports optimistic locking for concurrency control.
3. **Transaction**: Immutable ledger entries recording fund transfers between a source and destination `Account`.

## 5. Key Engineering Decisions
- **Optimistic Locking (`@Version`)**: The `Account` entity implements JPA optimistic locking to prevent lost updates during concurrent transactions. Lock failures are elegantly mapped to HTTP 409 Conflict via the `GlobalExceptionHandler`.
- **Transaction Boundaries (`@Transactional`)**: Fund transfers are strictly bound within ACID transactions to ensure atomic balance deductions, credits, and ledger persistence.
- **DTO Isolation**: Strict separation between persistence entities and API contracts ensures internal database models never leak to the client.
- **Centralized Exception Handling**: A `@RestControllerAdvice` intercepts business exceptions (e.g., `InsufficientBalanceException`) and maps them to RFC 7807 `ProblemDetail` responses.
- **Flyway Schema Management**: Database schema migrations are strictly version-controlled. Hibernate's `ddl-auto` is set to `validate` in production to prevent unexpected ORM-driven schema changes.

## 6. API Documentation
Once the application is running, the interactive OpenAPI (Swagger) documentation can be accessed at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`

## 7. Running Locally (Docker)
The easiest way to run the application is via Docker Compose, which automatically provisions a MySQL 8.0 container and builds the application image.

```bash
# Start the database and API in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f
```

*(Note: The `docker-compose.yml` and `application.yml` files contain default passwords like `rootpassword` and `password`. These are intended strictly for local development and demonstration purposes, not production environments.)*

## 8. Running Tests
The project contains a comprehensive suite of unit and integration tests (using Mockito and `@DataJpaTest`). To execute the test suite:

```bash
# Linux/macOS
./mvnw clean verify

# Windows
.\mvnw.cmd clean verify
```

## 9. CI Pipeline
This repository uses GitHub Actions for Continuous Integration. Every push and pull request to the `main` branch triggers a workflow that provisions a JDK 17 runner, caches Maven dependencies, and executes `./mvnw clean verify` to enforce code quality and test success before any merge.

## 10. Future Enhancements
To demonstrate forward-thinking architecture, the following features are excellent candidates for future iterations:
- **JWT Security**: Replace the current auto-configured Basic Authentication with a stateless JWT-based OAuth2 implementation.
- **Redis Caching**: Implement distributed caching for high-read endpoints like transaction history.
- **Retry Mechanisms**: Add `@Retryable` to automatically recover from `ObjectOptimisticLockingFailureException` during high-concurrency fund transfers.
