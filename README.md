# Campus Service Request Management System

CampusFix is a full-stack web application designed to manage and track service requests within a college campus.

Students can raise service requests, administrators can manage and assign requests to staff, and staff members can update the progress and status of assigned requests.

## 🚀 Features

### 👨‍🎓 Student
- Student registration and login
- Create campus service requests
- Select request category and priority
- View submitted requests
- Track request status

### 👨‍💼 Admin
- Admin login
- View all service requests
- View registered staff members
- Assign requests to staff
- Update request status
- Manage request priority

### 👷 Staff
- Staff login
- View assigned service requests
- Update request progress
- Mark requests as resolved

## 🔄 Request Workflow

Student creates request
        ↓
Admin reviews request
        ↓
Admin assigns staff
        ↓
Staff works on request
        ↓
Staff updates status
        ↓
Student tracks status

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- React-Bootstrap
- Axios
- Vite

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcryptjs

### Tools
- Git
- GitHub
- VS Code

## 📂 Project Structure

CampusFix/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/AkshayaSakthivel-Developer/CampusFix.git
