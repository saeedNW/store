# 🏪 NestJS Store Backend – Architecture & Features

This document provides a detailed overview of the **NestJS Store Backend Application**, its architecture, modules, and feature set.
The project is structured as a **monorepo** and consists of multiple applications (APIs) serving different stakeholders: customers, sellers, and administrators.

---

## 📂 Applications (Monorepo Apps)

| App                     | Description                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **Store (Website API)** | Public-facing APIs where customers browse, purchase, and manage accounts                         |
| **Shop (Seller API)**   | Management system for shop owners and staff to manage products, inventory, orders, and finances. |
| **Panel (Panel API)**   | Administrative dashboard for managing the ecosystem (users, shops, roles, categories, audits).   |

---

## 🗄️ Databases

| Database          | Usage                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------- |
| **PostgreSQL**    | Main relational data store: users, shops, products, orders, payments, permissions, etc. |
| **MongoDB**       | Document storage: blogs, comments, file storage, notifications, audit logs.             |
| **Redis**         | In-memory cache: OTP, tokens, sessions, temporary data.                                 |
| **Elasticsearch** | Advanced search and filtering: products, blogs, shops.                                  |

---

## 🔑 Core Features (Cross-App)

1. **Authentication & Security**

   - OTP (send/verify)
   - Login / Logout
   - Password Reset
   - Refresh Token
   - Active Session Tracking
   - Token Revocation (single/all except current)

2. **Account Management**

   - Get Account Info
   - Update Phone / Password

3. **Profile Management**

   - Create / Update Profile
   - Manage Email & Picture
   - Panel vs. Store specific endpoints

4. **Address Book**

   - CRUD operations
   - Default Address Selection

5. **Communication Channels**

   - SMS (OTP, notifications)
   - Email (verification, notifications)

6. **System Utilities**

   - File Storage (Uploader, Gallery, File Manager)

---

## 📈 Monitoring & Observability

