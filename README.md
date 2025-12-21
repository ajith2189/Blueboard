# 📘 Blueboard | AI-Integrated E-Learning Ecosystem

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Docker](https://img.shields.io/badge/docker-ready-blue?style=flat-square&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/redis-caching-red?style=flat-square&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

**Blueboard** is a scalable, full-stack E-Learning platform architected to support a multi-role ecosystem (Students, Tutors, Admins). It features real-time communication, AI-driven learning assistance, and a high-performance backend optimized for speed and security.

> **Live Demo:** [Link to your deployed site]  
> **API Docs:** [Postman](https://www.postman.com/ajith-1883991/workspace/e-learning-documentation/collection/44830466-2f1a18b0-36b9-4418-b4be-c7f318560cf6?action=share&source=copy-link&creator=44830466)

---

## 🏗️ Architecture & Design

We followed a strict **Design-First** and **Schema-Driven** development lifecycle.

### 🎨 UI/UX (Figma)
Designed for accessibility and flow before a single line of code was written.
* [**View Figma Design System**](https://www.figma.com/design/WpgCfbhASwT1jXZ0HbISzu/E-learning--Blue-Board-?node-id=280-5392&t=J10xH9IC8fY2i1pI-0)

### 💾 Database Schema (Eraser.io)
A normalized NoSQL schema designed for scale, utilizing embedded vs. referenced patterns based on access frequency.
* [**View Database Architecture**](https://app.eraser.io/workspace/hKiSmrBZWYxMCPFNYFrH)

---

## 🚀 Key Features

### Core Infrastructure
* **Role-Based Access Control (RBAC):** Distinct portals for **Students**, **Tutors**, and **Admins**.
* **Secure Authentication:** JWT-based stateless auth with **Redis blacklisting** for secure logouts.
* **Session Management:** Redis-backed session handling for OTP verification during registration.

### Interactive Learning
* **🤖 AI Lesson Assistant:** Integrated **OpenAI API** to provide contextual, real-time explanations within course modules.
* **💬 Real-Time Chat:** Instant messaging between students and tutors using **Socket.io**, with message persistence and online status tracking.
* **📹 Media Streaming:** Course content served via **AWS S3** for reliable delivery.

### E-Commerce & Payments
* **Razorpay Integration:** Full checkout flow including cart management, wallet system, and coupon logic.
* **Secure Transactions:** Webhook verification ensures data integrity for all payments.

### Performance & DevOps
* **🚀 Optimized Queries:** Utilized MongoDB **Aggregation Pipelines** and compound indexing to reduce course retrieval latency by **~60% (500ms → 200ms)**.
* **🐳 Containerized Deployment:** Fully Dockerized environment (Node.js, MongoDB, Redis) orchestrated via **Docker Compose**.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js, REST API (40+ Endpoints) |
| **Database** | MongoDB (Atlas), Mongoose |
| **Caching/Real-time** | Redis, Socket.io |
| **DevOps/Cloud** | Docker, AWS S3, Vercel (FE), Heroku (BE) |
| **Integrations** | OpenAI API, Razorpay, SendGrid (Email) |

---

## ⚡ Getting Started (Local Setup)

This project utilizes **Docker Compose** for a seamless local development experience.

### Prerequisites
* Docker & Docker Compose
* Node.js (v18+)
* Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/ajith2189/Blueboard.git](https://github.com/ajith2189/Blueboard.git)
    cd Blueboard
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root directory. You will need credentials for AWS, Razorpay, and OpenAI.
    ```env
    # Server
    PORT=5000
    NODE_ENV=development
    
    # Database & Cache
    MONGO_URI=mongodb://mongo:27017/blueboard
    REDIS_URL=redis://redis:6379

    # Auth & Security
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRE=7d

    # Cloud Services
    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...
    AWS_BUCKET_NAME=...
    
    # AI & Payments
    OPENAI_API_KEY=sk-...
    RAZORPAY_KEY_ID=...
    RAZORPAY_KEY_SECRET=...
    ```

3.  **Run with Docker**
    Spin up the backend, database, and cache services instantly.
    ```bash
    docker-compose up --build
    ```

4.  **Run Frontend**
    Open a new terminal for the React application.
    ```bash
    cd client
    npm install
    npm start
    ```

---

## 📈 Performance Methodology

We take performance seriously. By analyzing slow query logs, we identified bottlenecks in the course feed generation.

* **Problem:** N+1 query issues when fetching course metadata + instructor details.
* **Solution:** Implemented MongoDB `$lookup` aggregations and applied Compound Indexes on `status` and `category` fields.
* **Result:** Average response time dropped from **500ms to <200ms**.

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes (`git commit -m 'Add some NewFeature'`)
4.  Push to the Branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Architected by [Ajith](https://github.com/ajith2189)**
