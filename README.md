# RefundAPI

RefundAPI is a Node.js + TypeScript backend for managing refund requests. It supports user accounts, authentication, role-based access control, and receipt uploads. Built with Express, Prisma (SQLite), JWT, and Zod for validation.

[![Node.js](https://img.shields.io/badge/Node.js-v20-green?style=flat&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-red?style=flat&logo=express)](https://expressjs.com/)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Data Model](#architecture--data-model)
- [Authentication & Authorization](#authentication--authorization)
- [Refunds](#refunds)
- [Uploads](#uploads)
- [Database](#database)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run Locally](#run-locally)
  - [Database Migrations](#database-migrations)
- [Validation & Errors](#validation--errors)

---

## Features

- User registration with hashed passwords and role assignment (**employee** or **manager**)
- JWT-based authentication with protected routes
- Role-based access control:
  - Employees: create refunds and upload receipts
  - Managers: list refunds
  - Both can view refund details
- Refund management:
  - Create refunds with name, category, amount, and receipt filename
  - Paginated listing with optional search by user name
  - Refund detail retrieval (includes user data)
- Receipts/uploads:
  - Multipart file uploads with validation (MIME type and size)
  - Files stored on disk and served statically at `/uploads`
- Validation and errors:
  - Zod-based validation
  - Global error handling with custom errors
- Database:
  - Prisma + SQLite (`dev.db`)
  - User and Refund models with 1:N relationship
  - UUIDs and timestamps

---

## Tech Stack

- **Express**
- **TypeScript**
- **Prisma**
- **SQLite**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Zod**
- **Multer**
- **CORS**

---

## Architecture & Data Model

- **User 1:N Refunds**
- **User fields:** id (UUID), email, password (hashed), role (employee | manager)
- **Refund fields:** id (UUID), userId (foreign key to User), name, category (enum: food, others, services, transport, accommodation), amount, filename, createdAt, updatedAt
- Categories enforced via enum for data consistency

---

## Authentication & Authorization

- Login endpoint returns a JWT that embeds the user’s role
- Protected routes require:  
  `Authorization: Bearer <token>`
- Access control checks:
  - Employees can create refunds and upload receipts
  - Managers can list all refunds
  - Both roles can view refund details

---

## Refunds

- **Create Refund:** name, category, amount, uploaded filename (receipt)
- **List Refunds:** paginated (page, limit), optional search by user name
- **Refund Detail:** includes refund data + associated user info

---

## Uploads

- Uses **Multer** for handling multipart form data
- Validation:
  - Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`
  - Max size: **3 MB**
- Valid uploads are moved to the permanent uploads directory
- Accessible through:  
  `GET /uploads/<filename>`

---

## Database

- ORM: **Prisma**
- Database: **SQLite (`dev.db`)**
- Models: **User**, **Refund**
- Records include UUIDs and timestamps

---

## Getting Started

### Prerequisites

- Node.js 14+  
- npm or yarn  
- SQLite (included via Prisma)

### Installation

```bash
git clone https://github.com/yourusername/refundapi.git
cd refundapi
npm install
```

### Run Locally
Default server: http://localhost/3333
```bash
npm run dev
```

### Database Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Validation & Errors
ZOD handles request validation.
<br>
Returns consistent JSON error payloads:
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
