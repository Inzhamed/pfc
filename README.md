# Rail View Guardian Frontend

This is the frontend for the Rail View Guardian dashboard, a web application for managing rail defect detection, reporting, and user administration.

## Features

- User authentication (JWT-based)
- Role-based access (admin, technician)
- Dashboard with defect statistics and interactive map
- Defect reporting and history
- Admin panel for user management (add/edit/delete users)
- User settings (email, password, notifications, language)
- Responsive design with dark mode

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- React Query
- Axios
- Lucide icons

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

```sh
npm install
# or
bun install
```

### Development

```sh
npm run dev
# or
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

```sh
npm run build
# or
bun run build
```

### Lint

```sh
npm run lint
```

### Project Structure

- `src/components/` – UI and feature components
- `src/pages/` – Route pages (Dashboard, Reports, History, Settings, AdminPanel)
- `src/api/` – API utilities
- `src/data/` – Static data and types
- `src/hooks/` – Custom React hooks
- `public/` – Static assets

### Customization

- To change the theme, edit `tailwind.config.ts`.

### Deployment

You can deploy the frontend to Vercel, Netlify, or GitHub Pages.  
For GitHub Pages, use:

```sh
npm run deploy
```
