# QuickBasket — Backend Development Plan

This document defines **what to implement** in the QuickBasket backend, module by module. It is derived from the existing React client (`client/`) and describes functional scope, data, business rules, and dependencies — **not** API contracts or code.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Roles & Access Model](#2-roles--access-model)
3. [Recommended Build Order](#3-recommended-build-order)
4. [Module 1 — Foundation & Shared Services](#module-1--foundation--shared-services)
5. [Module 2 — Authentication & User Management](#module-2--authentication--user-management)
6. [Module 3 — Catalog & Public Storefront](#module-3--catalog--public-storefront)
7. [Module 4 — Shopping Cart & Checkout](#module-4--shopping-cart--checkout)
8. [Module 5 — Orders & Fulfillment](#module-5--orders--fulfillment)
9. [Module 6 — Customer Experience](#module-6--customer-experience)
10. [Module 7 — Shop Owner (Vendor) Operations](#module-7--shop-owner-vendor-operations)
11. [Module 8 — Admin & Platform Management](#module-8--admin--platform-management)
12. [Module 9 — Cross-Cutting & Future Features](#module-9--cross-cutting--future-features)
13. [Frontend Gaps to Account For](#13-frontend-gaps-to-account-for)
14. [Module Dependency Map](#14-module-dependency-map)

---

## 1. Overview

### What the client is today

- React 19 + Vite frontend with **three roles**: Customer, Shop Owner, Admin
- All data is **mock/static** or stored in **localStorage**
- No network layer, no real cart persistence, no payment flow, no file uploads

### What the backend must become

A multi-tenant grocery marketplace backend that:

- Authenticates users and enforces role-based access
- Powers the public storefront (browse, search, product detail)
- Manages per-customer cart, wishlist, checkout, and orders
- Lets shop owners manage inventory and fulfill orders for their shop
- Lets admins oversee vendors, customers, and platform health

### Core entities (conceptual)

| Entity | Description |
|--------|-------------|
| **User** | Account with role: customer, shop_owner, or admin |
| **Shop / Vendor** | A merchant store linked to a shop_owner user |
| **Product** | Item sold by a shop; appears in storefront and shop inventory |
| **Category** | Product grouping for browse and filters |
| **Cart** | Customer’s active basket (line items, quantities, saved-for-later) |
| **Order** | Placed purchase with items, address, fees, status, and tracking |
| **Review** | Customer rating/comment on a product |
| **Promotion** | Banners, discounts, promo codes |
| **Reward** | Loyalty points and tier for customers |
| **System Event** | Audit/platform activity log for admin |

---

## 2. Roles & Access Model

| Role | Who they are | What they can access |
|------|--------------|----------------------|
| **Customer** | End shopper | Storefront, own cart, wishlist, orders, rewards, profile |
| **Shop Owner** | Vendor / merchant | Own shop’s products, orders, dashboard stats, settings |
| **Admin** | Platform operator | All vendors, all customers, analytics, platform settings |

### Access rules to enforce

- Customers must only see and modify **their own** cart, wishlist, orders, and profile
- Shop owners must only see and modify **their own shop’s** products and orders
- Admins have platform-wide read/write where the UI allows (vendors, users, settings)
- Login must validate that the selected role matches the account’s actual role (as the UI does today)
- Shop owner accounts should be tied to a **shop record**; new shop_owner signups may start as **pending** until admin approval (aligns with admin Vendors “Pending” state)

---

## 3. Recommended Build Order

Build in this sequence so each module can be tested against the client as you go:

| Phase | Module | Why first |
|-------|--------|-----------|
| 1 | Foundation & Shared Services | Database, config, errors, logging, file storage baseline |
| 2 | Authentication & User Management | Every dashboard route is protected |
| 3 | Catalog & Public Storefront | Home, product detail, and inventory need a single product source |
| 4 | Shopping Cart & Checkout | Cart and checkout pages need real persistence before orders |
| 5 | Orders & Fulfillment | Shared order lifecycle for customer, shop owner, and tracking |
| 6 | Customer Experience | Dashboard, wishlist, rewards, reorder, order history filters |
| 7 | Shop Owner Operations | Inventory CRUD, order workflow, alerts, export |
| 8 | Admin & Platform Management | Vendor approval, user moderation, analytics |
| 9 | Cross-Cutting & Future | Payments, notifications, OAuth, real-time tracking |

---

## Module 1 — Foundation & Shared Services

**Purpose:** Shared infrastructure every other module depends on.

### What to implement

- **Project structure** — Separate backend app (e.g. `server/` or `api/`) with environment-based configuration
- **Database** — Persistent storage for users, shops, products, orders, etc.
- **Migrations / schema versioning** — Repeatable way to evolve the data model
- **Centralized error handling** — Consistent error shapes for the client
- **Request validation** — Validate incoming payloads before business logic
- **Logging & audit hooks** — Foundation for admin system events
- **File / media storage** — Product images (UI accepts SVG, PNG, JPG, WEBP; max ~5MB)
- **Pagination, sorting, filtering utilities** — Order history, vendor list, user list, and product lists all need these
- **Fee & pricing helpers** — Subtotal, delivery fee, service fee, tax, discounts, order totals (used in cart, checkout, order detail, tracking)
- **Stock status derivation** — Map stock quantity to In Stock / Low Stock / Out of Stock (shop owner inventory UI derives this today)
- **Seed / bootstrap data** — Demo users matching the client (`customer@`, `owner@`, `admin@`) for development

### Supports in UI

- All modules

### Dependencies

- None (first module)

---

## Module 2 — Authentication & User Management

**Purpose:** Secure sign-up, login, session management, and user profiles.

**Frontend reference:** `Auth.jsx`, `LoginForm`, `SignUpForm`, `AuthContext`, `dummyUsers.js`, `ProtectedRoute`

### What to implement

#### Registration

- Accept: first name, last name, email, password, role (customer | shop_owner | admin)
- Enforce unique email
- Hash passwords (never store plain text — client demo stores plaintext in localStorage)
- Record `createdAt`
- For **shop_owner**: create or link a **shop** in **pending** state until admin approves (optional but matches admin Vendors workflow)

#### Login

- Validate email + password
- Validate that requested **role matches** account role (client enforces this at login)
- Issue session token or secure cookie
- Return safe user profile (no password)

#### Session & logout

- Validate session on protected requests
- Invalidate session on logout
- Support “remember me” if desired later

#### Password recovery

- Forgot-password flow (UI has link but it is not wired)
- Secure reset token with expiry

#### Social login (future-ready)

- UI shows Google and Apple buttons — no logic today
- Plan OAuth provider integration as a later phase; structure user model to allow linked providers

#### User profile (base)

- Fields used across UI: `id`, `firstName`, `lastName`, `email`, `role`, `avatar` (optional)
- Profile update capability for settings pages (customer and shop owner settings are placeholders today)

### Business rules

- Admin self-registration may need restriction in production (only seed or invite)
- Banned users cannot log in (admin Users page has Banned status)
- Email format and password strength validation

### Supports in UI

- `/auth` (login, signup, demo accounts)
- Role-based redirects to `/dashboard/customer`, `/dashboard/shop-owner`, `/dashboard/admin`
- Route guards on all dashboard pages

### Dependencies

- Module 1 (Foundation)

---

## Module 3 — Catalog & Public Storefront

**Purpose:** Single source of truth for products shown on the home page, product cards, and product detail — and eventually synced with shop owner inventory.

**Frontend reference:** `Home.jsx`, `ProductDetail.jsx`, `mockData.js`, `productDetailData.js`, `ProductCard`, home sections (Featured, Trending, Best Sellers, Categories, Top Sellers, Promo Banners)

### What to implement

#### Categories

- List categories for home row and product filtering
- Fields: name, slug/id, display order, optional icon/image

#### Products (storefront view)

- **List product** shape for cards: name, category, price, optional price range, rating, image, optional original price, discount badge, optional countdown/deal
- **Detail product** shape: short name, long description, images gallery, weights/variants, default weight, stock left, stock percent, brand, SKU, dimensions, dispatch/returns notes
- Link each product to a **shop/vendor**
- Support multiple images per product
- Support weight/variant options with price adjustments if applicable

#### Product discovery sections

- **Featured products** — Curated or rule-based list for homepage
- **Trending products** — Based on views, sales, or manual flag
- **Best sellers** — Based on order volume or manual flag
- **Top vendors / top sellers** — Shops ranked for homepage section

#### Product reviews

- Per-product reviews: author, rating, date, text
- Aggregate `rating` and `reviewCount` on product

#### Search

- Header search bar exists but has no logic — implement product search by name, category, brand, SKU

#### Promotions & banners

- Homepage promo banners: title, subtitle, CTA, image, link target
- Product-level discounts (original price vs sale price)

#### Stock visibility (public)

- Show stock left / stock percent on product detail
- Hide or mark unavailable when out of stock
- Prevent add-to-cart when out of stock (once cart module exists)

### Business rules

- Only **approved/active** shops’ products appear on public storefront
- Product visibility may depend on shop status (suspended shop → products hidden)
- Unify the two product models in the client today: public catalog mock vs shop owner inventory — backend should use **one product record** with different views per role

### Supports in UI

- `/` — Home
- `/product/:productId` — Product detail
- `/about` — No backend needed
- Add to cart button (badge only until Module 4)
- Wishlist heart (Module 6)

### Dependencies

- Module 1 (Foundation)
- Module 2 (Auth) — optional for public browse; required for wishlist/cart later
- Module 7 (Shop Owner) — products created by shop owners feed this catalog

---

## Module 4 — Shopping Cart & Checkout

**Purpose:** Real cart persistence, promo codes, and checkout data capture before order placement.

**Frontend reference:** `Cart.jsx`, `Checkout.jsx`, `CartContext`, `customerShopData.js`

### What to implement

#### Cart

- Per-customer cart (authenticated) — guest cart is optional
- **Line items:** product reference, name, description, category, unit price, quantity, image snapshot
- Operations: add item, update quantity, remove item, clear cart
- **Saved for later** — Separate list from active cart (UI has both sections)
- Persist cart across sessions (client only stores a **count** in localStorage today)

#### Cart summary

- Subtotal
- Delivery fee
- Service fee
- Promo discount
- Grand total
- Recalculate on every cart change

#### Promo codes

- Promo code field with Apply action (UI button exists, no logic)
- Validate code: active, not expired, usage limits, minimum order
- Apply discount to summary

#### Checkout — delivery & contact

- **Delivery address:** street, city, postal code
- Optional: address book / saved addresses for repeat customers
- **Contact phone** (UI uses +1 prefix)
- **Delivery instructions** (free text)
- **Detect location** button on UI — geolocation or address lookup integration (future or phase 2)

#### Checkout — order review

- List items with quantities and prices
- Show same fee breakdown as cart summary

#### Payment (placeholder)

- UI shows “Coming Soon” for payment method
- Backend should reserve: payment status on order (`pending`, `paid`, `failed`), payment method field, integration point for Stripe/Razorpay/etc. in Module 9

#### Place order handoff

- Validate cart not empty, address complete, phone present, products still in stock
- Create order (Module 5) and clear or reduce cart
- Return order id for confirmation / tracking redirect

### Business rules

- Prices at add-to-cart time vs at checkout — define policy (typically re-validate at checkout)
- Stock reservation or final stock check at place order
- One active cart per customer

### Supports in UI

- `/dashboard/customer/cart`
- `/dashboard/customer/checkout`
- Cart badge in header (`CartTarget`, `AddToCartButton`)
- Proceed to Checkout flow

### Dependencies

- Module 2 (Auth) — customer must be logged in for dashboard cart
- Module 3 (Catalog) — product references and pricing
- Module 5 (Orders) — place order creates order record

---

## Module 5 — Orders & Fulfillment

**Purpose:** End-to-end order lifecycle shared by customer history, shop owner fulfillment, and live tracking.

**Frontend reference:** `OrderHistory.jsx`, `OrderTracking.jsx`, `Orders.jsx`, `OrderDetails.jsx`, `customerOrders.js`, `shopOwnerOrders.js`

### What to implement

#### Order creation

- Generate human-readable ids (e.g. `ORD-7742`, display id `FR-77420` as in mocks)
- Snapshot: items, prices, customer, delivery address, phone, instructions, fees, promo
- Link order to **shop(s)** — single-shop vs multi-vendor cart policy must be decided (client assumes one basket; clarify if multi-shop split is needed)
- Initial status: e.g. `Placed` or `Processing`

#### Order statuses (customer-facing)

Align with customer order history and tracking timeline:

| Status | Meaning |
|--------|---------|
| Processing | Order received |
| Shipped | Out for delivery |
| Delivered | Completed |
| Cancelled | Cancelled |

#### Order statuses (shop owner-facing)

Align with shop owner tabs and workflow buttons:

| Status / Tab | Meaning |
|--------------|---------|
| New | Awaiting shop acceptance |
| Preparing | Being prepared |
| Ready | Ready for pickup/dispatch |
| Shipping | Out for delivery |
| Delivered | Completed |

Map shop owner actions to status transitions: **Accept**, **Preparing**, **Out for Delivery**, **Delivered**, **Reject**

#### Order detail (both sides)

- Customer info: name, email, phone, avatar/initials
- Delivery address and customer note
- Line items: name, category, quantity, unit price, line total, image
- Financial breakdown: subtotal, delivery fee, tax, total

#### Order tracking

- Timeline steps: Placed → Accepted → Preparing → Out for Delivery → Delivered
- ETA and expected delivery window
- **Courier assignment:** name, rating, delivery count, phone, avatar
- Map / live location — placeholder in UI; backend should support status updates and optional courier location later

#### Order listing

- Customer: paginated history with filters (All, Last 3 Months, by year — UI filters are cosmetic today; implement real filtering)
- Shop owner: tabs New / Active / Completed, search, stats counts (New Orders, In Delivery, Completed, Returns)

#### Reorder

- “Reorder” on customer dashboard and order history — copy previous order items into cart (check stock and current prices)

#### Export

- Shop owner “Export CSV” on orders — generate downloadable order report

#### Returns

- Shop owner stats mention “Returns” — define return request status and workflow (can be phase 2)

### Business rules

- Only the owning shop can update fulfillment status for its orders
- Customer can only view own orders
- Rejected orders → cancelled with reason
- Status transitions must be valid (no skip unless business allows)
- `trackable` flag on customer orders — only in-progress shipments show track CTA

### Supports in UI

- `/dashboard/customer/orders`
- `/dashboard/customer/orders/:orderId/track`
- `/dashboard/customer/orders/:orderId` — **linked in UI but page missing**; backend should still support order detail
- `/dashboard/shop-owner/orders`
- `/dashboard/shop-owner/orders/:orderId`
- Customer dashboard “next delivery” and track CTAs

### Dependencies

- Module 2 (Auth)
- Module 3 (Catalog)
- Module 4 (Checkout) — order created from checkout
- Module 7 (Shop Owner) — fulfillment actions

---

## Module 6 — Customer Experience

**Purpose:** Customer dashboard, wishlist, rewards, settings, and convenience features beyond core cart/orders.

**Frontend reference:** `CustomerDashboard.jsx`, `Wishlist.jsx`, `Placeholder.jsx` (rewards, settings), `customerData.js`, `customerShopData.js`

### What to implement

#### Customer dashboard

- Welcome summary with user name
- **Next delivery** — upcoming active order with ETA window
- Quick links: track order, view orders
- **Quick reorder** — product grid from past purchases or curated list
- **Rewards summary card** — points, tier, progress to next tier

#### Wishlist

- Add/remove products
- List: name, category, price, unit, rating, review count, badge, image
- Move single item to cart
- Add all to cart
- Persist per customer (UI buttons exist but do nothing today)

#### Rewards & loyalty

- Points balance
- Current tier and next tier
- Progress bar (points to next tier)
- Rules for earning points (e.g. per order spend) — define business rules
- Redemption rules (future)

#### Customer settings (placeholder page)

- Profile: name, email, phone, avatar
- Notification preferences
- Default delivery address
- Password change

#### Order history enhancements

- Working pagination
- Export/download orders (button exists, no logic)
- Filter by date range and status

### Business rules

- Wishlist items must reference valid, available products
- Rewards points updated on delivered orders (define accrual timing)
- Dashboard “next delivery” shows earliest active non-delivered order

### Supports in UI

- `/dashboard/customer`
- `/dashboard/customer/wishlist`
- `/dashboard/customer/rewards` (placeholder)
- `/dashboard/customer/settings` (placeholder)

### Dependencies

- Module 2 (Auth)
- Module 3 (Catalog)
- Module 4 (Cart)
- Module 5 (Orders)

---

## Module 7 — Shop Owner (Vendor) Operations

**Purpose:** Shop dashboard, full inventory CRUD, order management, and operational alerts.

**Frontend reference:** `ShopOwnerDashboard.jsx`, `Inventory.jsx`, `AddProduct.jsx`, `EditProduct.jsx`, `ProductContext`, `shopOwnerData.js`, `shopOwnerOrders.js`

### What to implement

#### Shop profile

- Shop linked to shop_owner user: name, logo, owner display name, contact email
- Registration date
- Status: Pending, Active, Suspended (set by admin)
- Shop settings page (placeholder): hours, delivery zones, notification prefs

#### Dashboard statistics

- Daily sales
- Active visitors (or proxy metric)
- Pending orders count
- Conversion rate (define formula)
- Recent orders table (subset of orders module)
- **Inventory alerts:**
  - Low stock products
  - Out of stock products
  - Expiring products (if expiry date tracked)

#### Inventory — product management

Full CRUD for shop’s products:

| Field | Notes |
|-------|-------|
| Name | Required |
| Description | Optional |
| Category | Required; align with catalog categories |
| Price | Required |
| Discount % | Optional |
| Stock quantity | Required |
| Unit type | Piece, per lb, per kg, per pack, per bottle |
| Brand | Optional |
| Taxable | Boolean |
| SKU | Optional, unique per shop |
| Image | Upload; replaces URL-only mock |

- List view: SKU, category, price label, stock status color, actions edit/delete
- Search and filter inventory
- Stock status auto-derived from quantity thresholds

#### Orders (shop owner view)

- Covered in Module 5 — implement shop-scoped queries and actions here
- Order detail: update status, reject with reason
- Tab filtering: New, Active, Completed
- Dashboard stats: new, in delivery, completed, returns

#### Reports / analytics (placeholder)

- `/dashboard/shop-owner/reports` — sales over time, top products, order volume
- Reuse order and product data

#### Product image upload

- Accept file upload from add/edit product forms
- Store via Module 1 file service
- Return URL for client display

### Business rules

- Shop owner can only CRUD products belonging to their shop
- Deleting a product may soft-delete if referenced in past orders
- New shop_owner signup → shop pending until admin approves (products may be hidden until active)
- Low stock threshold configurable per product or global default

### Supports in UI

- `/dashboard/shop-owner`
- `/dashboard/shop-owner/inventory`
- `/dashboard/shop-owner/inventory/add`
- `/dashboard/shop-owner/inventory/edit/:id`
- `/dashboard/shop-owner/orders`
- `/dashboard/shop-owner/orders/:orderId`
- `/dashboard/shop-owner/reports` (placeholder)
- `/dashboard/shop-owner/settings` (placeholder)

### Dependencies

- Module 1 (Foundation, file storage)
- Module 2 (Auth)
- Module 3 (Catalog) — products published to storefront
- Module 5 (Orders)

---

## Module 8 — Admin & Platform Management

**Purpose:** Platform-wide oversight of vendors, users, metrics, and configuration.

**Frontend reference:** `AdminDashboard.jsx`, `Analytics.jsx`, `Vendors.jsx`, `Users.jsx`, `Settings.jsx`, `adminData.js`

### What to implement

#### Admin dashboard

- **Platform stats:** total revenue, active users, shop performance aggregate
- **Recent users** table: name, email, role, join date, status
- **System events** feed: timestamp, type, description (order spike, new vendor, security, etc.)

#### Analytics

- Metrics: total users, total shops, total orders, total revenue, active users now
- **Growth chart** — monthly time series (users, orders, revenue — define series)
- **Recent activities** — human-readable activity stream
- Period selector (monthly, weekly — UI has dropdown but no data switch)

#### Vendor (shop) management

- List all shops with: id, name, logo, owner, email, registered date, status
- Search by name, owner, email
- Filter: Active, Pending, Suspended
- **Actions:**
  - Pending → Approve or Reject
  - Active → Suspend or Delete
- Summary cards: registration trends, total active, total suspended

#### User management

- List platform users (primarily customers in UI)
- Summary: total customers, active now, pending verifications
- Filter tabs: All, Active, Banned
- Fields: name, email, join date, status, total orders, avatar
- Actions: ban, activate, verify (UI menu exists but unwired)

#### Platform settings (stub page)

- Commission rate, default fees, maintenance mode, feature flags
- Email templates configuration (future)

#### Audit & system events

- Log significant actions: vendor approved, user banned, large order, failed login spikes
- Power admin dashboard event feed and analytics activity list

### Business rules

- Only admin role can access admin modules
- Deleting vendor must handle orphaned products and orders (soft delete or cascade policy)
- Suspending vendor hides shop from storefront and may block new orders
- Banned users cannot authenticate

### Supports in UI

- `/dashboard/admin`
- `/dashboard/admin/analytics`
- `/dashboard/admin/vendors`
- `/dashboard/admin/users`
- `/dashboard/admin/settings` (stub)

### Dependencies

- Module 2 (Auth, user records)
- Module 5 (Orders — revenue metrics)
- Module 7 (Shops/vendors)

---

## Module 9 — Cross-Cutting & Future Features

**Purpose:** Capabilities referenced in the UI but not implemented, or needed for production.

### What to implement

#### Payments

- Payment gateway integration
- Payment intent on checkout
- Webhook for payment confirmation
- Refunds on cancellation

#### Notifications

- Bell icons in customer and shop owner nav — no logic today
- Email/SMS/push: order confirmed, status updates, low stock, vendor approval

#### Real-time order tracking

- WebSocket or polling for status and courier location
- Map provider integration for live delivery map

#### OAuth social login

- Google and Apple sign-in (buttons present, non-functional)

#### Geolocation & address services

- “Detect Location” on checkout
- Address autocomplete

#### Promo & marketing engine

- Beyond single promo codes: scheduled deals, countdown timers on product cards

#### Multi-vendor cart policy

- Decide: one order per shop vs split orders — impacts checkout and order module design

#### Rate limiting & security

- Brute-force protection on login
- CORS configuration for Vite client
- Input sanitization, HTTPS, secrets management

#### Background jobs

- Expiry alerts, report generation, analytics aggregation, email queue

---

## 13. Frontend Gaps to Account For

When implementing the backend, be aware of these client inconsistencies — resolve in backend design and later client integration:

| Gap | Backend implication |
|-----|---------------------|
| Cart context only stores **count**, not items | Cart module must be full line-item store; client will need integration |
| Two separate **product models** (home mock vs shop inventory) | Single product entity with role-based views |
| Order history links to `/orders/:id` but **no detail page** | Still expose order detail for future client page |
| Header links to `/shop`, `/vendor`, `/blog` — **routes missing** | Catalog/search may power future shop listing pages |
| Filters and pagination are **cosmetic** | Implement real query params and metadata |
| Passwords in localStorage plaintext | Proper hashing and auth tokens |
| Wishlist not in sidebar (only header icon) | Same backend module regardless |
| Payment “Coming Soon” | Order can be created with `payment_status: pending` |
| Customer analytics/users routes exist as placeholders | Low priority unless product scope expands |

---

## 14. Module Dependency Map

```
Foundation (M1)
    └── Authentication (M2)
            ├── Catalog (M3) ←── Shop Owner Inventory (M7)
            ├── Cart & Checkout (M4)
            │       └── Orders & Fulfillment (M5)
            │               ├── Customer Experience (M6)
            │               └── Shop Owner Operations (M7)
            └── Admin & Platform (M8)
                    └── uses M5 + M7 data

Cross-Cutting (M9) — spans all modules
```

---

## Summary Checklist

Use this as a high-level delivery checklist:

- [ ] **M1** — Database, config, files, fees, pagination, seeds
- [ ] **M2** — Register, login, logout, sessions, password reset, role enforcement
- [ ] **M3** — Categories, products, reviews, search, homepage sections, banners
- [ ] **M4** — Cart CRUD, saved for later, promo codes, checkout validation
- [ ] **M5** — Create order, status workflow, tracking, reorder, export
- [ ] **M6** — Dashboard, wishlist, rewards, customer settings
- [ ] **M7** — Shop dashboard, inventory CRUD, image upload, alerts, shop orders
- [ ] **M8** — Admin stats, analytics, vendor approval, user moderation, audit log
- [ ] **M9** — Payments, notifications, OAuth, real-time tracking, jobs

---

*Generated from QuickBasket client analysis. Update this document as the frontend evolves or scope changes.*
