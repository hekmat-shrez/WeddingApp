# Flask JWT MongoDB Authentication API

A RESTful API built with Flask that implements JWT authentication and MongoDB Atlas integration for user management.

## Features

- User registration and login
- JWT token-based authentication
- Protected routes requiring authentication
- MongoDB Atlas integration for data persistence

## Prerequisites

- Python 3.8+
- MongoDB Atlas account
- Git (for version control)

## Installation

1. Clone the repository:
   ```
   git clone <your-repository-url>
   cd flask-jwt-mongo
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Create a `.env` file in the project root
   - Add your MongoDB URI and JWT secret key:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
     JWT_SECRET_KEY=your-secret-key
     ```
   - **Make sure to replace the placeholder values with your actual credentials**

## Running the Application

```
python run.py
```
or
```
flask run
```

The API will be available at `http://127.0.0.1:5000`.

## API Endpoints

### Authentication

#### Register a new user
```
POST /auth/signup
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login
```
POST /auth/login
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "token": "your.jwt.token"
}
```

### Protected Routes

#### Access protected resource
```
GET /auth/protected
```
Headers:
```
Authorization: Bearer your.jwt.token
```

## Common Issues & Troubleshooting

- **MongoDB Connection Errors**: Ensure your MongoDB Atlas connection string is correct and your IP address is whitelisted in Atlas.
- **JWT Token Issues**: Check that your JWT_SECRET_KEY is correctly set in the .env file.
- **Authorization Errors**: Ensure you're passing the token correctly in the Authorization header with the "Bearer " prefix.

## Security Notes

- Never commit your `.env` file to version control
- In production, always use HTTPS
- Regularly rotate your JWT secret key

## License

[MIT License](LICENSE)