# Payweave

**Payweave** is a production-ready payment orchestration backend designed for modern applications that require reliable payment flows, retries, and webhook-driven state management.

It abstracts payment providers behind a clean backend architecture while ensuring correctness, idempotency, and resilience.

---

## Why Payweave?

Direct frontend-to-payment-provider integrations often lead to:
- Inconsistent payment states
- Duplicate charges
- Complex retry logic
- Tight coupling to a single provider

Payweave solves this by acting as a **single source of truth** for orders and payments.

---

## Core Principles

- **Backend-controlled payment lifecycle**
- **Webhooks are the source of truth**
- **Idempotent operations**
- **Safe retries without duplicate charges**
- **Provider-agnostic design**

---

## Features

- Order lifecycle management
- Payment initiation & retries
- Webhook-driven state transitions
- Idempotency safeguards
- Poll-based order status tracking
- Provider abstraction layer (pluggable)
- Designed for Razorpay (extensible to Stripe, PayPal, etc.)

---

## Architecture Overview

### High-Level Flow
