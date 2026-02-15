Saylani Campus Portal

A modern, production-ready campus management portal built with React and Firebase.
Designed for real-world deployment with real-time data handling, smooth animations, and a strong visual identity aligned with Saylani branding.

Built during a hackathon by Urooj and Syeda Nimra.

Overview

Saylani Campus Portal is a centralized system that allows students and administrators to manage campus activities efficiently. The application focuses on clarity, performance, and real-time interaction while maintaining a clean and modern UI.

It combines structured architecture with thoughtful design to deliver both technical depth and visual impact.

What This Project Delivers

Secure user authentication

Real-time Firestore database integration

Image upload support via Firebase Storage

Role-based admin dashboard

Live notifications

Theme switching with persistent state

Smooth animation experience across pages

Fully responsive layout

This is not just a prototype. It is structured for immediate deployment.

Core Modules
Lost & Found

Students can post lost or found items with image support and track their status.

Complaints Management

Users can submit campus-related complaints and monitor updates in real time.

Volunteer Registration

Students can register for events and manage availability.

Admin Dashboard

Admins can monitor submissions, update statuses, and manage users.

Smart Dashboard

Unified data view with activity tracking and visual statistics.

Tech Architecture

Frontend

React 18 + Vite

React Router v6

Lucide React icons

React Hot Toast notifications

Styling

Tailwind CSS

Custom global stylesheet

Structured design system with soft depth and layered UI

Backend

Firebase Authentication

Cloud Firestore

Firebase Storage

Animations

Framer Motion

Custom motion patterns inspired by GSAP-style transitions

Design Philosophy

The interface avoids generic dashboard patterns and instead focuses on:

Layered depth with soft shadows

Animated gradient mesh backgrounds

Curved SVG motion lines

Clean typography pairing

Strong visual hierarchy

Saylani brand color system

The result is a portal that feels intentional, polished, and modern.

Project Structure
saylani-campus-portal/
│
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   ├── firebase.js
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── SETUP_GUIDE.md
└── FOLDER_STRUCTURE.md


The structure is intentionally minimal to keep scalability simple and maintenance easy.

Why This Project Stands Out

Clean architectural decisions

Real-time state management

Focused feature modules

Animation used with purpose, not decoration

Structured for performance

Production deployment ready

Getting Started

Clone the repository:

git clone <your-repo-link>
cd saylani-campus-portal


Install dependencies:

npm install


Start development server:

npm run dev


Configure your Firebase credentials inside firebase.js before running.

Future Enhancements

Advanced analytics

Role-based permission expansion

Push notifications

Performance monitoring integration

Authors

Urooj
Syeda Nimra
