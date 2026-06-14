# 🏢 Room IT - Meeting Room Booking System

A full-stack Meeting Room Booking System built to simplify meeting room reservations while preventing double bookings and ensuring fair slot allocation.

**🌐 Live Demo:** [[https://roomit.vercel.app/](https://roomit-alpha.vercel.app/)]

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

## 🏗 Initial Room Setup -SEED COMMAND

Since Room IT is designed to work with predefined meeting rooms, you'll need to populate the database with some room data before using the application.

You can do this using either of the following methods.

---

### Method 1: MongoDB Shell (Recommended)

Open your MongoDB shell and run: (Example data, you can freely use your own data)

```javascript
db.rooms.insertMany([
  {
    "title": "Conference Room A",
    "description": "A spacious meeting room equipped with a projector and comfortable seating, ideal for team discussions and client meetings.",
    "floor": 1,
    "capacity": 8,
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
  },
  {
    "title": "Board Room",
    "description": "Premium board room designed for executive meetings, presentations, and strategic planning sessions.",
    "floor": 2,
    "capacity": 12,
    "image": "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800"
  },
  {
    "title": "Discussion Room",
    "description": "A compact and quiet space suitable for brainstorming sessions, interviews, and one-on-one discussions.",
    "floor": 3,
    "capacity": 4,
    "image": "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800"
  },
  {
    "title": "Training Room",
    "description": "A large training room with modern facilities, suitable for workshops, seminars, and team learning activities.",
    "floor": 4,
    "capacity": 20,
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
  },
  {
    "title": "Meeting Room B",
    "description": "A modern meeting room featuring a smart display and collaborative workspace for daily team meetings.",
    "floor": 2,
    "capacity": 6,
    "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
  }
]);
```

---

### Method 2: Postman API

You can also create rooms directly using the Room IT API.

#### Endpoint

```
POST http://localhost:<YOUR_PORT>/room/api/createroom
```

#### Body (Raw JSON) - Example data, you can freely use your own data

```json
{
  "email": "<YOUR_EMAIL_FROM_ENV>",
  "rooms": [
    {
      "title": "Conference Room A",
      "description": "A spacious meeting room equipped with a projector and comfortable seating, ideal for team discussions and client meetings.",
      "floor": 1,
      "capacity": 8,
      "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
    },
    {
      "title": "Board Room",
      "description": "Premium board room designed for executive meetings, presentations, and strategic planning sessions.",
      "floor": 2,
      "capacity": 12,
      "image": "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800"
    },
    {
      "title": "Discussion Room",
      "description": "A compact and quiet space suitable for brainstorming sessions, interviews, and one-on-one discussions.",
      "floor": 3,
      "capacity": 4,
      "image": "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800"
    },
    {
      "title": "Training Room",
      "description": "A large training room with modern facilities, suitable for workshops, seminars, and team learning activities.",
      "floor": 4,
      "capacity": 20,
      "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
    },
    {
      "title": "Meeting Room B",
      "description": "A modern meeting room featuring a smart display and collaborative workspace for daily team meetings.",
      "floor": 2,
      "capacity": 6,
      "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
    }
  ]
}
```

---

## 🔒 Security Note

The room creation API is protected for security purposes.

**Important:**

The `email` field in the request body **must exactly match the email configured in your ****`.env`**** file**.

Example:

```
EMAIL=your@email.com
```

Request:

```json
{
  "email": "your@email.com"
}
```

If the emails do not match, the API will reject the request and no rooms will be created.

This prevents unauthorized users from populating or modifying the meeting room inventory.

---

Once the rooms have been added using either method, restart the application if necessary and Room IT will be ready for booking and managing meeting rooms.


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
