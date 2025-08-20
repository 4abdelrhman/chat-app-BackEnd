# Chat App Backend
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/4abdelrhman/chat-app-BackEnd.git)

This repository contains the backend service for a real-time chat application. It is built with Node.js, Express, MongoDB, and Socket.IO, providing a robust foundation for user authentication, messaging, and real-time communication.

## Features

-   **User Authentication**: Secure sign-up, login, and logout functionality using JWT (JSON Web Tokens) stored in HTTP-only cookies.
-   **Real-time Messaging**: Instant message delivery and online user status updates using Socket.IO.
-   **Text & Image Support**: Send both text messages and images within chats.
-   **Cloud Media Storage**: Image uploads are handled efficiently and stored using Cloudinary.
-   **User Management**: Fetch users for conversation sidebars and update user profile pictures.
-   **Protected Routes**: Middleware ensures that sensitive endpoints require valid user authentication.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Real-time Engine**: Socket.IO
-   **Authentication**: `jsonwebtoken`, `bcryptjs`
-   **Image Handling**: Cloudinary
-   **Environment Variables**: `dotenv`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later recommended)
-   [npm](https://www.npmjs.com/)
-   A MongoDB database instance (e.g., MongoDB Atlas)
-   A Cloudinary account for API keys

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/4abdelrhman/chat-app-backend.git
    cd chat-app-backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and populate it with your credentials.

    ```env
    PORT=8000
    MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET_KEY>
    NODE_ENV=development

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
    CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
    CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
    ```

4.  **Run the development server:**
    The server will start on the `PORT` specified in your `.env` file, and you will see a confirmation message in the console.
    ```sh
    npm run dev
    ```

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication Routes (`/auth`)

| Method | Endpoint          | Description                        | Body (JSON)                                |
| :----- | :---------------- | :--------------------------------- | :----------------------------------------- |
| `POST` | `/signup`         | Registers a new user.              | `{ "fullName", "email", "password" }`      |
| `POST` | `/login`          | Logs in an existing user.          | `{ "email", "password" }`                  |
| `POST` | `/logout`         | Clears the auth cookie.            | _(none)_                                   |
| `PUT`  | `/update-profile` | Updates the user's profile picture.| `{ "profilePic": "base64-image-string" }`  |

_**Note:** `/update-profile` is a protected route and requires authentication._

### Message Routes (`/message`)

All message routes are protected and require a valid JWT cookie from a logged-in session.

| Method | Endpoint     | Description                                     | Body (JSON) / Params                            |
| :----- | :----------- | :---------------------------------------------- | :---------------------------------------------- |
| `GET`  | `/users`     | Gets a list of all other users for the sidebar. | _(none)_                                        |
| `GET`  | `/:id`       | Retrieves message history with a specific user. | `id`: The other user's ID in the URL.           |
| `POST` | `/send/:id`  | Sends a message to a user with the given ID.    | `{ "text", "image": "base64-string" }`          |

## Socket.IO Events

The application uses Socket.IO for real-time communication between clients.

-   **Connection**: A client connects by providing their `userId` as a query parameter when initializing the socket.
    ```javascript
    // Example client-side connection
    const socket = io("http://localhost:8000", {
        query: {
            userId: loggedInUserId,
        }
    });
    ```
-   **`getOnlineUsers`**: The server emits this event to all clients whenever a user connects or disconnects. The payload is an array of online user IDs.
    ```javascript
    // Listen for online users update
    socket.on("getOnlineUsers", (onlineUserIds) => {
        console.log("Online users:", onlineUserIds);
    });
    ```
-   **`disconnect`**: The server listens for this event automatically when a client disconnects.
