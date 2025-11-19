# 📚 BookVerseDB — MongoDB + Mongoose Project

A simple Node.js + Mongoose project for managing a digital book collection.  
This project demonstrates **MongoDB Data Modeling**, **CRUD operations**, and environment-based configuration using `.env`.

---

## 🚀 Project Overview

BookVerseDB is part of a MERN stack learning series.  
It uses **MongoDB** for data storage and **Mongoose** as the ODM to define schemas and interact with collections.

The database contains:
- **Authors** — stores author details (name, nationality, birth year)
- **Books** — stores book metadata, genres, publication years, and author references
- **Users** — stores user details such as name, email, and join date

---

## 🧩 Features

- MongoDB connection via Mongoose
- Schema-based data modeling
- CRUD operations with embedded and referenced data
- Environment variable configuration using `.env`
- MongoDB Compass / Mongo shell compatible structure

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js** | Runtime environment |
| **Mongoose** | ODM library for MongoDB |
| **MongoDB Compass** | GUI for visualizing data |
| **dotenv** | Loads environment variables from `.env` |

---

## 📦 Installation Steps

1. **Clone this repository**
   ```bash
   git clone <src>
   cd BookVerseDB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/BookVerseDB
   PORT=3000
   NODE_ENV=development
   ```

4. **Run the script**
   ```bash
   node bookverse_mongoose.js
   ```

---

## 📁 Folder Structure

```
BookVerseDB/
│
├── .env
├── .gitignore
├── package.json
├── bookverse_mongoose.js
├── README.md
└── node_modules/
```

---

## 🧠 Example Mongoose Schema

```js
const authorSchema = new mongoose.Schema({
  name: String,
  nationality: String,
  birthYear: Number
}, { collection: 'Authors' });
```

This ensures your model writes to the exact existing `Authors` collection.

---

## 🧾 Example Insert Script

```js
Author.insertMany([
  { _id: 2, name: "Chetan Bhagat", nationality: "Indian", birthYear: 1974 },
  { _id: 3, name: "R.K. Narayan", nationality: "Indian", birthYear: 1906 }
])
.then(() => console.log("New authors inserted successfully!"))
.catch(console.error);
```

---

## 🔍 Viewing Data in MongoDB Compass

1. Open **MongoDB Compass**  
2. Connect to:  
   ```
   mongodb://127.0.0.1:27017
   ```
3. Expand **BookVerseDB**
4. Click the **Authors** collection to view all inserted data.

---

## 🧰 Useful Commands

| Task | Command |
|------|----------|
| Start MongoDB service | `mongod` |
| Connect to DB | `mongodb://127.0.0.1:27017/BookVerseDB` |
| Insert document | `db.Authors.insertOne({...})` |
| View data | `db.Authors.find().pretty()` |
| Run script | `node bookverse_mongoose.js` |

---

## 🧾 .gitignore Example

```gitignore
node_modules/
.env
logs/
.DS_Store
dist/
build/
```

---

## 🧩 Author

**Developed by:** Piyush Kumar  
**Purpose:** MERN Stack Practice — MongoDB & Mongoose (Day 7 Assignment)  
**Date:** November 2025  

---

## 🏁 License

This project is created for educational use under the MIT License.
