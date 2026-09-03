# 📚 Library Management System API

A robust, production-ready **REST API** for managing a Library — built with **Node.js**, **Express**, and **Firebase Firestore**.  
Supports full user authentication, book management, and borrow/return transactions with role-based access control.

🌍 **Live API URL:** [https://assignment-6-library-management-api-mbgn.onrender.com](https://assignment-6-library-management-api-mbgn.onrender.com)

---

## 🚀 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js v18+                        |
| Framework    | Express.js v5                       |
| Database     | Firebase Firestore (NoSQL)          |
| Auth         | JWT (JSON Web Tokens)               |
| Security     | Helmet, CORS, bcrypt, Rate Limiting |
| Validation   | express-validator                   |
| API Docs     | Swagger UI (OpenAPI 3.0)            |

---

## 📁 Project Structure

```
Aman koli 150096725119/
├── server.js                        # Entry point
├── package.json
├── .env                             # Environment variables (DO NOT commit)
├── .env.example                     # Template for environment variables
├── .gitignore
├── README.md
└── src/
    ├── config/
    │   ├── firebase.js              # Firebase Admin SDK setup
    │   └── swagger.js               # Swagger/OpenAPI configuration
    ├── controllers/
    │   ├── authController.js        # Register, Login, Profile
    │   ├── bookController.js        # CRUD for Books
    │   ├── transactionController.js # Borrow & Return logic
    │   └── userController.js        # Admin user management
    ├── middleware/
    │   ├── auth.js                  # JWT verification
    │   ├── role.js                  # Role-based access control
    │   ├── validator.js             # Input validation handler
    │   ├── rateLimiter.js           # Rate limiting (100 req/15 min)
    │   ├── logger.js                # Request logger
    │   └── errorHandler.js          # Global error handler
    ├── models/
    │   ├── userModel.js             # Firestore user operations
    │   ├── bookModel.js             # Firestore book operations
    │   └── transactionModel.js      # Firestore transaction operations
    ├── routes/
    │   ├── authRoutes.js            # /api/auth/*
    │   ├── bookRoutes.js            # /api/books/*
    │   ├── userRoutes.js            # /api/users/*
    │   └── transactionRoutes.js     # /api/transactions/*
    └── utils/
        └── jwt.js                   # JWT token generator
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/amankoli09/AI-Task-Assistant.git
cd "Aman koli 150096725119"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/) → your project → **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"** → download the JSON file
3. Place it in the project root

### 4. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
GOOGLE_APPLICATION_CREDENTIALS=./your-serviceAccountKey.json
```

### 5. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

✅ Server: **http://localhost:3000**  
📖 API Docs: **http://localhost:3000/api-docs**

---

## 🔐 Authentication

All protected routes require a **Bearer token**:
```
Authorization: Bearer <your_jwt_token>
```

### Roles
| Role        | Permissions                                           |
|-------------|-------------------------------------------------------|
| `student`   | Browse books, borrow/return, view own transactions    |
| `librarian` | All student permissions + manage books and all users  |

---

## 📡 API Endpoints

### 🔑 Auth — `/api/auth`

| Method | Endpoint     | Auth | Description             |
|--------|-------------|------|-------------------------|
| POST   | `/register` | ❌   | Register a new user     |
| POST   | `/login`    | ❌   | Login and get token     |
| GET    | `/profile`  | ✅   | Get your profile        |
| PUT    | `/profile`  | ✅   | Update your name        |

**Register:**
```json
{ "name": "Aman Koli", "email": "aman@example.com", "password": "secret123", "role": "student" }
```
**Login Response:**
```json
{ "success": true, "token": "eyJhbGci...", "data": { "userId": "...", "role": "student" } }
```

---

### 📖 Books — `/api/books`

| Method | Endpoint      | Auth | Role      | Description            |
|--------|--------------|------|-----------|------------------------|
| GET    | `/`          | ✅   | Any       | Get all books          |
| GET    | `/:id`       | ✅   | Any       | Get book by ID         |
| GET    | `/search?q=` | ✅   | Any       | Search by title/author |
| POST   | `/`          | ✅   | librarian | Add new book           |
| PUT    | `/:id`       | ✅   | librarian | Update book            |
| DELETE | `/:id`       | ✅   | librarian | Delete book            |

**Add Book:**
```json
{ "title": "Clean Code", "author": "Robert C. Martin", "isbn": "9780132350884", "category": "Programming", "quantity": 3 }
```

---

### 🔄 Transactions — `/api/transactions`

| Method | Endpoint          | Auth | Role      | Description         |
|--------|------------------|------|-----------|---------------------|
| POST   | `/borrow/:bookId` | ✅   | Any       | Borrow a book (14d) |
| POST   | `/return/:bookId` | ✅   | Any       | Return a book       |
| GET    | `/my`             | ✅   | Any       | Your history        |
| GET    | `/`               | ✅   | librarian | All transactions    |

---

### 👥 Users — `/api/users`

| Method | Endpoint    | Auth | Role      | Description      |
|--------|------------|------|-----------|------------------|
| GET    | `/`        | ✅   | librarian | Get all users    |
| GET    | `/:id`     | ✅   | librarian | Get user by ID   |
| PUT    | `/:id/role`| ✅   | librarian | Update user role |
| DELETE | `/:id`     | ✅   | librarian | Delete user      |

---

## 🗄️ Firestore Collections

### `Users`
```json
{ "userId": "user_...", "name": "Aman Koli", "email": "aman@example.com", "password": "<hash>", "role": "student", "createdAt": "...", "updatedAt": "..." }
```

### `Books`
```json
{ "bookId": "<auto_id>", "title": "Clean Code", "author": "Robert C. Martin", "category": "Programming", "quantity": 3, "status": "available", "createdAt": "..." }
```

### `Transactions`
```json
{ "transactionId": "<auto_id>", "userId": "...", "bookId": "...", "type": "borrow", "status": "active", "borrowDate": "...", "dueDate": "...", "returnDate": null }
```

---

## 🛡️ Security Features

- **Helmet** — Secure HTTP headers
- **CORS** — Cross-origin policy
- **Rate Limiting** — 100 req / 15 min per IP
- **bcrypt** — Passwords hashed (10 salt rounds)
- **JWT** — Stateless auth with expiry
- **Input Validation** — express-validator on all inputs
- **RBAC** — Librarian vs Student access enforced

---

## 🌱 Environment Variables

| Variable                         | Description                      | Example                      |
|----------------------------------|----------------------------------|------------------------------|
| `PORT`                           | Server port                      | `3000`                       |
| `NODE_ENV`                       | Environment mode                 | `development`                |
| `JWT_SECRET`                     | Secret key for JWT               | `mysupersecretkey`           |
| `JWT_EXPIRES_IN`                 | JWT expiry                       | `1d`                         |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account | `./serviceAccountKey.json`   |

---

## 👨‍💻 Author

**Aman Koli** — Student ID: `150096725119`  
GitHub: [@amankoli09](https://github.com/amankoli09)

---

## 📄 License

ISC License
