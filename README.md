# Budgetwise

Budgetwise is a full-stack personal finance application for tracking income and expenses, setting category budgets, viewing financial analytics, and splitting shared group expenses. It includes a Splitwise-style settlement workflow that calculates suggested payments without recording them until a member marks a payment as paid.

## Overview

The project is organized as two applications:

- `frontend/` is a React single-page application built with Vite.
- `backend/` is an Express API backed by MongoDB through Mongoose.

Users authenticate with username and password. The API issues access and refresh tokens, stores them in HTTP-only cookies, and protects account, finance, budget, group, and settlement endpoints. The frontend uses Axios with credentials enabled and TanStack Query for fetching, caching, and invalidating server data.

## Features

### Authentication

- Account registration with username and password validation.
- Username/password login and logout.
- Current-user lookup used to restore the authenticated session on application load.
- Access-token refresh endpoint and authenticated password-change endpoint.
- Protected client routes for finance and group pages.

### Dashboard

- Total income, total expense, and savings summary cards.
- Five most recent income and expense records combined into a recent-transactions view.
- Current-month category budget overview, including spent, remaining, over-budget state, and progress indicators.

### Expenses and Income

- Create, edit, delete, and list personal expenses and income records.
- Expenses use existing categories; expenses can be filtered by category/date, and both records support date/amount sorting and pagination.

### Budget management and analytics

- Save one or more category budgets in a single operation.
- Compare current-month category spending with configured budgets.
- View expense-by-category, expense-over-time, and monthly income-versus-expense charts.
- Categories are alphabetized with `Other` placed last.

### Shared Expenses

- Create groups, invite members with tokenized URLs, and join through an invite link.
- Add group expenses with equal, exact-amount, or percentage splits.
- View member balances, past group expenses, settlement suggestions, and settlement history.
- Record a real settlement only when a member clicks **Paid**.
- Group owners can refresh invite tokens and delete group expenses.

### Settings

- Toggle light and dark modes; the choice is stored in browser `localStorage`.
- Navigate to the dashboard and log out from the settings drawer.

## Major Feature Details

### Personal finance and budget flow

Expenses and income belong to the authenticated user. Both are ordered newest-first by transaction date, with creation time as a tie-breaker. The frontend filters, sorts, and paginates loaded records. Budgets are stored per user and category; the dashboard compares them with current-month expense totals and displays remaining budget and usage status.

### Shared-expense and settlement flow

Each group has an owner and a unique invite token. Group creation creates an owner membership, and invite joining creates a membership for the authenticated user. A compound `GroupMember` index on `{ group, user }` prevents duplicate memberships.

For a group expense, each non-payer participant is debited by their split while the payer is credited. Recorded settlements credit `paidBy` and debit `paidTo`, reducing later suggestions. The server uses a shared max-heap debt simplifier to repeatedly match the largest debtor to the largest creditor. Suggestions never write to the database; only the settlement-recording endpoint creates a `Settlement` document.

## Tech Stack

| Area | Technologies used |
| --- | --- |
| Frontend | React 19, Vite, React Router, TanStack Query, Axios |
| UI | Tailwind CSS, Framer Motion, Lucide React, React Hot Toast |
| Forms and charts | React Hook Form, Chart.js, react-chartjs-2 |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Authentication | JSON Web Tokens, bcrypt, cookie-parser |
| Tooling | npm, Nodemon, Oxlint |

## Architecture

```text
React pages/components
  └─ hooks + TanStack Query
      └─ Axios API modules (credentials enabled)
          └─ Express routes: /api/v1/*
              └─ JWT middleware → controllers → Mongoose models → MongoDB
```

The frontend stores the signed-in user in `AuthContext`, persists the selected theme locally, and invalidates relevant queries after mutations. The backend wraps controller handlers with `asyncHandler`, returns a common `ApiResponse` shape for successful responses, and uses error/not-found middleware for failures.

## Project Structure

```text
Budgetwise/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API business logic
│   │   ├── db/              # MongoDB connection
│   │   ├── middlewares/     # JWT, error, and not-found middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express endpoints
│   │   ├── utils/           # Response helpers and debt max-heap logic
│   │   ├── app.js           # Express app and route mounting
│   │   └── server.js        # Database connection and HTTP server startup
│   └── package.json
├── frontend/
│   ├── public/              # Static SVG assets
│   ├── src/
│   │   ├── api/             # Axios resource wrappers
│   │   ├── components/      # UI, layout, and feature components
│   │   ├── context/         # Authentication and theme state
│   │   ├── hooks/           # Queries, mutations, and filtering
│   │   ├── lib/             # Formatting, charts, dates, and group helpers
│   │   ├── pages/           # Route-level screens
│   │   └── routes/          # Client routes and protected route guard
│   └── package.json
└── README.md
```

