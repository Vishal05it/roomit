# 🏢 Room IT - Meeting Room Booking System

A full-stack Meeting Room Booking System built to simplify meeting room reservations while preventing double bookings and ensuring fair slot allocation.

**🌐 Live Demo:** [https://roomit.vercel.app/]

**📂 GitHub Repository:** https://github.com/Vishal05it/roomit

---

## ✨ Features

### 🏠 Room Management

* Browse available meeting rooms.
* View room details including:

  * Image
  * Description
  * Floor
  * Capacity
* Responsive and clean UI.

---

### 📅 Room Booking

* Book meeting rooms for available time slots.
* Date selection.
* 30-minute booking slots.
* Instant booking confirmation.

---

### 🔒 Double Booking Prevention

The application prevents multiple users from booking the same room for the same slot.

* Database-level slot validation.
* Conflict detection.
* Instant user feedback.

---

### 📖 My Bookings

Users can:

* View all bookings.
* Track booking status.
* View booking date and slot.
* Check cancellation eligibility.

---

### ❌ Cancellation System

Bookings can be cancelled directly from the dashboard.

Three booking states:

* Active
* Cancelled
* Completed

---

### 💰 Refund Policy

If a booking is cancelled at least 2 hours before the scheduled start time:

✅ Refund eligible.

Otherwise:

❌ Non-refundable.

The system automatically determines refund eligibility.

---

### 📧 Email Notifications

Automatic emails are sent for:

✅ Booking confirmation.

✅ Booking cancellation with refund.

✅ Booking cancellation without refund.

---

## ⭐ Bonus Features Implemented

The assignment required implementing any **2 bonus features**.

### 1. 🧹 Cleaning Buffer Time

After a booking ends, the room automatically enters a **30-second cleaning period**.

During this buffer:

* The room cannot be booked.
* Additional bookings are temporarily blocked.

This simulates real-world maintenance and preparation time between meetings.

---

### 2. ⏳ Daily Booking Limit

To ensure fair room usage:

* A user can book a maximum of **4 hours per day**.
* Since each slot is 30 minutes,
* Maximum allowed bookings:

```
8 Slots Per Day
```

Further booking attempts are automatically rejected.

---

## 🎨 User Experience

* Responsive UI.
* Loading indicators.
* Button loaders.
* Toast notifications.
* Booking status badges.
* Smooth animations.
* Booking history.
* Audio feedback for booking conflicts.

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Context API
* Lucide React

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional

* Nodemailer
* REST APIs

---

## 📂 Project Structure

```
Frontend

↓

REST APIs

↓

Express Server

↓

MongoDB Database

↓

Email Services
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/Vishal05it/roomit.git
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file and configure:

```
MONGO_URI=

PORT=

EMAIL=

EMAIL_PASSWORD=

FRONTEND_URL=

BACKEND_URL=
```

Configure additional variables as required.

---

## 📋 Assignment Requirements Covered

✅ Meeting room browsing.

✅ Room booking.

✅ Slot management.

✅ Double booking prevention.

✅ Booking history.

✅ Booking cancellation.

✅ Refund eligibility.

✅ Email notifications.

✅ Bonus Feature: Cleaning buffer.

✅ Bonus Feature: Daily booking quota.

---

---

## 👨‍💻 Developed By

**Vishal Tiwari**

Built as part of a Full Stack Developer assessment to demonstrate backend correctness, business logic implementation, and clean user experience.
