# Chronus Dashboard

This Next.js 15 application provides a simple interface to manage tasks from the Chronus API.

## Getting Started

1. Copy `.env.example` to `.env.local` and adjust the API base URL if necessary.
2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

For a production build, run `npm run build` and then `npm start`.

The dashboard will be available at `http://localhost:3000`.

## Features

- List tasks from your Chronus API
- Create new tasks

Authentication is expected to be handled by the API; make sure your API is running and accessible.
