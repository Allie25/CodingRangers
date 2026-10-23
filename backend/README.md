# Coding Rangers API

Express, MongoDB and Nodemailer backend for course administration, learner bookings and email OTP authentication.

## Setup

1. Install Node.js and run MongoDB locally, or create a MongoDB Atlas database.
2. The local `backend/.env` is configured for MongoDB at `mongodb://127.0.0.1:27017/codingrangers`. If MongoDB is not installed or running, start the MongoDB service first. For Atlas, replace `MONGODB_URI` with your cluster connection string.
3. To configure another machine, copy `.env.example` to `.env`. Set a long random `JWT_SECRET`. To enable registration and login OTP emails, set `GMAIL_USER` and `GMAIL_APP_PASSWORD` to your Gmail address and Google App Password. You can optionally set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` to create an initial administrator.
4. Install dependencies with `npm install`, then start the API with `npm run dev` or `npm start`.

Do not commit `.env` or put its secrets in frontend code. Gmail SMTP requires 2-Step Verification and a Google App Password. The API uses port 3000 by default. Check `/api/health` for server status. Open Swagger UI at `http://localhost:3000/api-docs` to explore the API; the OpenAPI JSON is at `/api-docs.json`.

## Authentication

Learner signup uses `POST /api/auth/register` with `{ "name": "...", "email": "..." }`, then `POST /api/auth/verify-otp` with `{ "email": "...", "code": "123456", "purpose": "register" }`. Existing accounts request an OTP using `POST /api/auth/login` and verify with purpose `login`; admins verify with purpose `admin`. Verification returns a JWT and user profile. Send it as `Authorization: Bearer <token>` to protected routes. Codes expire after ten minutes and are stored hashed.

## Learner routes (JWT required)

- `GET /api/auth/me` — current profile
- `GET /api/courses` and `GET /api/courses/:id` — published courses
- `POST /api/bookings` with `{ "courseId": "..." }` — book; starts pending
- `GET /api/bookings/mine` — own booking statuses
- `DELETE /api/bookings/:id` — cancel a pending booking

## Admin routes (admin JWT required)

- `GET /api/admin/courses` — all courses
- `POST /api/admin/courses` — create a course (title and description required)
- `PATCH /api/admin/courses/:id` — update course fields
- `DELETE /api/admin/courses/:id` — delete course and its bookings
- `GET /api/admin/bookings` — list bookings
- `PATCH /api/admin/bookings/:id` with `{ "status": "approved" }` or `{ "status": "rejected", "note": "..." }` — review pending bookings

Course status is `published`, `draft` or `archived`; learners only see published courses. Approval enforces course capacity.
