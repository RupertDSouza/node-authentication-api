# Authentication API

This project is focused on implementing authentication APIs using Node.js, Express, and Passport.js for user registration, login, token management, and profile retrieval.

## Installation

To install the required dependencies, use npm:

```bash
npm install
```

## Configuration

Set the following environment variables in a `.env` file:

```plaintext
ACCESS_TOKEN_SECRET="access_token_secret_here"
REFRESH_TOKEN_SECRET="refresh_token_secret_here"
```

## Implemented APIs

- **Register API**: Handles user registration and stores user details in the database.
- **Login API**: Authenticates users with their email and password, generates access and refresh tokens, and saves the tokens in the database.
- **Logout API**: Deletes the token from the database, effectively logging the user out.
- **Refresh API**: Regenerates the access token using the refresh token.
- **Get Profile API**: Retrieves the user's profile, authenticated using the access token generated from the login API.

## Dependencies

- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- dotenv: ^16.4.5
- express: ^4.19.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.3.4
- morgan: ^1.10.0
- passport: ^0.7.0
- passport-http-bearer: ^1.0.1

## Development Dependencies

- nodemon: ^3.1.0

## Usage

To start the server using nodemon, run:

```bash
npm start
```

This will start the server and automatically restart it when changes are made to the source files.

Feel free to adjust the APIs and configurations as needed for your project.