## Database Models and Relationships

All models use Mongoose timestamps. Monetary fields are MongoDB `Decimal128` values.

| Model | Main fields | Relationships |
| --- | --- | --- |
| `User` | `username`, `password`, `refreshToken` | Owns expenses, incomes, budgets, and groups; may link to group memberships. |
| `Category` | `title` (unique) | Referenced by personal expenses and budgets; optional on group expenses. |
| `Expense` | `user`, `name`, `amount`, `date`, `category` | Belongs to a user and references a category. |
| `Income` | `user`, `name`, `amount`, `date` | Belongs to a user. |
| `Budget` | `user`, `category`, `amount` | Belongs to a user and references a category. |
| `Group` | `name`, `owner`, `inviteToken` | Owned by a user; has members and group expenses. |
| `GroupMember` | `group`, `user`, `name`, `email`, `joined` | Links a user to a group; `{ group, user }` is unique. |
| `GroupExpense` | `group`, `title`, `amount`, `paidBy`, `category`, `date` | Belongs to a group and references the payer. |
| `ExpenseSplit` | `expense`, `member`, `amount` | Links a group expense to participant splits. |
| `Settlement` | `group`, `paidBy`, `paidTo`, `amount`, `date` | Records an actual group payment. |

## API Documentation

All endpoints are mounted under `/api/v1`. Successful responses follow this shape:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "...",
  "success": true
}
```

`Auth` means an access token is required, supplied by the `accessToken` cookie or `Authorization: Bearer <token>`.

### Authentication — `/users`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| POST | `/users/register` | No | Create a user: `{ "username", "password" }`. Password requires 8+ characters with a letter, number, and special character. |
| POST | `/users/login` | No | Sign in with `{ "username", "password" }`; sets cookies and returns user/token data. |
| POST | `/users/logout` | Yes | Clears refresh token and authentication cookies. |
| POST | `/users/refresh-token` | No | Refresh tokens from the cookie or `{ "refreshToken" }` body. |
| POST | `/users/change-password` | Yes | Change password: `{ "oldPassword", "newPassword" }`. |
| GET | `/users/current-user` | Yes | Return the authenticated user. |

### Dashboard — `/dashboard`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/dashboard` | Yes | Returns totals, savings, up to five recent expenses/incomes, and categories. |
| GET | `/dashboard/charts` | Yes | Returns category, time-series, and monthly comparison chart data. |

### Expenses — `/expenses`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| GET | `/expenses` | Yes | List the user’s expenses. |
| POST | `/expenses` | Yes | Create: `{ "name", "amount", "category", "date" }`; category is a title. |
| PATCH | `/expenses/:id` | Yes | Update supplied `name`, `amount`, `category`, and/or `date`. |
| DELETE | `/expenses/:id` | Yes | Delete an expense owned by the user. |

### Income — `/incomes`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| GET | `/incomes` | Yes | List the user’s income records. |
| POST | `/incomes` | Yes | Create: `{ "name", "amount", "date" }`. |
| PATCH | `/incomes/:id` | Yes | Update supplied `name`, `amount`, and/or `date`. |
| DELETE | `/incomes/:id` | Yes | Delete an income record owned by the user. |

### Budgets and categories — `/budgets`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| GET | `/budgets` | Yes | List the user’s budgets with categories. |
| GET | `/budgets/categories` | Yes | List categories alphabetically, with `Other` last. |
| GET | `/budgets/current-month` | Yes | Return current-month expense totals by category. |
| PUT | `/budgets/multiple` | Yes | Bulk create/update: `{ "budgets": [{ "category", "amount" }] }`. |

### Groups — `/groups`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| GET | `/groups` | Yes | List joined groups with member count and the user’s balance. |
| POST | `/groups` | Yes | Create a group: `{ "name" }`; creator becomes owner and initial member. |
| GET | `/groups/:groupId` | Yes | Return members, balances, expenses/splits, suggestions, and settlements. |
| POST | `/groups/join/:token` | Yes | Join by invite token; an existing membership is returned instead of recreated. |
| POST | `/groups/:groupId/refresh-invite` | Yes | Generate a new invite token; owner only. |

### Group expenses — `/group-expenses`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| POST | `/group-expenses/:groupId` | Yes | Add a shared expense. Requires `title`, `amount`, `paidBy`, `date`, `splitType`, and `participants`; supports `equal`, `exact` (`splitAmounts`), and `percent` (`percentages`). |
| DELETE | `/group-expenses/:groupId/:expenseId` | Yes | Delete a group expense; owner only. |

