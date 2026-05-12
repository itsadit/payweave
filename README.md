# Payweave

> Backend-first payment orchestration with webhook-verified state transitions.

Payweave is a backend service that treats payment state as authoritative and relies on verified provider webhooks before finalizing success or failure.

## Why Payweave Exists

Most payment integrations fail in subtle but dangerous ways:

- Frontend marks payments as “successful” without provider confirmation
- Webhooks are treated as optional or unverified
- Retry logic creates duplicate charges or corrupted state
- Network failures leave payment state inconsistent
- Payment logic is scattered across routes and services

Payweave fixes this by enforcing strict backend ownership of payment state.

## Core Principles

Payweave is built around these invariants:

- Only verified webhooks can mark payments as successful or failed
- The frontend only signals intent; it never decides payment status
- Terminal states are immutable
- Retries are backend-controlled and audit-safe
- State transitions are explicitly guarded

## Architecture Overview

```text
Client (Frontend)
   |
   | 1. Create order (intent only)
   v
Backend (Payweave)
   |
   | 2. Create internal order (pending)
   | 3. Create provider order (Razorpay)
   v
Payment Provider
   |
   | 4. Payment attempt
   v
Webhook (Verified)
   |
   | 5. State transition (authoritative)
   v
Backend (Payweave)
```

The frontend never determines success. The webhook is the final authority.

## Payment State Machine

Payweave enforces a strict lifecycle:

- `pending`
- `payment_pending`
- `payment_success` OR `payment_failed`

Rules:

- `payment_success` and `payment_failed` are terminal
- No state can change after success
- Retry is allowed only from `payment_failed`

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Razorpay
- Zod for validation

## Installation

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Run production mode:

```bash
npm start
```

## Environment Variables

Create a `.env` file with:

```bash
PORT=
MONGODB_URI=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Keep secrets out of source control.

## API Endpoints

- `POST /api/orders`
  - Create a new internal order
  - Required body: `userId`, `amount`, `currency`, `idempotencyKey`, `paymentProvider`

- `GET /api/orders/:id`
  - Retrieve order status

- `POST /api/payments/:orderId/initiate`
  - Initiate provider payment creation for an existing order

- `POST /api/payments/:orderId/retry`
  - Retry a failed payment attempt

- `POST /api/webhooks/:provider`
  - Receive provider webhook events

## Supported Provider

- Razorpay: order creation and webhook verification are implemented.

## Key Features

- Webhook signature verification
- Idempotent webhook handling
- Safe retry mechanism
- Explicit state transition guards
- Input validation and defensive programming
- Structured error handling

## Security Guarantees

- No frontend-spoofed payment success
- No duplicate webhook processing
- No retries after success
- No accidental state corruption
- No secrets leaked in logs

## Status

- Order lifecycle implemented
- Razorpay order creation implemented
- Webhook verification implemented
- Retry logic implemented
- Intentional backend-first payment orchestration

## License

MIT License

## Who This Is For

- Backend engineers integrating payments
- Teams building production-grade payment systems
- Engineers preparing for backend / system design interviews

## Final Note

Payweave is intentionally opinionated.

If you want frontend-marked payment success, loosely verified webhooks, or unsafe retries, this project is not for you.

If you want correctness over convenience, welcome.
