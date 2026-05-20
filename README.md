# Rabindra School of Art — Full Stack Website

A production-ready MERN Stack website for **Rabindra School of Art**, a fine art, dance, music, aerobics, and yoga school established in 2002, affiliated with Pracheen Kala Kendra, Chandigarh (Regd. No. 5071).

---

## 📁 Folder Structure

```
rabindra-school-of-art/
├── client/          # React + Vite + Tailwind CSS frontend
└── server/          # Node.js + Express + MongoDB backend
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone / Extract the project

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 3. Seed the Database

```bash
cd server
node seed.js
```

This creates:
- 1 default admin account
- All courses (Art + Dance structure)
- 2 sample teachers
- 2 sample students
- 3 sample gallery images
- 2 sample banners

### 4. Setup the Frontend

```bash
cd client
cp .env.example .env
# Edit .env if your API URL differs
npm install
```

### 5. Run the App

**Backend (port 5000):**
```bash
cd server
npm run dev
```

**Frontend (port 5173):**
```bash
cd client
npm run dev
```

---

## 🔑 Default Admin Credentials

| Field    | Value                   |
|----------|-------------------------|
| Email    | admin@rabindraart.com   |
| Password | admin123                |

> ⚠️ Change these credentials immediately in production.

---

## 📡 API Documentation

### Auth
| Method | Endpoint          | Access | Description       |
|--------|-------------------|--------|-------------------|
| POST   | /api/auth/login   | Public | Admin login        |
| POST   | /api/auth/logout  | Public | Logout             |

### Students
| Method | Endpoint                   | Access | Description              |
|--------|----------------------------|--------|--------------------------|
| GET    | /api/students              | Admin  | List all students         |
| POST   | /api/students              | Admin  | Add student               |
| GET    | /api/students/:id          | Admin  | Get student profile       |
| PUT    | /api/students/:id          | Admin  | Update student            |
| DELETE | /api/students/:id          | Admin  | Delete student            |
| POST   | /api/students/:id/art      | Admin  | Upload art photo          |

### Teachers
| Method | Endpoint           | Access | Description        |
|--------|--------------------|--------|--------------------|
| GET    | /api/teachers      | Public | List all teachers   |
| POST   | /api/teachers      | Admin  | Add teacher         |
| PUT    | /api/teachers/:id  | Admin  | Update teacher      |
| DELETE | /api/teachers/:id  | Admin  | Delete teacher      |

### Courses
| Method | Endpoint           | Access | Description       |
|--------|--------------------|--------|-------------------|
| GET    | /api/courses       | Public | List all courses   |
| POST   | /api/courses       | Admin  | Add course         |
| PUT    | /api/courses/:id   | Admin  | Update course      |
| DELETE | /api/courses/:id   | Admin  | Delete course      |

### Gallery
| Method | Endpoint           | Access | Description        |
|--------|--------------------|--------|--------------------|
| GET    | /api/gallery       | Public | List gallery items  |
| POST   | /api/gallery       | Admin  | Upload image        |
| DELETE | /api/gallery/:id   | Admin  | Delete image        |

### Banners
| Method | Endpoint           | Access | Description        |
|--------|--------------------|--------|--------------------|
| GET    | /api/banners       | Public | List active banners |
| POST   | /api/banners       | Admin  | Add banner          |
| PUT    | /api/banners/:id   | Admin  | Update banner       |
| DELETE | /api/banners/:id   | Admin  | Delete banner       |

### Admissions
| Method | Endpoint                       | Access | Description         |
|--------|--------------------------------|--------|---------------------|
| GET    | /api/admissions                | Admin  | List all admissions  |
| POST   | /api/admissions                | Public | Submit admission form|
| PUT    | /api/admissions/:id/status     | Admin  | Approve/Reject       |

### Contacts
| Method | Endpoint                  | Access | Description          |
|--------|---------------------------|--------|----------------------|
| GET    | /api/contacts             | Admin  | List all messages     |
| POST   | /api/contacts             | Public | Submit contact form   |
| PUT    | /api/contacts/:id/read    | Admin  | Mark as read          |

---

## 📞 Contact

- **Phone:** 7903495153, 8797288121
- **Affiliation:** Pracheen Kala Kendra, Chandigarh (Regd. No. 5071)
- **Established:** 2002
