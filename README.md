# Presight Exercise

This repository contains the solution for the Presight coding exercise. It includes a full-stack application with a client-side React app and a Node.js/Express server.

## 🧱 Project Structure

people-streamer/

├── client/ # Frontend (React)

├── server/ # Backend (Node.js + Express)

├── README.md # Project documentation



---

## ⚙️ Tech Stack

### Frontend (client/)
- **React** (with TypeScript)
- **Vite** for fast development
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Jest** & **React Testing Library** for unit tests

### Backend (server/)
- **Node.js**
- **Express.js**
- **CORS** for cross-origin resource sharing
- **Stream API** for chunked responses
- **TypeScript**

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Ajay493/presight-exercise.git
cd presight-exercise
```


### 2. Setup the backend
```bash
cd server
npm install
npm run dev
```
By default, the server runs on http://localhost:3001

### 3. Setup the frontend
```bash
cd ../client
npm install
npm run dev
```
The frontend will run on http://localhost:5173 and fetch data from the backend.

### 🧪 Running Tests
To run frontend tests:

```bash
cd client
npm run test
```
### ✅ Features
Streams people data in real-time

Filters by country

Lazy-loads more people on scroll

Mobile responsive UI

Handles network states (loading/error)

Includes unit tests
