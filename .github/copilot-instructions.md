# Copilot Instructions for AI TikTok Autopublish Cloud

## Project Overview

This is an AI-powered TikTok autopublish system with a cloud backend and web dashboard. The system automates the creation and publishing of TikTok videos through integrated AI services (Sora/Runway for video generation, TTS for narration).

**Tech Stack:**
- Backend: Node.js (v18+) with Express
- Frontend: React with Vite
- Deployment: Railway/Render (cloud hosting)
- Database: JSON file-based storage

## Project Structure

```
autopublish_cloud_project_railway/
├── backend/          # Node.js API and business logic
│   ├── src/
│   │   ├── server.js         # Express server entry point
│   │   ├── config.js         # Configuration management
│   │   ├── db.js             # JSON database handling
│   │   ├── routes/           # API endpoints
│   │   └── services/         # Business logic modules
│   │       ├── trendService.js
│   │       ├── scriptService.js
│   │       ├── videoService.js
│   │       ├── narrationService.js
│   │       └── publishService.js
│   ├── tests/        # Test files
│   └── package.json
├── frontend/         # React dashboard
│   ├── src/
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Coding Standards

### General Principles

- Write clean, modular, and maintainable code
- Follow existing patterns and conventions in the codebase
- Keep functions focused on a single responsibility
- Add comments only when necessary to explain complex logic
- Use meaningful variable and function names

### Backend (Node.js)

- Use ES modules (`import`/`export`) - the project uses `"type": "module"` in package.json
- Use `async`/`await` for asynchronous operations
- Handle errors properly with try-catch blocks
- Use Express middleware for cross-cutting concerns
- Keep route handlers thin - delegate to service modules
- Validate input data before processing
- Use environment variables for configuration (never hardcode secrets)

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Handle loading and error states in UI
- Ensure mobile-responsive design (dashboard works on phones)
- Use Vite for development and build processes

## Environment Variables

The backend requires these environment variables (see `backend/.env.example`):

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `PUBLISH_ASSETS_DIR` - Relative path from backend directory to frontend build (../frontend/dist)
- API keys for AI services (SORA_API_KEY, RUNWAY_API_KEY, NARRATOR_API_KEY)
- TikTok API credentials (TIKTOK_ACCESS_TOKEN, TIKTOK_CLIENT_KEY, etc.)
- Trends provider configuration

**Never commit `.env` files or hardcode API keys in the source code.**

## Build and Test

### Development

Backend:
```bash
cd backend
npm install
npm run dev  # Uses nodemon for auto-reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

### Testing

```bash
cd backend
npm test
```

### Production Build

```bash
# Build frontend
cd frontend
npm install
npm run build

# Start backend (serves frontend from dist/)
cd ../backend
npm install
npm run start
```

## Deployment

The project is designed for Railway/Render deployment:

1. The `railway.json` file configures the deployment with Nixpacks builder
2. Build phase: Railway automatically installs dependencies and builds the frontend
3. Start command (configured in railway.json): `cd backend && npm run start`
4. Set all required environment variables in the hosting platform
5. Backend serves the built frontend from `PUBLISH_ASSETS_DIR`

Note: The repository uses the `autopublish_cloud_project_railway` directory structure, which contains both backend and frontend subdirectories.

## Security Best Practices

- Always validate and sanitize user input
- Use environment variables for all sensitive data
- Never log sensitive information (API keys, tokens)
- Implement proper error handling without exposing system details
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Sanitize data before database operations

## Service Integration

When integrating external APIs (Sora, Runway, TikTok, etc.):

- Implement proper error handling and retries
- Use mock implementations during development/testing
- Follow the modular service pattern (see existing services)
- Document API requirements and response formats
- Handle API rate limits gracefully

## Code Review Guidelines

When reviewing or modifying code:

- Test changes locally before committing
- Ensure all existing tests pass
- Verify the dashboard works on both desktop and mobile
- Check that environment variables are properly used
- Confirm no secrets are committed
- Maintain backward compatibility when possible
- Update documentation if adding new features

## Language

- Code comments and documentation can be in English or Polish (project README is in Polish)
- Use clear, descriptive names regardless of language
- API responses should use consistent naming conventions
