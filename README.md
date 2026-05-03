# Quotes App

A simple web application for learning SQLite where users can add and view inspirational quotes. Built with Express.js and SQLite3.

## Description

This project demonstrates a full-stack web application that allows users to:

- View all stored quotes
- Add new quotes with optional author attribution
- Store and retrieve data from a SQLite database

Perfect for learning the fundamentals of backend development, REST APIs, and database management.

## Features

- 📝 Add new quotes with author information
- 📚 View all quotes sorted by creation date
- 🗄️ Persistent SQLite database storage
- 🎨 Clean and simple user interface
- ⚡ Fast and lightweight server

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML, CSS, JavaScript
- **Package Manager**: npm

## Project Structure

```
├── db.js                 # Database connection and initialization
├── server.js             # Express server setup
├── package.json          # Project dependencies and metadata
├── controllers/
│   └── controller.js     # Route handlers and business logic
├── router/
│   └── router.js         # Route definitions
└── public/
    ├── index.html        # Frontend HTML
    ├── index.js          # Frontend JavaScript logic
    └── style.css         # Styling
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd "Quotes to learn SQLite"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## Database Schema

The app uses a single `quotes` table with the following structure:

```sql
CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Columns:

- `id`: Unique identifier for each quote (auto-incremented)
- `text`: The quote text (required)
- `author`: Name of the quote author (defaults to "Anonymous")
- `created_at`: Timestamp when the quote was added

## API Endpoints

### Get All Quotes

- **Endpoint**: `GET /get-quotes`
- **Description**: Retrieves all quotes sorted by creation date (newest first)
- **Response**: JSON format

- **Endpoint**: `POST /add-quote`
- **Description**: Adds a new quote to the database

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. View existing quotes on the page
3. Enter a quote and optionally an author name
4. Click "Add Quote" to save it to the database
5. Your quote will appear in the list

## License

ISC

## Author

Created for learning SQLite and backend development fundamentals.
