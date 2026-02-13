# Article CRUD Application
Test task by Grigory Ivanov

## Description Below is AI Generated

### Project structure
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

## Author

Grigory Ivanov