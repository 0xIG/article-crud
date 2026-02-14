# Article CRUD Application
Test task by Grigory Ivanov

## Description

A comprehensive RESTful API for managing articles with user authentication, built with NestJS, TypeScript, TypeORM, and PostgreSQL. The application features JWT-based authentication, role-based authorization, pagination, sorting, and comprehensive API documentation.

### Key Features
- **JWT Authentication**: Secure user authentication with token-based authorization
- **Article Management**: Full CRUD operations for articles with author ownership validation
- **Pagination & Sorting**: Flexible article listing with customizable pagination and sorting
- **Comprehensive Documentation**: Detailed JSDoc comments and Swagger API documentation
- **Type Safety**: Full TypeScript support with strict typing
- **Input Validation**: Robust validation using class-validator decorators
- **Database Migrations**: TypeORM migrations for schema versioning
- **Unit Testing**: Comprehensive test suite with Jest
- **Code Quality**: ESLint and Prettier for consistent code style

### Project Structure
```
src/
├── main.ts                  # Application entry point with Swagger setup
├── app.module.ts           # Root application module with configuration
├── route.ts               # Centralized route prefixes and constants
├── typeorm.config.ts      # TypeORM configuration for migrations
├── migrations/            # Database migration files
└── module/
    ├── auth/              # Authentication module
    │   ├── controller/    # Auth controller (signin/signup)
    │   ├── dto/          # Auth DTOs with validation and Swagger decorators
    │   ├── guard/        # JWT authentication guard
    │   ├── strategy/     # JWT strategy for Passport
    │   └── decorator/    # Custom decorators (e.g., @UserIdGet)
    ├── user/             # User module
    │   ├── entity/       # User entity definition with TypeORM decorators
    │   └── service/      # User service for database operations
    └── article/          # Article module
        ├── controller/   # Article CRUD endpoints with comprehensive documentation
        ├── dto/          # Article DTOs with detailed Swagger API properties
        ├── entity/       # Article entity definition with relationships
        └── service/      # Article business logic and data access
```

## Documentation Highlights

### API Documentation
- **Swagger UI**: Interactive API documentation available at `/api`
- **DTO Documentation**: All request/response DTOs include detailed Swagger decorators with examples, descriptions, and validation rules
- **Endpoint Documentation**: All controller methods include comprehensive JSDoc comments explaining parameters, returns, and error cases

### Code Documentation
- **Function Comments**: All public methods include JSDoc comments with parameter and return descriptions
- **Class Documentation**: All classes include descriptions of their purpose and usage
- **Type Documentation**: All interfaces and types include descriptions of their structure
- **Entity Documentation**: Database entities include field descriptions and constraints

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher) or use Docker
- **Docker** & **Docker Compose** (optional, for containerized deployment)

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd article-crud
   ```

2. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env  # Create from example if available
   # Or set manually:
   echo "JWT_SECRET=your-secret-key-here" >> .env
   echo "DB_HOST=localhost" >> .env
   echo "DB_PORT=5432" >> .env
   echo "DB_USERNAME=postgres" >> .env
   echo "DB_PASSWORD=postgres" >> .env
   echo "DB_DATABASE=article" >> .env
   ```

5. Run database migrations:
   ```bash
   npm run migration:run
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

7. Access the application:
   - **API Base URL**: http://localhost:3000
   - **Swagger Documentation**: http://localhost:3000/api
   - **Interactive API Testing**: Use Swagger UI to test endpoints directly

### Available Endpoints

#### Authentication (`/auth`)
- `POST /auth/signin` - Sign in with email and password (returns JWT token)
- `POST /auth/signup` - Register a new user account

#### Articles (`/article`)
- `GET /article/:id` - Get a specific article by ID
- `POST /article` - Create a new article (requires authentication)
- `PATCH /article/:id` - Update an existing article (requires authentication, author only)
- `DELETE /article/:id` - Delete an article (requires authentication, author only)
- `GET /article/list` - List articles with pagination and sorting

## Development

### Available Scripts

- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier
- `npm run migration:run` - Run database migrations
- `npm run migration:create` - Create a new migration

### Code Quality

The project maintains high code quality through:

- **ESLint**: Comprehensive linting rules with TypeScript support
- **Prettier**: Consistent code formatting across the codebase
- **TypeScript**: Strict type checking with no implicit any
- **JSDoc**: Comprehensive documentation for all public APIs
- **Unit Tests**: High test coverage with Jest

Run code quality checks:
```bash
# Lint and auto-fix
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Test with coverage report
npm run test:cov
```

## Testing

### Test Structure
The project includes comprehensive unit tests for:
- **Services**: Business logic and data access layer
- **Controllers**: HTTP request handling and response generation
- **DTOs**: Validation logic and data transformation

Run the test suite:
```bash
# All tests
npm run test

