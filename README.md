# BookEasy 🗓️✨  
**Your Simple Appointment Booking Platform**

BookEasy is a modern, full-stack MERN web application for scheduling appointments seamlessly—whether it's a salon visit, medical checkup, yoga session, or any other service. Enjoy effortless booking, secure authentication, Stripe payments, and a clean, responsive experience.

---

## 🛠️ Features

- 👤 **User Registration & Login** — JWT-based secure authentication
- 📆 **Easy Appointment Booking** — Schedule and cancel appointments with professionals
- 💳 **Stripe Payments** — Secure checkout for paid bookings
- 🧾 **View All Bookings** — Profile page shows upcoming and past appointments
- 💅 **Responsive Design** — Mobile-friendly UI powered by Tailwind CSS
- 🔄 **In-Memory Fallback** — Works without MongoDB for local demo/testing

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express 5, Mongoose |
| Payments | Stripe Checkout |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## 📂 Folder Structure

```
Appointment-Booking-Platform/
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/api.js
│   └── package.json
├── backend/               # Express API routes & models
│   ├── routes/
│   ├── models/
│   ├── store/
│   └── package.json
├── server.js              # Unified dev/production server
├── .env.example           # Environment variable template
└── package.json           # Root scripts
```

---

## ⚙️ How to Run Locally

### 1. Clone and install dependencies

```bash
git clone https://github.com/Anandkumar04/Appointment-Booking-Platform.git
cd Appointment-Booking-Platform
npm run install:all
```

This installs dependencies in both `backend/` and `frontend/`.

### 2. Configure environment

Copy the example env file to the **project root** (one file for everything):

```bash
cp .env.example .env
```

All frontend (`VITE_*`) and backend (`STRIPE_SECRET_KEY`, `MONGO_URI`, etc.) variables go in this **single root `.env` file**. Do not use `backend/.env`.

Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `JWT_SECRET` | Yes (prod) | Secret for signing JWT tokens |
| `MONGO_URI` | No | MongoDB connection string |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `VITE_API_URL` | No | Leave empty for local dev |

### 3. Start development server

**In VS Code:** open the project root folder, then either:
- Terminal → `npm run dev`
- Or press **F5** (Run and Debug → "Run BookEasy (dev)")

**Important:** Always run from the **project root**, not the `frontend/` folder.

```bash
npm run dev
```

Open **http://localhost:3000** — the server serves both the React frontend (via Vite) and the API.

### 4. Production build

```bash
npm run build
npm run start:prod
```

Open **http://localhost:3000** — serves the built React app from `frontend/dist`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| GET | `/api/appointments/booked-slots` | Get booked time slots |
| POST | `/api/payments/create-checkout-session` | Start Stripe checkout |

---

## 🙋‍♂️ Author

**Anand Kumar**  
GitHub: [@Anandkumar04](https://github.com/Anandkumar04)

---

## 📃 License

This project is licensed under the MIT License.
