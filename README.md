# ConvoSync 💬

ConvoSync is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to seamlessly connect, message, and share images/videos in a beautifully designed, responsive interface.

---

## ✨ Features

- 🔐 **Authentication** – User registration and login system
- 🧑‍🤝‍🧑 **Real-Time Messaging** – Chat with friends instantly via Socket.IO
- 🖼️ **Media Support** – Send and preview images and videos in chat
- 📡 **Online Status** – See who's online in real time
- 🔍 **Search Users** – Search users by name or email to start a conversation
- 👤 **Profile Management** – Edit profile name and picture
- 🌙 **Dark Mode Support** – Beautiful UI with light and dark themes

---

## 🛠️ Tech Stack

### Frontend
- **React.js** + **Vite**
- **Redux Toolkit** for global state
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication

### Backend
- **Node.js** + **Express**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.IO** for real-time messaging
- **Cloudinary** for image/video uploads

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v16+)
- MongoDB Atlas or local instance
- Cloudinary account

  
- `.env` file with the following:
```env
# Backend
PORT= port
MONGODB_URI=your-mongodb-url
JWT_SECRET=jwt-secrect-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=api-key
CLOUDINARY_API_SECRET=api-secret
VITE_API_URL=api-url
FRONTEND_URL=your-frontend-url

# Frontend (Vite)
VITE_BACKEND_URL= ur-backend-url
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
