# NGO Finance Management System — Backend (Node.js + Express + MongoDB)

Om Satsang Parivar

## What's included in this milestone

- JWT auth (access + refresh tokens), bcrypt password hashing
- Role-based authorization (`super_admin` / `admin` / `accountant` / `staff`) via `authorize()` middleware
- MVC + Repository + Service layer architecture
- Full CRUD REST API: **Donors, Donations, Income, Expenses**
- Dashboard summary + charts endpoints
- express-validator request validation, centralized error handler
- Multer local file upload for expense receipts (swap to Cloudinary by setting `STORAGE_DRIVER=cloudinary` and wiring `services/expenseService.js`)
- Activity log middleware (audit trail) on every write route
- Helmet, CORS, rate limiting, compression, Morgan logging
- Swagger UI scaffold at `/api-docs`

## Setup

```bash
cd backend
cp .env.example .env
npm install

# Update .env: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
# Generate strong secrets with: openssl rand -base64 32

npm run seed   # creates ONLY the two login accounts below — no sample donors/donations/data
npm run dev    # nodemon, http://localhost:5000
```

### Default seeded login
```
Super Admin: admin@satsangparivar.org / Password@123
Accountant:  accountant@satsangparivar.org / Password@123
```

Everything else — donors, donations, income, expenses — is empty until you create it through the
app. There is no mock or hardcoded data anywhere in the frontend; every list, table, and dashboard
number is read live from MongoDB through the API.

## Key endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login, returns access + refresh tokens |
| POST | /api/auth/refresh | Exchange refresh token for new access token |
| GET | /api/auth/me | Current user |
| GET | /api/dashboard/summary | Dashboard totals |
| GET | /api/dashboard/charts | Chart data |
| GET/POST | /api/donors | List / create donors |
| GET/PUT/DELETE | /api/donors/:id | Read / update / delete donor |
| GET | /api/donors/:id/donations | Donor donation history |
| GET/POST | /api/donations | List / create donations |
| GET/POST | /api/income | List / create income |
| GET/POST | /api/expenses | List / create expenses (multipart, field name `receipt`) |
| GET | /api/expenses/:id/receipt | Download receipt |
| PATCH | /api/expenses/:id/approve | Approve expense (accountant+) |

All authenticated requests need `Authorization: Bearer <accessToken>`.

## Architecture pattern for new modules

`routes/*.js` → `controllers/*.js` (thin, HTTP-only) → `services/*.js` (business logic) →
`repositories/*.js` (Mongoose queries) → `models/*.js`. Validation lives in `validators/*.js`
using express-validator chains, applied via the shared `validate` middleware. Copy this pattern
for the remaining spec modules (Projects, Funds, Bank Accounts, Assets, Liabilities, Reports,
PDF/Excel export, email notifications, Settings, Notifications).
