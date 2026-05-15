# Shopping API

A backend REST API for a shopping application built with NestJS, TypeScript, and PostgreSQL. It supports product catalog management, cart operations, and order checkout.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Application framework |
| TypeScript | Language — strict mode throughout |
| PostgreSQL | Database |
| TypeORM | ORM — entity-based, no raw SQL |
| class-validator | Input validation via DTOs |
| Swagger | API documentation and testing |

---

## Project Setup

### Prerequisites

- Node.js v18+
- PostgreSQL running locally
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Fakihi-Yasin/shopping-api-assessment.git
cd shopping-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=shopping_db
PORT=3000
```

### 4. Create the database

```bash
psql -U postgres -c "CREATE DATABASE shopping_db;"
```

### 5. Run the application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

> Tables are created automatically via TypeORM `synchronize: true`. No migrations needed to run locally.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api
```

All endpoints, request bodies, and response schemas are documented there.

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products (filter by `?category=`) |
| GET | `/products/:id` | Get a single product with all variants |
| POST | `/products` | Create a product with variants |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| POST | `/cart` | Create a new cart |
| GET | `/cart/:cartId` | Get cart with items and total |
| POST | `/cart/:cartId/items` | Add an item to the cart |
| PATCH | `/cart/:cartId/items/:itemId` | Update item quantity |
| DELETE | `/cart/:cartId/items/:itemId` | Remove an item from the cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/checkout` | Checkout a cart and create an order |
| GET | `/orders/:id` | Get an order by ID |

---

## Design Decisions

### Module Structure

The project follows a **feature-based module structure**. Each feature (products, cart, orders) owns its entity, service, controller, DTOs, and module. Shared code lives in `common/`.

This was chosen over a flat structure because it scales cleanly — adding a new feature means adding a new folder without touching existing code.

### Database Schema

Six entities across three features:

```
product          ──OneToMany──►  product_variant
cart             ──OneToMany──►  cart_item  ──ManyToOne──►  product_variant
order            ──OneToMany──►  order_item  (no FK — snapshot)
```

Each parent-child pair uses `OneToMany` / `ManyToOne`. Cascade delete is applied so removing a product removes its variants, and removing a cart removes its items.

### TypeORM — Entities over Schemas

TypeORM with PostgreSQL uses **entities** (class + decorators) instead of schemas. `synchronize: true` is used in development to auto-create tables from entities. This would be replaced with migrations in production.

`decimal(10, 2)` is used for all price columns instead of `float` to avoid floating-point precision errors with currency values.

### Price Snapshot at Checkout

`OrderItem` stores `productName`, `variantType`, `variantValue`, and `priceAtPurchase` as plain columns — not as foreign keys to `ProductVariant`. This means order history is immutable. If the catalog is updated after checkout, existing orders are not affected.

This is a deliberate trade-off: we lose the ability to join orders back to live product data, but we gain correctness and auditability.

### Cart Total

The cart total is not stored in the database. It is computed on every read by summing `variant.price * quantity` across all items. This avoids stale totals and keeps the cart table simple. The trade-off is a slightly heavier read query, which is acceptable at this scale.

### Error Handling

A global `ExceptionFilter` catches all exceptions and returns a consistent response shape:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Product abc not found"
}
```

This ensures every error — validation failure, missing resource, or business rule violation — follows the same format regardless of which module throws it.

### Input Validation

All input is validated at the DTO level using `class-validator`. The global `ValidationPipe` is configured with `whitelist: true` (strips unknown fields) and `forbidNonWhitelisted: true` (rejects requests with unknown fields). No unvalidated data reaches the service layer.

### Swagger Response Schemas

Dedicated `*.response.ts` classes are used for `@ApiResponse` decorators instead of exposing entities directly. This separates the internal data model from the API contract and gives Swagger accurate, documented response shapes.

---

## What I Would Add With More Time

- **Authentication** — JWT-based auth with guards to associate carts and orders with users
- **Migrations** — replace `synchronize: true` with TypeORM migrations for production safety
- **Stock validation** — check and decrement variant stock at checkout
- **Pagination** — add limit/offset to `GET /products`
- **Unit tests** — service-level tests with mocked repositories

---


