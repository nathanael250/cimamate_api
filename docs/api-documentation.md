# Climamate API Documentation

## Introduction

Welcome to the Climamate API - a powerful weather-aware planning service designed to help users organize their activities with real-time weather intelligence. This API provides a comprehensive suite of endpoints for user authentication, weather information retrieval, and schedule management with smart weather alerts.

Climamate combines weather forecasting with personal planning to create a seamless experience for users who want to stay one step ahead of changing weather conditions. The service automatically sends notifications about weather conditions shortly before scheduled events, allowing users to prepare appropriately or adjust their plans.

This API is built on a RESTful architecture using Node.js and Express, with MongoDB as the database backend. It leverages JWT (JSON Web Token) authentication to secure endpoints and ensure that user data remains private and protected.

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register a New User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "address": "123 Street, City",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "msg": "Registered successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "msg": "Email already exists"
}
```

### Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "1234567890",
    "address": "123 Street, City"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "msg": "Invalid email"
}
```
or
```json
{
  "msg": "Incorrect password"
}
```

## Weather Services

### Search Weather by City
**Endpoint:** `GET /weather/search?city={city_name}`

**Headers:**
- Authorization: Bearer {token}

**Response (200 OK):**
```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 15.2,
    "feels_like": 14.8,
    "temp_min": 13.9,
    "temp_max": 16.7,
    "pressure": 1024,
    "humidity": 77
  },
  "wind": {
    "speed": 3.6,
    "deg": 250
  },
  "name": "London"
}
```

**Response (500 Internal Server Error):**
```json
{
  "msg": "City not found"
}
```

## Plan Management

### Add a Plan
**Endpoint:** `POST /plan/add`

**Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "place": "London",
  "time": "14:30",
  "date": "2023-11-15"
}
```

**Response (200 OK):**
```json
{
  "msg": "Plan added"
}
```

### Get Today's Plans
**Endpoint:** `GET /plan/today`

**Headers:**
- Authorization: Bearer {token}

**Response (200 OK):**
```json
[
  {
    "_id": "plan_id",
    "userId": "user_id",
    "place": "London",
    "time": "14:30",
    "date": "2023-11-15"
  }
]
```

### Get All Plans
**Endpoint:** `GET /plan/all`

**Headers:**
- Authorization: Bearer {token}

**Response (200 OK):**
```json
[
  {
    "_id": "plan_id1",
    "userId": "user_id",
    "place": "London",
    "time": "14:30",
    "date": "2023-11-15"
  },
  {
    "_id": "plan_id2",
    "userId": "user_id",
    "place": "Paris",
    "time": "16:45",
    "date": "2023-11-16"
  }
]
```

### Update a Plan
**Endpoint:** `PUT /plan/update/:id`

**Headers:**
- Authorization: Bearer {token}

**URL Parameters:**
- id: The ID of the plan to update

**Request Body:**
```json
{
  "place": "Paris",
  "time": "16:45",
  "date": "2023-11-16"
}
```

**Response (200 OK):**
```json
{
  "msg": "Plan updated",
  "plan": {
    "_id": "plan_id",
    "userId": "user_id",
    "place": "Paris",
    "time": "16:45",
    "date": "2023-11-16"
  }
}
```

**Response (404 Not Found):**
```json
{
  "msg": "Plan not found"
}
```

**Response (403 Forbidden):**
```json
{
  "msg": "Not authorized to update this plan"
}
```

### Delete a Plan
**Endpoint:** `DELETE /plan/delete/:id`

**Headers:**
- Authorization: Bearer {token}

**URL Parameters:**
- id: The ID of the plan to delete

**Response (200 OK):**
```json
{
  "msg": "Plan deleted"
}
```

**Response (404 Not Found):**
```json
{
  "msg": "Plan not found"
}
```

**Response (403 Forbidden):**
```json
{
  "msg": "Not authorized to delete this plan"
}
```

## Scheduler Service

The API includes an automated scheduler that sends weather notifications 5 minutes before each planned event. The scheduler:

1. Checks for plans scheduled within the next 5 minutes
2. Fetches current weather conditions for the plan location
3. Generates a notification with weather information

Example notification:
```
🔔 Hey [User Name], weather at [Place] in 5 minutes is "[Weather Condition]" and [Temperature]°C
```

## Error Codes
- 200: Success
- 400: Bad Request (invalid input, duplicate email)
- 401: Unauthorized (invalid token)
- 403: Forbidden (missing token)
- 404: Not Found (resource doesn't exist)
- 500: Server Error

## Authentication Flow
1. Register a new user account
2. Login to receive a JWT token
3. Include the token in the Authorization header for all protected endpoints

## Data Models

### User
```json
{
  "_id": "MongoDB ObjectId",
  "name": "String",
  "email": "String (unique)",
  "phone": "String",
  "address": "String",
  "password": "String (hashed)"
}
```

### Plan
```json
{
  "_id": "MongoDB ObjectId",
  "userId": "MongoDB ObjectId (reference to User)",
  "place": "String",
  "time": "String (HH:MM format)",
  "date": "String (YYYY-MM-DD format)"
}
```

## Notes
- All dates should be in ISO format (YYYY-MM-DD)
- All times should be in 24-hour format (HH:MM)
- The JWT token expires after 1 day
- Weather data is sourced from OpenWeatherMap API
- The scheduler runs every minute to check for upcoming plans

## Rate Limiting
There are no specific rate limits implemented in the current version, but excessive requests may be throttled in future updates.

## Versioning
This documentation covers API v1.0.0.