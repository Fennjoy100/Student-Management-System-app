# EduFlow | Student Management System 🎓

EduFlow is a modern, full-stack Student Management System designed to streamline educational administration. It features a sleek, glassmorphism-inspired UI and a robust Flask-based backend with MongoDB integration.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Fennjoy100/gh.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **📊 Comprehensive Dashboard**: Real-time statistics on total students, active courses, and average attendance.
- **👥 Student Management**: Easily add, view, and manage student profiles and enrollment status.
- **📅 Attendance Tracking**: Digital attendance logs for monitoring student presence.
- **📝 Grade Management**: Track and manage academic performance across different grades.
- **🎨 Modern UI/UX**: Premium design with glassmorphism effects, responsive layouts, and dark mode support.
- **⚡ Fast Performance**: Powered by Vite and React for a seamless user experience.

---

## 🚀 Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for lightning-fast builds
- **Lucide React** for beautiful iconography
- **Vanilla CSS** with custom variables and Glassmorphism

### Backend
- **Python** with **Flask**
- **MongoDB** for flexible data storage
- **Flask-CORS** for secure cross-origin communication
- **Dotenv** for environment variable management

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python 3.8+](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Fennjoy100/gh.git
cd gh
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and add your MongoDB URI:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
5. Start the server:
   ```bash
   python app.py
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── backend/
│   ├── routes/          # API Route definitions
│   ├── models/          # Database models (Mongoose/PyMongo)
│   ├── .env             # Environment variables
│   ├── app.py           # Main Flask entry point
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Dashboard, Students, etc.)
│   │   ├── App.tsx      # Main React component
│   │   └── index.css    # Global styles & Design system
│   ├── public/          # Static assets
│   └── package.json     # Node.js dependencies
└── README.md
```

---

## ☁️ Deployment (Vercel)

This project is pre-configured for seamless deployment on **Vercel**.

### Steps to Deploy:
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```
2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"New Project"**.
   - Select your `APP` repository.
3. **Project Settings**:
   - Vercel will automatically detect the `vercel.json` file.
   - **Framework Preset**: Select `Other` (or let it auto-detect).
   - **Root Directory**: Leave as `./` (Root).
4. **Environment Variables**:
   - If you have implemented the MongoDB connection, add `MONGO_URI` in **Settings > Environment Variables**.

### 🔗 API Handling
The project uses a rewrite rule defined in `vercel.json`. All requests to `/api/*` are automatically routed to your Flask backend in the `backend/` folder. This eliminates CORS issues in production!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by [Fennjoy](https://github.com/Fennjoy100/gh)**
