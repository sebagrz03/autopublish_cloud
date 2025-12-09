# Copilot Instructions for autopublish_cloud

## Project Overview

This is an AI-powered TikTok autopublish system with a cloud-based architecture. The system automates the creation and publishing of TikTok videos using AI agents for:
- Trend research and discovery
- Script generation
- Video creation (with support for Sora/Runway AI video generators)
- AI narration/voice-over
- TikTok publishing

## Architecture

The project consists of two main components:

### Backend (`autopublish_cloud_project_railway/backend/`)
- **Framework**: Node.js with Express
- **Type**: ES modules (`"type": "module"` in package.json)
- **Port**: 3001 (development), configurable via `PORT` env var
- **Main Entry**: `src/server.js`

#### Key Services
- `trendService.js` - Fetches and analyzes trending topics
- `scriptService.js` - Generates video scripts based on trends
- `videoService.js` - Creates videos using AI providers (Sora/Runway/mock)
- `narrationService.js` - Adds AI voice-over to videos
- `publishService.js` - Publishes videos to TikTok

#### Database
- Simple JSON file-based storage (`src/db.js`)
- File: `data.json` (gitignored)

### Frontend (`autopublish_cloud_project_railway/frontend/`)
- **Framework**: React 18 with Vite
- **Port**: 5173 (development)
- **Entry**: `src/main.jsx`
- **Build Output**: `dist/` directory

## Development Workflow

### Setup
1. Backend setup:
   ```bash
   cd autopublish_cloud_project_railway/backend
   cp .env.example .env
   npm install
   npm run dev
   ```

2. Frontend setup:
   ```bash
   cd autopublish_cloud_project_railway/frontend
   npm install
   npm run dev
   ```

### Running Tests
```bash
cd autopublish_cloud_project_railway/backend
npm test
```

Note: The test suite is minimal and uses a custom test runner (`tests/run-tests.js`). Tests focus on basic service functionality validation.

### Building
```bash
# Frontend build (creates dist/ directory)
cd autopublish_cloud_project_railway/frontend
npm run build

# Production backend
cd autopublish_cloud_project_railway/backend
npm start
```

## Coding Standards

### General Guidelines
- Use ES modules (import/export) throughout the project
- Follow existing code structure and naming conventions
- Keep services modular and focused on single responsibilities
- Use async/await for asynchronous operations

### File Organization
- Services: `backend/src/services/` - Business logic and external integrations
- Routes: `backend/src/routes/` - Express route handlers
- Config: `backend/src/config.js` - Environment variable configuration
- Database: `backend/src/db.js` - Data persistence layer

### API Design
- RESTful endpoints in `src/routes/`
- Consistent error handling
- CORS enabled for cross-origin requests
- Morgan logging for request tracking

### Environment Variables
All sensitive configuration should be in `.env` files (never committed):
- API keys for video providers (SORA_API_KEY, RUNWAY_API_KEY)
- TikTok authentication (TIKTOK_ACCESS_TOKEN, etc.)
- External service URLs and keys
- See `backend/.env.example` for complete list

## Dependencies

### Backend
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **morgan**: HTTP request logger
- **node-fetch**: HTTP client for external APIs
- **uuid**: Unique identifier generation
- **nodemon**: Development auto-reload (dev dependency)

### Frontend
- **react**: UI library
- **react-dom**: React DOM rendering
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: Vite React plugin

## Deployment

### Railway (Recommended)
The project includes `railway.json` for Railway deployment:

1. Build command:
   ```bash
   npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
   ```

2. Start command:
   ```bash
   cd backend && npm run start
   ```

3. Environment variables to set in Railway dashboard (see `backend/.env.example`)

### Other Platforms (Render, Heroku, etc.)
- Deploy backend as a Node.js service
- Build frontend during deployment
- Ensure `PUBLISH_ASSETS_DIR=../frontend/dist` points to built frontend
- Set all required environment variables from `.env.example`

## Common Tasks

### Adding a New Service
1. Create new file in `backend/src/services/`
2. Export main functions using ES module syntax
3. Import and use in routes or other services
4. Add tests in `tests/run-tests.js` if applicable

### Adding a New Route
1. Create or modify file in `backend/src/routes/`
2. Import and mount in `src/server.js`
3. Follow RESTful conventions

### Modifying Frontend
1. React components in `frontend/src/`
2. Update `App.jsx` for routing/layout changes
3. Test with `npm run dev` before building

### Working with External APIs
1. Add API keys to `.env.example` (as placeholders)
2. Load keys in `src/config.js`
3. Implement provider logic in appropriate service
4. Use mock/fallback behavior when keys are not configured

## Important Notes

- The system is designed to be modular - services can be swapped or extended
- Video providers (Sora/Runway) are currently mocked - real API integration needed
- TikTok publishing requires proper OAuth setup and tokens
- Database is simple JSON file - consider upgrading for production
- Frontend proxy configuration in `vite.config.js` redirects API calls to backend

## When Making Changes

- **Always** preserve existing functionality unless fixing a bug
- **Test** changes with `npm test` in backend
- **Check** that both frontend and backend still run after changes
- **Update** this file if you change the project structure, add dependencies, or modify development workflow
- **Never** commit `.env` files or API keys
- **Maintain** the modular architecture - keep services independent
