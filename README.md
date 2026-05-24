# Laravel 12 React Starter Kit (ShadCN/UI)

A starter kit combining **Laravel 12**, **React 19**, **Inertia.js**, **Tailwind CSS 4**, and **ShadCN/UI** with authentication via **Laravel Fortify**.

## Stack

- **Backend:** Laravel 12, Fortify (auth)
- **Frontend:** React 19, Inertia.js 2, Vite 7
- **Styling:** Tailwind CSS 4, ShadCN/UI (slate theme, CSS variables)
- **Database:** SQLite by default (configurable in `.env`)

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- npm or pnpm

## Setup

1. **Install PHP dependencies**
   ```bash
   composer install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Configure `DB_*` in `.env` if not using SQLite.

3. **Database**
   ```bash
   php artisan migrate
   ```

4. **Frontend**
   ```bash
   npm install
   npm run build
   ```

5. **Run**
   ```bash
   php artisan serve
   ```
   Or use `composer run dev` to run the Laravel server, queue, logs, and Vite together.

Open [http://localhost:8000](http://localhost:8000).

## ShadCN/UI

Components live in `resources/js/components/ui/`. The **Button** component is included.

Add more components:

```bash
npx shadcn@latest add card
npx shadcn@latest add input
```

Use in pages:

```jsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
```

Configuration: `components.json`, `resources/js/lib/utils.js`, `resources/css/app.css` (theme variables).

## Project structure

- **Backend:** `app/`, `config/`, `routes/`, `database/`
- **Frontend:** `resources/js/`
  - `Pages/` – Inertia pages (Welcome, Dashboard, Auth/*, Profile/*)
  - `components/ui/` – ShadCN components
  - `lib/utils.js` – `cn()` helper
- **Views:** `resources/views/app.blade.php` – Inertia root template

## Auth

- **Fortify** handles login, register, password reset, 2FA, profile.
- Auth views are Inertia React pages under `resources/js/Pages/Auth/`.
- After login, users are redirected to `/dashboard`.

## License

MIT.
