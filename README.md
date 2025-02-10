# CRM Contact Management API

## Overview
This is a simple Contact Management API built with Node.js, Express, and TypeORM using PostgreSQL as the database. The API allows users to manage contacts, track balance transfers, and maintain an audit history.

## Prerequisites
- Docker & Docker Compose
- Node.js (if running without Docker)

## Running the Application with Docker
1. Clone the repository:
   ```sh
   git clone https://github.com/mahmoudelassy/CRM-Contact-Management-API
   cd CRM-Contact-Management-API-master
   ```
2. Build and run the application:
   ```sh
   docker-compose up --build
   ```
   This will start both the PostgreSQL database and the Node.js API.

## Running Tests
To run the tests, execute:
```sh
npm run test
```

## API Documentation
### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Create a Contact
- **URL:** `/contacts`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "company": "Tech Inc.",
    "balance": 100.50
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Contact created successfully",
    "data": { "id": "uuid", ... }
  }
  ```

#### 2. Get All Contacts
- **URL:** `/contacts`
- **Method:** `GET`
- **Query Parameters (Optional):**
  - `company` (string)
  - `is_deleted` (true/false)
  - `created_after` (ISO8601 date)
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Contacts fetched successfully",
    "data": [ { "id": "uuid", ... } ]
  }
  ```

#### 3. Get Contact by ID
- **URL:** `/contacts/:id`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Contact fetched successfully",
    "data": { "id": "uuid", ... }
  }
  ```

#### 4. Update Contact (Partial)
- **URL:** `/contacts/:id`
- **Method:** `PATCH`
- **Request Body (any fields to update):**
  ```json
  {
    "email": "new.email@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Contact updated successfully",
    "data": { "id": "uuid", ... }
  }
  ```

#### 5. Delete Contact
- **URL:** `/contacts/:id`
- **Method:** `DELETE`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Contact deleted successfully"
  }
  ```

#### 6. Transfer Balance
- **URL:** `/contacts/transfer`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "from_contact_id": "uuid",
    "to_contact_id": "uuid",
    "amount": 50.00
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Balance transferred successfully",
    "data": {
      from_contact: { "id": "uuid", ... },
      to_contact: { "id": "uuid", ... }
    }
  }
  ```

#### 7. Get Contact Audit History
- **URL:** `/contacts/:id/audit`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Audit history fetched successfully",
    "data": [ { "updated_snapshot": { ... } } ]
  }
  ```

## Stopping the Application
To stop the running containers, use:
```sh
docker-compose down
```


