# NairaFlow

NairaFlow is a digital wallet application being developed as a group software-development project. This repository contains separate frontend and backend applications so the user interface and server can evolve independently.

## Project structure

- `frontend/` — React, TypeScript, and Vite application
- `backend/` — Node.js, Express, and TypeScript application

## Prerequisites

Install a current Node.js LTS release (Node.js 20.19+ or 22.12+ is recommended for Vite).

## Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

## Backend

Install dependencies:

```bash
cd backend
npm install
```

Run the development server:

```bash
npm run dev
```

The backend reads an optional `PORT` environment variable and otherwise listens on port `5000`.
