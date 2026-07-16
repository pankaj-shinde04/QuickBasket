# 🛒 QuickBasket

A full-stack online grocery marketplace where customers browse and order fresh products, shop owners manage their stores and inventory, and admins oversee the entire platform.

---

## 📸 Features

### 👤 Customer
- Browse products by category, search, and filter
- Product detail pages with full info
- Add to cart, manage quantities, checkout
- COD and Razorpay online payment
- Order history, live order tracking
- Profile & password settings

### 🏪 Shop Owner
- Register and manage shop profile
- Full inventory management (add / edit / delete products)
- View and update order statuses
- Analytics dashboard (revenue, orders, top products)
- Profile & shop settings

### 🛡️ Admin
- Platform-wide analytics (users, shops, orders, revenue)
- Manage and approve/reject vendor accounts
- Manage customer accounts (ban/unban)
- Create admin accounts

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS v4, Framer Motion |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose |
| **Auth** | JWT (HTTP-only cookies + localStorage) |
| **Payments** | Razorpay |
| **File Storage** | Cloudinary |
| **Email** | Resend |
| **Icons** | React Icons (HeroIcons v2) |

---

## 📁 Project Structure

```
QuickBasket/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── server/          # Express backend API
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middleware/
        └── services/
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/your-username/QuickBasket.git
cd QuickBasket
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quickbasket
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=QuickBasket <you@yourdomain.com>

RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open http://localhost:5173

### 4. Create First Admin (optional)
```bash
cd server
npm run create-admin
```

---

## 🚀 Deployment

### 🔷 Deploy Backend on Render

**Step 1** — Go to https://render.com → Sign up / Log in

**Step 2** — Click "New" → "Web Service"

**Step 3** — Connect your GitHub repo → Select the QuickBasket repo

**Step 4** — Fill in these settings:

| Field | Value |
|---|---|
| Name | quickbasket-api |
| Root Directory | server |
| Runtime | Node |
| Build Command | npm install |
| Start Command | npm start |

**Step 5** — Scroll to "Environment Variables" → Add each one:

```
PORT                    = 5000
MONGODB_URI             = mongodb+srv://...  (from MongoDB Atlas)
JWT_SECRET              = your_long_random_secret
CLIENT_URL              = https://your-app.vercel.app

CLOUDINARY_CLOUD_NAME   = xxx
CLOUDINARY_API_KEY      = xxx
CLOUDINARY_API_SECRET   = xxx

RESEND_API_KEY          = re_xxx
EMAIL_FROM              = QuickBasket <you@yourdomain.com>

RAZORPAY_KEY_ID         = rzp_live_xxx
RAZORPAY_KEY_SECRET     = xxx
```

**Step 6** — Click "Create Web Service"

You will get a URL like: https://quickbasket-api.onrender.com

---

### 🔺 Deploy Frontend on Vercel

**Step 1** — Go to https://vercel.com → Sign up / Log in

**Step 2** — Click "Add New" → "Project"

**Step 3** — Import your GitHub repo → Select QuickBasket

**Step 4** — Change Root Directory to: client

**Step 5** — Under "Environment Variables" add:

```
VITE_API_URL = https://quickbasket-api.onrender.com/api
```

**Step 6** — Framework auto-detects as Vite — leave all other settings as default

**Step 7** — Click "Deploy"

You will get a URL like: https://quickbasket.vercel.app

**Step 8** — Go back to Render → Update CLIENT_URL env var to your Vercel URL → Redeploy

---

## 🔑 Required External Services

| Service | Purpose | Free Tier |
|---|---|---|
| MongoDB Atlas (https://cloud.mongodb.com) | Database | 512MB free |
| Cloudinary (https://cloudinary.com) | Image uploads | 25GB free |
| Resend (https://resend.com) | Email (password reset) | 100 emails/day free |
| Razorpay (https://razorpay.com) | Payments | Test mode free |

---

## 📋 Environment Variables Reference

### Backend (server/.env)

| Variable | Description | Required |
|---|---|---|
| PORT | Server port (default: 5000) | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| CLIENT_URL | Frontend URL (for CORS) | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| RESEND_API_KEY | Resend email API key | For email features |
| EMAIL_FROM | Sender email address | For email features |
| RAZORPAY_KEY_ID | Razorpay key ID | For online payment |
| RAZORPAY_KEY_SECRET | Razorpay secret | For online payment |

### Frontend (client/.env)

| Variable | Description | Required |
|---|---|---|
| VITE_API_URL | Full backend API URL | Yes |

---

## 📜 License

MIT
