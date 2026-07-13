# 🔌 API Specification

This document details the REST API endpoints and WebSocket channels for **Genesis AI**.

---

## Authentication

All endpoints require a Bearer token in the `Authorization` header, except for public authentication routes.

```http
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 🔐 Authentication

#### `POST /api/auth/register`
Creates a new developer account.
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123",
    "name": "Jane Doe"
  }
  ```
* **Response**: `201 Created`

#### `POST /api/auth/login`
Authenticates a user and issues a JSON Web Token.
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
* **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "expiresIn": 86400
  }
  ```

---

### 💬 Chat & AI Engine

#### `GET /api/chats`
Retrieve all past conversations for the authenticated user.
* **Response**: `200 OK`

#### `POST /api/chats`
Create a new conversation session.
* **Request Body**:
  ```json
  {
    "title": "Genesis AI Setup"
  }
  ```
* **Response**: `201 Created`

#### `POST /api/chats/:id/messages`
Send a message and get an AI response (Standard HTTP Stream or JSON).
* **Request Body**:
  ```json
  {
    "message": "Explain vector indexing in Postgres"
  }
  ```
* **Response**: `200 OK` (Stream format or Server-Sent Events)

---

## WebSockets / Realtime (Optional)
For sub-second response streaming, a WebSocket connection can be opened:

```
WS ws://localhost:8000/ws/chat
```
* **Event: `send_message`**: Sends a prompt to the backend.
* **Event: `receive_chunk`**: Emits token-by-token streaming chunks back to the client.
