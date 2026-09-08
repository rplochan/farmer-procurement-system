# Farmer Procurement & Slot Management Backend

Node.js + Express + PostgreSQL backend for the SIH 2026 Farmer Procurement & Slot Management System.

## 1. Install

```bash
npm install
```

## 2. Configure PostgreSQL

Create a database, for example:

```bash
createdb farmer_procurement
```

Copy `.env.example` to `.env` and update the PostgreSQL credentials.

## 3. Create tables

Run:

```bash
psql -d farmer_procurement -f database/schema.sql
```

## 4. Start server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

## Main APIs

### Farmers

```text
POST /api/farmers
GET  /api/farmers/:id
```

### Crops

```text
GET /api/crops
```

### Centres

```text
GET /api/centres
```

### Slots

```text
GET /api/slots?centreId=1&cropId=1&date=2026-09-10
```

### Bookings

```text
POST   /api/bookings
GET    /api/bookings/:id
DELETE /api/bookings/:id
```

### Procurement status

```text
GET   /api/procurement/:bookingId
PATCH /api/procurement/:bookingId/status
```

## Booking concurrency

The booking service uses a PostgreSQL transaction and `SELECT ... FOR UPDATE` to lock the slot row during booking. This prevents two concurrent requests from consuming the same final available slot.

Redis/BullMQ is intentionally not included yet. It can be added later for notification/background jobs.
