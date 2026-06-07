# Smart campus manager system

## Overview

Smart campus manager system is a web-based platform designed to help students share, manage, and access academic learning resources efficiently. The system provides a centralized environment where students can upload study materials, browse resources shared by others, and organize their learning activities through an integrated Study Planner.

The goal of StudyShare is to promote collaborative learning while helping students stay organized and productive throughout their academic journey.

---

## Key Features

### Resource Management

* Upload study materials such as PDFs, documents, and videos.
* View and manage uploaded resources.
* Search and filter resources by subject.
* Download and access learning materials easily.

### User Authentication

* Secure user registration and login.
* Protected user dashboard.
* Personalized user experience.

### Study Planner

* Create and manage study plans.
* Add tasks and study schedules.
* Track task completion progress.
* Weekly timetable view for study activities.
* Calendar integration for planning study sessions.

### Dashboard

* Overview of study plans and tasks.
* Progress tracking and completion statistics.
* Quick access to resources and planner features.

### Admin Management

* Review uploaded resources.
* Approve or reject submissions.
* Maintain resource quality and platform integrity.

---

## Technologies Used

### Frontend

* React.js
* React Router
* Axios
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional Tools

* JWT Authentication
* Nodemon
* Git & GitHub

---

## System Architecture

StudyShare follows the MERN Stack architecture:

Frontend (React.js)
⬇
Backend API (Node.js + Express.js)
⬇
MongoDB Database

This architecture provides scalability, maintainability, and efficient data management.

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory and configure:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Future Enhancements

* Dark Mode Support
* Study Session Reminders
* Resource Rating System
* Subject-Based Recommendations
* Drag-and-Drop Timetable Management
* Mobile Responsive Improvements
* Analytics Dashboard

---

## Authors

Developed as an academic project to support collaborative learning and effective study management for university students.
