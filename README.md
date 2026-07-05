# NGO Finance Management System
### ॐ सत्सङ्ग परिवार (Om Satsang Parivar)

Full-stack finance management system built on the **MERN stack**: Node.js + Express + MongoDB
(Mongoose, JWT auth, MVC + Repository + Service layers) for the backend, and **React + Vite +
Tailwind CSS** (TanStack Query, React Hook Form, i18next, Framer Motion, Recharts) for the
frontend — two separate codebases talking over a REST API.

> This replaces the earlier Next.js version with a classic separated MERN architecture.

## What's built in this milestone

✅ **Auth** — JWT access + refresh tokens, bcrypt hashing, login/logout/profile/change-password, role field (`super_admin` / `admin` / `accountant` / `staff`), automatic token refresh on the frontend (axios interceptor)
✅ **Dashboard** — income/expense/net balance/fund totals, today's & monthly figures, 6-month trend chart, expense-by-category pie chart, recent donations & expenses
✅ **Donors** — full CRUD, search, lifetime donation auto-tracking
✅ **Donations** — full CRUD, auto-updates donor lifetime total, restricted/unrestricted fund tracking
✅ **Income** — full CRUD by source/category
✅ **Expenses** — full CRUD, Multer receipt upload (local disk) + download, approve endpoint (role-gated)
✅ **Financial Statement** — income, expenses, and per-donor donation totals ("who gave how much") with quick date-range filters (1 day / 1 week / 1 month / 3 months / 6 months / 1 year / all time / custom range), CSV export, print
✅ MVC + Repository + Service layer architecture, express-validator, centralized error handler
✅ Helmet, CORS, rate limiting, compression, Morgan, Swagger UI at `/api-docs`
✅ Bilingual UI (English/Nepali via i18next), dark/light mode, responsive layout, TanStack Query data fetching

## Quick start

Requirements: **Node 18+**, a MongoDB instance (local or Atlas).

### Backend
```bash
cd backend
cp .env.example .env
# set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET (openssl rand -base64 32)
npm install
npm run seed      # creates default users + sample data
npm run dev       # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # http://localhost:5173
```

Log in with:
```
admin@satsangparivar.org / Password@123
```

## Folder structure

```
backend/
 ├── models/          Mongoose schemas
 ├── repositories/     data-access layer (Mongoose queries)
 ├── services/         business logic layer
 ├── controllers/      thin HTTP handlers
 ├── routes/            Express routers
 ├── middlewares/      auth, error handler, upload, activity logger, validation
 ├── validators/        express-validator chains
 ├── utils/              asyncHandler, ApiError, JWT helpers
 └── app.js / server.js

frontend/
 ├── src/api/axios.js               axios instance + refresh-token interceptor
 ├── src/context/                    AuthContext, ThemeContext
 ├── src/components/layout/          Sidebar, Navbar, DashboardLayout
 ├── src/components/ui/              DataTable, Modal, Badge, StatCard
 ├── src/pages/                      Login, Dashboard, donors/ donations/ income/ expenses/
 ├── src/services/                   one file per API resource
 └── src/locales/                    en.json, ne.json
```

## Adding a new module (e.g. Projects)

Backend: `models/Project.js` → `repositories/projectRepository.js` → `services/projectService.js`
→ `validators/projectValidator.js` → `controllers/projectController.js` → `routes/projectRoutes.js`
(mount in `routes/index.js`).

Frontend: `services/projectService.js` → `pages/projects/ProjectList.jsx` + `ProjectForm.jsx`
(copy the Donor equivalents) → add route in `App.jsx` and nav item in `Sidebar.jsx`.

## What's not built yet (roadmap)

Projects, Funds, Bank Accounts, Assets, Liabilities, deeper Financial Reports (Statement of
Financial Position / Activities / Project / Cash Flow / Audit reports beyond the new Statement
page), PDF export (PDFKit), Excel export & data import, email notifications (Nodemailer —
thank-you emails, donation receipts, monthly summaries), Organization Settings page, in-app +
browser Notification Center, Activity Log UI (logging already happens server-side), Swagger
route annotations, bulk delete/update, backup & restore. The architecture above supports adding
all of these the same way.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Recharts, Framer Motion, react-icons, react-toastify, i18next |
| Backend | Node.js, Express, MVC + Repository + Service pattern, express-validator, Multer, Helmet, CORS, express-rate-limit, Morgan, Swagger |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt, RBAC middleware |
| File storage | Local disk by default (Multer) — swap to Cloudinary via `STORAGE_DRIVER` |
