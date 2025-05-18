
# Notification System

This is a simple and flexible notification system built with **React** (frontend) and **Node.js** (backend). It supports sending notifications through:

- **Email**
- **SMS (via Twilio)**
- **In-App messages**

The system is designed to help users compose, send, and view notifications with ease. Ideal for small apps, admin panels, or personal projects.

## Features

- Choose between Email, SMS, or In-App notifications
- Real-time fetching of in-app messages
- Built with modern tools like React Hooks and Axios
- Neatly organized UI with basic styling (TailwindCSS)
- Beginner-friendly code structure and comments

---

## Getting Started

### Clone the repository

https://github.com/learnthusalearner/Assignment_11.git    
cd notification-system



## IMPORTANT

- EMAIL_USER="your email address"
- EMAIL_PASS="your email password"

- TWILIO_SID="your Twilio SID"
- TWILIO_AUTH_TOKEN="your Twilio Auth Token"
- TWILIO_PHONE_NUMBER="your Twilio number"
## Installation

Frontend
- cd frontend
- npm install
- npm run dev

Backend
- cd backend
- npm install
- node index.js


## Tech Stack

- Frontend: React + TailwindCSS + Axios

- Backend: Node.js + Express

- Email: Nodemailer

- SMS: Twilio

- In-App Storage: Local file or in-memory (can be replaced with DB)