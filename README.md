# 📦 Dropbox File Monitoring & Processing System

This is a full-stack application built with **Node.js**, **MongoDB**, and **Next.js** that monitors a specific folder in **Dropbox**. When a new `.csv` file is added, it:

- Automatically downloads the file
- Parses and stores the data into MongoDB
- Displays processed files in a frontend table with real-time search, pagination, and sorting

---

## 🚀 Features

- 📁 Monitors Dropbox folder using Dropbox Webhook
- 📥 Downloads new `.csv` files automatically
- 🧠 Parses and saves metadata + content to MongoDB
- 🔍 Frontend table view with:
  - Real-time search
  - Pagination
  - Sorting
  - File detail view
- 🌐 REST API to fetch files & their details

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** Next.js (App Router + Tailwind CSS)
- **Cloud Storage:** Dropbox API
- **File Handling:** `fs`, `csv-parser`
- **Optional Deployment:** Vercel (frontend), Render/AWS (backend)

---

## 🧾 Setup Instructions

### 📦 1. Clone the repository

```bash
git clone https://github.com/Eveonix-Pvt-Ltd/Dropbox-Integration-Zaeem.git
cd Dropbox-Integration-Zaeem
