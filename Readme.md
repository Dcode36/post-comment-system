# 📝 Post & Comment App

A full-stack MERN application where users can create posts, like, comment, and interact with others using a modern UI and a rich text editor. It includes user authentication, secure routes, and clean API design.

---

## 🚀 Installation Guide

Follow these steps to set up and run the application on your local machine:

### 📦 Frontend Setup

```bash
cd Frontend
npm install
npm run dev

cd Backend
npm install
npm start


Create a .env file inside the Backend directory with the following content:
env
Copy
Edit
PORT=9000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
```

---

## ⚙️ Functionalities

### 📬 Post & Comment Features

- ✅ Users can **create new posts**
- 👍 Users can **like** or **dislike** a post
- 💬 Users can **comment** on any post any number of times
- 🗨️ **Only the post author** can **reply to comments** for clarity and moderation

---

### 👤 User Authentication

- 🔐 Secure **Login** and **Signup** features using JWT
- 🧑‍💻 **Only logged-in users** can:
  - Create new posts
  - Like or comment on existing posts

---

### 🖋️ Rich Text Editor (React-Quill)

- Users can format posts and comments with:
  - **Headings**, **bold**, **underline**, **italic**
  - **Colored text**, **hyperlinks**, and more
- Offers a flexible, expressive WYSIWYG experience for content creation

---


## 💻 Tech Stack

- **Frontend:** React, React-Quill, Material UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose

### 📘 Why This Stack?

- **MongoDB:** Offers a flexible schema perfect for storing rich post content and nested comments. It enables fast data retrieval and is ideal for scaling dynamic content.
- **Express & Node.js:** Lightweight and efficient for building REST APIs with clear route separation and middleware support.
- **React & MUI:** Delivers a highly responsive and modular UI, with Material UI providing a clean, modern design system.
- **React-Quill:** A feature-rich WYSIWYG editor allowing users to format posts and comments with headings, bold text, colors, links, and more.

---

## 🗂️ API Design

- Follows **RESTful principles** for clarity and consistency.
- Separate models and routes for:
  - **User Authentication**
  - **Comments and Likes**
- Post and Comment schemas are designed to allow scalable interactions and fast lookups.

---

## 🔐 Important Note

 ⚠️ While using this application, make sure to log in with different accounts using **incognito windows** or **different browsers** or **different accounts**.  
 This is because the login token is stored in **`localStorage`**, which maintains session state and may prevent switching users in the same browser tab.