1. **Structured Logging**

   - Centralized logging for all apps (Store, Shop, Panel)
   - Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`
   - JSON formatting for easy ingestion into log aggregation tools

2. **Request & Response Logging**

   - Logs API requests, response status, duration, and user context
   - Supports tracing multi-step operations across services

3. **Error Logging & Alerts**

   - Captures stack traces for exceptions
   - Optional integration with alerting tools (e.g., Sentry, Rollbar)

---

## 👥 User & Access Control

1. **Permissions**

   - Panel: global system permissions
   - Shop: shop-specific permissions

2. **Roles**

   - Admin (Panel) – Full access
   - Vendor/Shop Roles – Managed per shop
   - Customer (Store) – Limited to front-facing APIs

3. **User Management (Panel)**

   - Create/Update/Delete users
   - Manage user roles
   - Assign shop staff

---

## 💰 Financial Features

1. **Wallet**

   - Panel: monitor balances, adjustments
   - Store: wallet balance, deposits, withdrawals

2. **Basket (Store only)**

   - Add/remove products
   - Update quantities
   - Sync with orders

3. **Orders**

   - Store: order placement & tracking
   - Shop: manage incoming orders
   - Panel: oversee all orders

4. **Discounts & Promotions**

   - Coupon/Promo code system
   - Shop-level discounts
   - Panel oversight

5. **Payments**

   - Multiple gateways
   - Panel: transaction logs
   - Shop: settlement reports

6. **Vendor Settlement & Payouts**

   - Commission calculation (percentage/fixed)
   - Settlement cycles (weekly/monthly/on-demand)
   - Vendor payout requests & approvals
   - Panel oversight & fraud checks

---

## 🛍️ Shop & Product Management

1. **Shops**

   - Panel: create, update, verify, change ownership, activate/deactivate
   - Shop: register, update details, logos, activity times

2. **Shop Staff**

   - Assign roles to staff
   - CRUD staff members
   - Manage permissions

3. **Products**

   - CRUD product catalog
   - Panel: global product management
   - Shop: seller-managed catalog
   - Store: product browsing & purchase

4. **Inventory & Stock Management**

   - Product stock tracking (available, reserved, sold)
   - Low-stock alerts

5. **Product Features & Attributes**

   - Variants (color, size, etc.)
   - Configurable per shop/product

6. **Product QA (Questions & Answers)**

   - Store: ask questions
   - Shop: answer questions
   - Panel: moderate

7. **Product Reviews & Ratings**

   - Store: add/edit reviews
   - Shop: respond to reviews
   - Panel: oversee moderation

---

## 🚚 Shipping & Delivery

1. Shipping provider integration
2. Shipping zones & rules (e.g., free shipping threshold)
3. Delivery tracking numbers & statuses

---

## 🛒 Customer Features

1. Wishlists / Favorites
2. Recently viewed products
3. Product comparison

---

## 📚 Content & Community Features

1. **Categories**

   - Hierarchical (unlimited nesting)
   - Shared across blogs and products

2. **Blogs & Articles**

   - Panel: create, manage, publish
   - Shop: optional shop-level blogs
   - Store: browsing and reading

3. **Blog Comments**

   - Store: comment on articles
   - Panel: moderation

4. **Authors**

   - Manage blog authors (panel-level)

---

## 📡 Notifications & Support

1. **Notifications**

   - Store/Shop/Panel scoped notifications
   - Realtime + stored (MongoDB)

2. **Support Tickets**

   - Store: user-submitted tickets
   - Shop: shop-level support
   - Panel: central management

---

## 📊 Analytics & Insights

1. **Store Analytics** → customer behavior, product views, best sellers
2. **Shop Analytics** → sales performance, revenue, refunds
3. **Panel Analytics** → platform KPIs (GMV, order volume, churn)
4. **Custom Dashboards** → filtered by date, shop, product

### Metabase Integration

1. **Reports via API** → Panel and Shop apps fetch analytics programmatically; no direct Metabase UI exposure.

2. **Supported Features**:

   - **Revenue & Sales Metrics** – daily, weekly, monthly reports; shop-specific and global aggregates
   - **Product Performance & Inventory Analytics** – top-selling products, low-stock alerts, stock tracking
   - **Vendor-specific Analytics** – sales, orders, and payout summaries per vendor/shop
   - **Custom Filters & Dashboards** – filter by date range, shop, product category; results returned as JSON or chart-ready data
   - **Exportable Reports** – CSV/Excel for transactions, orders, and user activity logs
   - **Caching & Performance Optimization** – optional caching via Redis for frequently requested queries

**Implementation Notes:**

- Metabase connects directly to **PostgreSQL** with read-only access.
- Panel/Shop APIs wrap Metabase queries to enforce **access control** and **branding**.
- Enables **scheduled or on-demand reports** without giving users access to the Metabase UI.

---

## 📝 Audit & Revision Tracking

1. **Audit Logs** (Panel & Shop)

   - Track system-wide activity
   - User actions (logins, updates, deletions)

2. **Revisions** (Panel & Shop)

   - Track data versioning for critical entities
   - Rollback & history tracking

---

## 🛡️ Fraud & Security

1. Suspicious login detection
2. Device & IP fingerprinting
3. Payment fraud monitoring
4. 2FA for admins and vendors
5. Blacklist / whitelist support

---

## 🔄 Versioned API

- APIs are versioned to ensure backward compatibility.
- Example:

  - `/api/v1/products` → legacy clients
  - `/api/v2/products` → new schema/features

- Benefits:

  - Smooth migrations
  - Safer experimentation
  - Long-term maintainability

---

## 📊 Features by Database

### PostgreSQL

- Users, Profiles, Addresses
- Roles & Permissions
- Shops & Staff
- Products, Features, Categories
- Basket, Orders, Discounts, Payments
- Wallet
- Tickets
- **Analytics & Insights (via Metabase)**

  - Revenue & sales metrics
  - Product performance & inventory analytics
  - Vendor/shop-specific analytics
  - Custom dashboards & filtered reports
  - Exportable CSV/Excel reports

### MongoDB

- File Manager & Storage
- Blogs & Comments
- Authors
- Notifications
- Activity logs

### Redis

- OTP & Session Tokens
- Access/Refresh Token storage
- Active sessions

### Elasticsearch

- Full-text search for products, blogs, shops
- Filtering, sorting, autocomplete

---

## 🔐 Security & Tokens

- **Access Token TTL:** 30 minutes - 1 hour

- **Refresh Token TTL:** 7–15 days

- **JWT Security Keys:**

  - Ed25519 private/public keys generated per app (`Store`, `Panel`, `Shop`)
  - Separate keys for access and refresh tokens

    ```shell
    mkdir -p keys/access
    mkdir -p keys/refresh

    openssl genpkey -algorithm ed25519 -out keys/access/ed25519_store_private.pem
    openssl genpkey -algorithm ed25519 -out keys/access/ed25519_panel_private.pem
    openssl genpkey -algorithm ed25519 -out keys/access/ed25519_shop_private.pem
    openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_store_private.pem
    openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_panel_private.pem
    openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_shop_private.pem

    openssl pkey -in keys/access/ed25519_store_private.pem -pubout -out keys/access/ed25519_store_public.pem
    openssl pkey -in keys/access/ed25519_panel_private.pem -pubout -out keys/access/ed25519_panel_public.pem
    openssl pkey -in keys/access/ed25519_shop_private.pem -pubout -out keys/access/ed25519_shop_public.pem
    openssl pkey -in keys/refresh/ed25519_store_private.pem -pubout -out keys/refresh/ed25519_store_public.pem
    openssl pkey -in keys/refresh/ed25519_panel_private.pem -pubout -out keys/refresh/ed25519_panel_public.pem
    openssl pkey -in keys/refresh/ed25519_shop_private.pem -pubout -out keys/refresh/ed25519_shop_public.pem
    ```

- **Encryption Keys:**

  - 32-byte base64 keys per app
  - Stored in `.env` files

    ```shell
    openssl rand -base64 32
    ```
