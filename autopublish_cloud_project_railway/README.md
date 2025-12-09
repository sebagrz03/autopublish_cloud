# AI TikTok Autopublish – Cloud + Dashboard (Base Stack)

Ten projekt to gotowy szkielet pod profesjonalny system:
- backend w chmurze (Node.js + Express),
- frontend (React + Vite) z dashboardem,
- moduły: trendy → scenariusz → video (Sora/Runway/mode mock) → narracja → publikacja TikTok.

## Struktura

- `backend/` – API, logika agentów, prosty JSON "database".
- `frontend/` – panel www (działa również z telefonu).
- `backend/.env.example` – wszystkie potrzebne klucze i ścieżki (skopiuj do `.env`).

## Szybki start (lokalnie)

1. Zainstaluj Node.js (18+).
2. Backend:
   ```bash
   cd backend
   cp .env.example .env   # uzupełnij klucze kiedy będziesz je mieć
   npm install
   npm run dev
   ```
   API będzie na `http://localhost:3001`.

3. Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Dashboard będzie na `http://localhost:5173` (proxy do backendu na porcie 3001).

## Testy

```bash
cd backend
npm test
```

## Deployment (Render / Railway / inne)

- utwórz serwis Node.js z folderu `backend`,
- ustaw zmienne środowiskowe zgodnie z `.env.example`,
- zbuduj frontend (np. w CI: `cd frontend && npm install && npm run build`),
- upewnij się, że `PUBLISH_ASSETS_DIR=../frontend/dist` wskazuje na zbudowany dashboard.

Następnie możesz wchodzić na adres z telefonu i sterować całą fabryką filmów.

Projekt jest świadomie modularny – możesz:
- dodać prawdziwe wywołania API do Sora / Runway w `videoService`,
- podpiąć prawdziwy TTS w `narrationService`,
- zaimplementować oficjalny TikTok Content/Marketing API w `publishService`,
- rozdzielić agentów (trend / script / voice / publish) na osobne mikroserwisy.


## Railway (hosting 24/7)

Minimalny wariant: **jeden serwis na Railway**, który:
- w fazie build buduje frontend (`frontend`),
- w runtime uruchamia backend (`backend`), który serwuje zbudowany dashboard.

1. Zrób nowy projekt na https://railway.app
2. Podepnij repozytorium z tym projektem (GitHub).
3. Railway wykryje `railway.json` i:
   - w build użyje Nixpacks,
   - uruchomi `cd backend && npm run start`.

4. W Railway w zakładce **Variables** dodaj zmienne środowiskowe (takie same jak w `backend/.env.example`):
   - `PORT` – domyślnie 3001 (Railway i tak nadpisze własną),
   - `NODE_ENV=production`,
   - `PUBLISH_ASSETS_DIR=../frontend/dist`,
   - klucze: `SORA_API_KEY`, `RUNWAY_API_KEY`, `NARRATOR_API_KEY`,
   - `TIKTOK_ACCESS_TOKEN`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REDIRECT_URI`,
   - `TRENDS_PROVIDER_URL`, `TRENDS_PROVIDER_API_KEY`.

5. W Railway ustaw:
   - **Build Command** (w zakładce Settings serwisu):
     ```bash
     npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
     ```
   - **Start Command**:
     ```bash
     cd backend && npm run start
     ```

Po deployu:
- Railway da Ci **publiczny URL backendu + dashboardu** (np. `https://twoj-projekt.up.railway.app`),
- wpisujesz ten adres w telefonie i dashboard działa, nawet gdy komputer jest wyłączony.
