# NoteNest – Full Stack Notes Application

NoteNest is a full-stack notes management application that allows users to create, view, edit, search, and delete notes through a clean and responsive dashboard.

The application is built using React, Node.js, Express.js, and MySQL.

## Features

- Create and save notes.
- View all saved notes.
- Edit existing notes.
- Delete unwanted notes.
- Search notes by title or content.
- View recently updated notes.
- Switch between grid and list layouts.
- Responsive dashboard interface.
- Persistent storage using MySQL.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Lucide React

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MySQL
- mysql2

## Project Structure

```text
notes-app/
├── client/
│   └── src/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   └── notes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   └── schema.sql
├── screenshots/
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Udaya-02/notes-app.git
cd notes-app
```

### 2. Set up the MySQL database

Open MySQL Workbench and execute the SQL commands in:

`database/schema.sql`

### 3. Configure the backend

Open the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder using `.env.example` as a template.

Configure your own MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notes_db
```

Do not upload your actual `.env` file to GitHub.

### 4. Start the backend

```bash
npm run dev
```

Backend URL:

`http://localhost:5000`

### 5. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Retrieve notes and search notes |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

## Database

The application uses a MySQL database named `notes_db` with a `notes` table.

Each note contains:
- `id`
- `title`
- `content`
- `created_at`
- `updated_at`

## Screenshots

Application screenshots will be available in the `screenshots/` folder.

## Learning Outcomes

This project demonstrates practical knowledge of:
- Full-stack web development.
- React component development.
- REST API creation and integration.
- Express.js backend development.
- MySQL database connectivity.
- CRUD operations.
- Frontend and backend integration.

## Future Improvements

- User authentication and authorization.
- Individual user accounts and private notes.
- Note categories and tags.
- Dark mode.
- Cloud deployment.

## Author

Developed as a full-stack development project.

