const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Compression (install: npm i compression) ─────────────────────────────────
// Reduces response sizes by ~70% — dramatically speeds up API responses.
// Run: npm install compression
// then uncomment the two lines below:
// const compression = require('compression');
// app.use(compression());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Cache headers for static-ish API responses ───────────────────────────────
// Tells browsers/CDNs to cache public GET responses for 60 s
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  next();
});

// Routes
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/students',   require('./routes/studentRoutes'));
app.use('/api/teachers',   require('./routes/teacherRoutes'));
app.use('/api/courses',    require('./routes/courseRoutes'));
app.use('/api/gallery',    require('./routes/galleryRoutes'));
app.use('/api/banners',    require('./routes/bannerRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/contacts',   require('./routes/contactRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Rabindra School of Art API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
