# ☕ Coffeepio — Roasted in Ritual

A premium, fully dynamic coffee brand website built with a luxury dark aesthetic, cinematic video background, Firebase backend, and a complete Admin Dashboard for content management.

---

## 🌐 Live Preview

> **🔗 [Click here to view the live website](https://my-coffee-shop-oxvid.web.app)**

---

## 📸 Website Overview

**Coffeepio** is a high-end coffee brand website featuring:

- 🎬 **Cinematic fullscreen video background**
- ☕ **Dynamic product menu** (fetched from Firebase Firestore)
- 🛒 **WhatsApp ordering system** — customers can order directly
- 📝 **Editable website content** via Admin Dashboard
- 🔒 **Secure Admin Panel** with Firebase Authentication
- 📱 **Fully Responsive** — works on mobile, tablet & desktop

---

## 🗂️ Project Structure

```
Coffee-Pio-Sample-Website/
│
├── public/                  # Main website files (hosted on Firebase)
│   ├── index.html           # Main website (homepage)
│   ├── admin.html           # Admin dashboard
│   ├── admin.css            # Admin panel styles
│   └── admin.js             # Admin panel logic (Firebase CRUD)
│
├── firebase.json            # Firebase Hosting configuration
├── .firebaserc              # Firebase project config
└── README.md                # Project documentation
```

---

## ✨ Features

### 🖥️ Customer-Facing Website
| Feature | Details |
|---|---|
| 🎥 Video Background | Fullscreen cinematic coffee video |
| 🍵 Product Menu | Dynamically loaded from Firestore database |
| 💬 WhatsApp Order | One-click ordering via WhatsApp |
| 🌙 Dark Luxury Theme | Premium obsidian & gold color palette |
| ✍️ Google Fonts | Cormorant Garamond + Inter typography |
| 📱 Responsive | Mobile-first, works on all screen sizes |

### 🔧 Admin Dashboard
| Feature | Details |
|---|---|
| 🔐 Secure Login | Firebase Authentication |
| ➕ Add Products | Add new coffee items with image, price, badge |
| ✏️ Edit Products | Update existing menu items in real-time |
| 🗑️ Delete Products | Remove items from menu instantly |
| 📝 Edit Website Text | Update hero text, about section, etc. |
| 🌱 Seed Database | One-click default data loader |

---

## 🔥 Tech Stack

| Technology | Usage |
|---|---|
| **HTML / CSS / JavaScript** | Frontend |
| **Firebase Firestore** | Database (products & content) |
| **Firebase Authentication** | Admin login security |
| **Firebase Hosting** | Website deployment & CDN |
| **Google Fonts** | Typography |

---

## 🚀 How to Access

### 👤 Customer (Public Website)
Simply visit the live link:
> **[https://my-coffee-shop-oxvid.web.app](https://my-coffee-shop-oxvid.web.app)**

### 🔧 Admin Panel
Go to the admin page and login with your credentials:
> **[https://my-coffee-shop-oxvid.web.app/admin.html](https://my-coffee-shop-oxvid.web.app/admin.html)**

---

## 📦 Local Development

To run this project locally:

```bash
# 1. Install Firebase CLI (if not installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Serve locally
firebase serve
```

Then open: **http://localhost:5000**

---

## 👨‍💻 Developed By

**Oxvid Systems**
- 📧 oxvidsystems@gmail.com
- 🐙 [github.com/oxvidsystems](https://github.com/oxvidsystems)

---

> *"Small-batch coffee, roasted in ritual."* ☕