### Settlements — `/settlements`

| Method | Endpoint | Auth | Purpose / request details |
| --- | --- | --- | --- |
| GET | `/settlements/:groupId/suggestions` | Yes | Read-only max-heap suggestions as `{ from, to, amount }` with member data. |
| GET | `/settlements/:groupId/history` | Yes | List recorded settlements, newest first. |
| POST | `/settlements/:groupId` | Yes | Record an actual payment: `{ "paidBy", "paidTo", "amount" }`; both members must be in the group and differ. |

## Authentication and Authorization

- Passwords are hashed with bcrypt before storage.
- JWT access and refresh tokens are generated on login and refresh.
- Cookies are HTTP-only; production uses `secure: true` and `sameSite: "None"`, while other environments use `sameSite: "Lax"`.
- JWT middleware accepts the access token from a cookie or Bearer header and attaches the user to the request.
- Personal expense, income, and budget queries are scoped to `req.user._id`.
- Group membership is checked where required. Invite refresh and group-expense deletion require ownership.

## Dashboard Functionality

The dashboard reads `/dashboard`, `/budgets`, `/budgets/current-month`, and `/dashboard/charts`. It displays total income, total expenses, savings, recent transactions, current-month budget progress, expense-category data, expenses over time, and monthly income/expense comparison.

## Shared Expenses Functionality

1. Create a group and copy its invite URL.
2. An authenticated recipient opens `/groups/join/:token`; the frontend deduplicates same-user/token in-flight joins, and the backend unique index provides a second safety layer.
3. Add a group expense, select payer/participants, and choose equal, exact, or percentage splitting.
4. Review balances and read-only settlement suggestions.
5. Click **Paid** only after payment; this creates a `Settlement` record and changes future suggestions.

## Installation and Setup

### Prerequisites

- Node.js and npm
- A MongoDB instance reachable from the backend

### Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configure environment files

Create `backend/.env` and `frontend/.env` using the variable names below. Do not commit either file.

### Run the applications

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

The backend uses `PORT` when set and otherwise listens on port `8000`. For a production frontend build, run `npm run build`, then `npm run preview`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `8000` in code. |
| `CORS_ORIGIN` | Allowed frontend origin for credentialed CORS. |
| `MONGO_URI` | MongoDB connection base URI; the app appends database name `budgetwise`. |
| `ACCESS_TOKEN_SECRET` | Secret for signing/verifying access tokens. |
| `ACCESS_TOKEN_EXPIRY` | Access-token lifetime accepted by `jsonwebtoken`. |
| `REFRESH_TOKEN_SECRET` | Secret for signing/verifying refresh tokens. |
| `REFRESH_TOKEN_EXPIRY` | Refresh-token lifetime accepted by `jsonwebtoken`. |
| `NODE_ENV` | Enables production cookie settings when `production`. |

### Frontend (`frontend/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Axios base URL. A typical local value for the current route mounts is `http://localhost:8000/api/v1`. |

Do not commit secrets. The root `.gitignore` excludes both environment files.

## Usage Guide

1. Register, then sign in.
2. Add personal expenses and income records.
3. Set category budgets from the dashboard and review current-month progress.
4. Use dashboard summaries, recent transactions, and charts to review finances.
5. Create a group, share its invite URL, and add shared expenses.
6. Use **Settle Up** to view suggestions; select **Paid** only for a real payment.
7. Open settings to switch theme or log out.

## Screenshots

Screenshots are not included in the repository.

| Screen | Placeholder |
| --- | --- |
| Dashboard | _Add dashboard screenshot here_ |
| Expenses | _Add expenses screenshot here_ |
| Groups and settlements | _Add group-details or settlement screenshot here_ |

## Security Practices Implemented

- bcrypt password hashing.
- JWT access and refresh tokens.
- HTTP-only cookies with environment-aware secure and SameSite settings.
- Credentialed CORS restricted to `CORS_ORIGIN`.
- JWT protection for authenticated routes.
- User ownership and group membership/ownership checks.
- Server validation of required fields and finite monetary values.
- Group-member unique index and duplicate-key handling for simultaneous invite joins.
- Centralized not-found and error responses.

## Future Improvements

The following are not implemented in the current codebase:

- Automated tests.
- Category creation/management screens and endpoints.
- A frontend password-change flow for the existing endpoint.
- API-level pagination/filtering for long transaction histories.
- Database transactions around creating a group expense and its split rows.
- Product screenshots and deployment documentation.

## License

This project uses the [ISC License](https://opensource.org/license/isc-license-txt/), as declared in `backend/package.json`.

## Author

Deepak (as declared in `backend/package.json`).
