# Article CRUD Application

A RESTful API for managing articles with user authentication, built with NestJS, TypeORM, and PostgreSQL. This application provides a complete backend solution for blog/article management with JWT-based authentication, role-based authorization, and comprehensive CRUD operations.

## Features

- **User Authentication**: Sign up and sign in with JWT token-based authentication
- **Article Management**: Full CRUD operations for articles (Create, Read, Update, Delete)
- **Authorization**: Users can only edit/delete their own articles
- **Pagination & Sorting**: List articles with pagination and customizable sorting
- **Swagger Documentation**: Interactive API documentation at `/api` endpoint
- **Database Migrations**: TypeORM migrations for database schema management
- **Docker Support**: PostgreSQL database ready with Docker Compose
- **Input Validation**: Comprehensive validation using class-validator decorators

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Language**: TypeScript
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (JSON Web Tokens) with Passport.js
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## Project Structure

```
src/
├── main.ts                  # Application entry point with Swagger setup
├── app.module.ts           # Root application module
├── route.ts               # Route prefixes and constants
├── typeorm.config.ts      # TypeORM configuration
├── migrations/            # Database migration files
└── module/
    ├── auth/              # Authentication module
    │   ├── controller/    # Auth controller (signin/signup)
    │   ├── dto/          # Auth DTOs with validation
    │   ├── guard/        # JWT authentication guard
    │   ├── strategy/     # JWT strategy for Passport
    │   └── decorator/    # Custom decorators (e.g., @UserIdGet)
    ├── user/             # User module
    │   ├── entity/       # User entity definition
    │   └── service/      # User service for database operations
    └── article/          # Article module
        ├── controller/   # Article CRUD endpoints
        ├── dto/          # Article DTOs with Swagger decorators
        ├── entity/       # Article entity definition
        └── service/      # Article business logic
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or use Docker)
- Docker & Docker Compose (optional)

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
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

### Without Docker

1. Ensure PostgreSQL is running locally

2. Create a database:
   ```sql
   CREATE DATABASE article;
   ```

3. Follow steps 3-7 from the Docker section above

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=article

# Application Port (optional)
PORT=3000
```

## Database Migrations

The project uses TypeORM migrations for database schema management:

- **Create new migration**: `npm run migration:create -- -n MigrationName`
- **Run migrations**: `npm run migration:run`
- **Sync schema** (development only): `npm run schema:sync`
- **Drop schema**: `npm run schema:drop`

## API Documentation

Once the application is running, access the interactive Swagger UI at:
```
http://localhost:3000/api
```

### Available Endpoints

#### Authentication (`/auth`)
- `GET /auth/signin` - Sign in with email and password (returns JWT token)
- `POST /auth/signup` - Register a new user account

#### Articles (`/article`)
- `GET /article/:id` - Get a specific article by ID
- `POST /article` - Create a new article (requires authentication)
- `PATCH /article/:id` - Update an existing article (requires authentication, author only)
- `DELETE /article/:id` - Delete an article (requires authentication, author only)
- `GET /article/list` - List articles with pagination and sorting

### Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Usage Examples

### 1. User Registration
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

### 2. User Login
```bash
curl -X GET http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Note**: The signin endpoint uses `GET` method with a request body. For production, consider changing this to `POST`.

### 3. Create Article (Authenticated)
```bash
curl -X POST http://localhost:3000/article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Introduction to NestJS",
    "description": "A comprehensive guide to building REST APIs with NestJS",
    "content": "# Introduction\nNestJS is a progressive Node.js framework..."
  }'
```

### 4. List Articles with Pagination
```bash
curl "http://localhost:3000/article/list?pageIndex=1&pageSize=10"
```

### 5. List Articles with Sorting
```bash
curl "http://localhost:3000/article/list?pageIndex=1&pageSize=10&sort[createdAt]=DESC"
```

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

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode

Run linting and formatting:
```bash
npm run lint
npm run format
```

## Testing

Run the test suite:
```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Schema

### Users Table
- `id` (PK) - Auto-incrementing integer
- `email` - Unique, indexed
- `hash_password` - Hashed password (bcrypt)
- `name` - User's full name
- `created_at` - Timestamp with timezone
- `updated_at` - Timestamp with timezone

### Articles Table
- `id` (PK) - Auto-incrementing integer
- `title` - Unique article title
- `description` - Article summary
- `content` - Full article content
- `author_id` (FK) - References users.id
- `created_at` - Timestamp with timezone
- `updated_at` - Timestamp with timezone

## Security Considerations

1. **Passwords**: Stored as bcrypt hashes (10 rounds)
2. **JWT Tokens**: Signed with secret key, expire after 6 hours
3. **Input Validation**: All inputs validated using class-validator
4. **SQL Injection**: Prevented through TypeORM parameterized queries
5. **CORS**: Configured through NestJS (adjust for production)
6. **Sensitive Data**: Passwords excluded from API responses

## Notes and Limitations

1. The signin endpoint uses `GET` method with a request body. This is unconventional for REST APIs and may cause issues with some HTTP clients or proxies. Consider changing to `POST` for production use.
2. Error messages are returned in plain text format.
3. No email verification for user registration.
4. No password reset functionality.
5. No rate limiting implemented.
6. No refresh token mechanism - JWT tokens expire after 6 hours.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

UNLICENSED - See the [LICENSE](LICENSE) file for details.

## Author

Grigory Ivanov

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.