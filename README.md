# Student Course Management System API

A RESTful API built with **Node.js**, **Express**, and **TypeScript** for managing students, courses, and enrollments.

---

## 🚀 Features

- Full **CRUD** for Students, Courses, and Enrollments
- **Input Validation** with `express-validator`
- **Global Error Handling** middleware
- **Soft Delete** for Students and Courses
- **Search** students by name
- **Pagination** and **Sorting** on list endpoints
- **Swagger UI** documentation at `/api-docs`
- Proper HTTP status codes and structured error responses
- Security headers with `helmet`
- Request logging with `morgan`

---

## 📁 Project Structure

```
src/
├── config/
│   └── swagger.ts           # Swagger/OpenAPI configuration
├── controllers/
│   ├── student.controller.ts
│   ├── course.controller.ts
│   └── enrollment.controller.ts
├── interfaces/
│   ├── student.interface.ts
│   ├── course.interface.ts
│   └── enrollment.interface.ts
├── middlewares/
│   ├── errorHandler.ts      # Global error handler
│   ├── notFound.ts          # 404 handler
│   └── validate.ts          # Validation middleware
├── models/
│   ├── student.model.ts     # In-memory data store
│   ├── course.model.ts
│   └── enrollment.model.ts
├── routes/
│   ├── student.routes.ts
│   ├── course.routes.ts
│   └── enrollment.routes.ts
├── services/
│   ├── student.service.ts
│   ├── course.service.ts
│   └── enrollment.service.ts
├── utils/
│   └── AppError.ts          # Custom error class
├── app.ts                   # Express application setup
└── server.ts                # HTTP server entry point
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or later
- **npm** v8 or later

---

## 🛠️ Setup & Installation

### 1. Clone / Navigate to the project

```bash
cd "Bishwash"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development mode

```bash
npm run dev
```

The server will start at **http://localhost:3000**

### 4. Build for production

```bash
npm run build
npm start
```

---

## 📖 API Documentation

Once the server is running, open:

```
http://localhost:3000/api-docs
```

You will see the full **Swagger UI** with all endpoints, request schemas, and example responses.

---

## 🔗 API Endpoints

### Base URL: `http://localhost:3000/api`

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students` | Get all students (supports `?search`, `?page`, `?limit`, `?sortBy`, `?order`) |
| `GET` | `/students/:id` | Get student by ID |
| `POST` | `/students` | Create a new student |
| `PUT` | `/students/:id` | Update a student |
| `DELETE` | `/students/:id` | Soft-delete a student |
| `GET` | `/students/:id/courses` | Get all courses of a student |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/courses` | Get all courses (supports `?page`, `?limit`, `?sortBy`, `?order`) |
| `GET` | `/courses/:id` | Get course by ID |
| `POST` | `/courses` | Create a new course |
| `PUT` | `/courses/:id` | Update a course |
| `DELETE` | `/courses/:id` | Soft-delete a course |
| `GET` | `/courses/:id/students` | Get all students enrolled in a course |

### Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/enrollments` | Get all enrollments with student/course details |
| `POST` | `/enrollments` | Enroll a student in a course |
| `DELETE` | `/enrollments/:id` | Delete an enrollment |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api-docs` | Swagger documentation |

---

## 📋 Request & Response Examples

### Create a Student

**POST** `/api/students`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "age": 22
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "age": 22,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Enroll a Student in a Course

**POST** `/api/enrollments`

```json
{
  "studentId": 1,
  "courseId": 2
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "message": "Student enrolled successfully",
  "data": {
    "id": 1,
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "student": { "id": 1, "name": "John Doe" },
    "course": { "id": 2, "title": "Node.js Fundamentals" }
  }
}
```

### Get All Courses of a Student

**GET** `/api/students/1/courses`

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "student": "John Doe",
    "courses": ["Node.js Fundamentals", "React", "TypeScript"]
  }
}
```

### Search & Paginate Students

**GET** `/api/students?search=john&page=1&limit=5&sortBy=name&order=asc`

---

## ✅ Validation Rules

| Rule | Description |
|------|-------------|
| Email | Must be valid format and unique |
| Phone | Must be valid format and unique |
| Age | Must be greater than 15 (minimum 16) |
| Student Name | Required, 2–100 characters |
| Course Title | Required, 2–200 characters |
| Course Duration | Required |
| Enrollment | Student cannot enroll in same course twice |

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Validation errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "age", "message": "Age must be greater than 15" }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — Successful operation |
| `201` | Created — Resource created successfully |
| `400` | Bad Request — Validation failed |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Duplicate email/phone/enrollment |
| `500` | Internal Server Error |

---

## 🎁 Bonus Features Implemented

- ✅ **Search** students by name (`?search=john`)
- ✅ **Pagination** (`?page=1&limit=10`)
- ✅ **Sorting** (`?sortBy=name&order=asc`)
- ✅ **Global Error Handling Middleware**
- ✅ **Request Validation Middleware**
- ✅ **Soft Delete** (students and courses have `isDeleted` flag)
- ✅ **Swagger Documentation** at `/api-docs`

---

## 🧪 Testing with Postman

1. Import the provided Postman Collection (see `postman_collection.json`)
2. Set the base URL to `http://localhost:3000/api`
3. Run the requests in order: Create Students → Create Courses → Enroll → Query

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `express-validator` | Input validation |
| `swagger-jsdoc` | Swagger spec generation |
| `swagger-ui-express` | Swagger UI middleware |
| `cors` | Cross-Origin Resource Sharing |
| `helmet` | Security headers |
| `morgan` | HTTP request logging |
| `typescript` | TypeScript compiler |
| `ts-node-dev` | Dev server with hot reload |
