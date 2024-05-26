# Bookstore Backend With Node.js, Express.js, Typescript, Prisma ORM & PostgreSQL

## Features

- **User Authentication and Authorization:**
  - User registration with hashed passwords.
  - User login with JWT token issuance.
  - User logout with token invalidation.
  - Middleware to protect routes and ensure only authorized users can access certain endpoints.

- **Book Management:**
  - **Upload Books:** Allows sellers to upload book details via CSV files.
  - **Get Books:** Retrieve a list of all books.
  - **Get Book By ID:** Retrieve details of a specific book by its ID.
  - **Edit Book:** Allows sellers to edit book details.
  - **Delete Book:** Allows sellers to delete a book.

## Setup and Installation

### Prerequisites

- **Node.js** (version 14.x or later)
- **Typescript**
- **npm** (version 6.x or later)
- **PostgreSQL** database
- **Prisma** ORM
- **Multer** for handling file uploads

### Installation Steps

1. **Clone the Repository:**
2. **Install Dependencies:**

```bash/Terminal
npm install
```

3.**Configure ENV variables:**

```ENV file
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

4.**Setup DATABASE:**

```Terminal
npx prisma init
```

5.**Initialise Schema:**

```Terminal
npx prisma generate
```

6.**Run database Migrations**

```Terminal
npx prisma migrate dev --name init
```

7.**Start the Server**

```nodejs
npm run dev
```

This will start the backend server on <http://localhost:3000>.