# Watch mode during development
npm run test:watch

# Test coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

### Current Test Coverage
- **Article Service**: 100% coverage
- **User Service**: 100% coverage  
- **Article Controller**: 100% coverage
- **Auth Controller**: 100% coverage

## Database Schema

### Users Table
- `id` (PK) - Auto-incrementing integer
- `email` - Unique, indexed (max 100 characters)
- `hash_password` - Hashed password using bcrypt (max 255 characters)
- `name` - User's full name (max 100 characters)
- `created_at` - Timestamp with timezone, indexed
- `updated_at` - Timestamp with timezone, auto-updated

### Articles Table
- `id` (PK) - Auto-incrementing integer
- `title` - Unique article title (max 255 characters)
- `description` - Article summary (max 1000 characters)
- `content` - Full article content (text type)
- `author_id` (FK) - References users.id (cascade on delete)
- `created_at` - Timestamp with timezone
- `updated_at` - Timestamp with timezone, auto-updated

## API Documentation Details

### Swagger Integration
The application uses `@nestjs/swagger` to automatically generate OpenAPI documentation. All DTOs include:
- **Property Descriptions**: Detailed explanations of each field
- **Validation Rules**: Minimum/maximum lengths, required fields, format constraints
- **Examples**: Sample values for each field
- **Type Information**: Data types and optional/required status

### Authentication Flow
1. **Sign Up**: Create a new user account with email, password, and name
2. **Sign In**: Authenticate with email/password to receive JWT token
3. **Protected Endpoints**: Include `Authorization: Bearer <token>` header
4. **Token Expiry**: JWT tokens expire after 6 hours for security

### Article Operations
- **Create**: Authenticated users can create articles with unique titles
- **Read**: Anyone can read articles, authors can read their own articles
- **Update**: Only the article author can update their articles
- **Delete**: Only the article author can delete their articles
- **List**: Public endpoint with pagination and sorting options

## Security Considerations

1. **Password Security**: Passwords hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Signed with configurable secret, expire after 6 hours
3. **Input Validation**: All inputs validated using class-validator decorators
4. **SQL Injection Prevention**: TypeORM parameterized queries prevent SQL injection
5. **CORS Protection**: Configured through NestJS middleware
6. **Sensitive Data Exclusion**: Passwords excluded from API responses
7. **Authentication Required**: Protected endpoints require valid JWT tokens
8. **Author Authorization**: Article operations restricted to authors only

## Recent Improvements

### Documentation Enhancements
- **Comprehensive JSDoc Comments**: All functions, classes, interfaces, and types now include detailed documentation
- **Swagger API Documentation**: Enhanced DTO property descriptions with examples, constraints, and notes
- **Improved README**: Updated project description, structure overview, and usage instructions

### Code Quality
- **Linting Compliance**: All code passes ESLint with strict TypeScript rules
- **Test Coverage**: High test coverage across all modules
- **Type Safety**: Full TypeScript strict mode compliance

### Developer Experience
- **Clear Error Messages**: Descriptive error responses for all API endpoints
- **Intuitive API Design**: Consistent RESTful design patterns
- **Interactive Documentation**: Swagger UI for easy API exploration

## Author

Grigory Ivanov

---
*Built with NestJS, TypeScript, TypeORM, PostgreSQL, and comprehensive documentation*
