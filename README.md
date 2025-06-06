# SQL Assistant

A SQL query assistant that helps users write, optimize, and understand SQL queries through natural language interaction.

## Features

- Natural language to SQL query conversion
- SQL query optimization suggestions
- Query explanation and documentation
- Interactive query building interface
- Real-time query validation
- Query history and management

## Project Structure

``` sql-assistant/
├── client/           # Frontend application
├── server/           # Backend API and services
└── .github/          # GitHub workflows and configurations
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- SQLite3 (for development)

## Getting Started

1. Clone the repository:

   ``` bash

   git clone https://github.com/yourusername/sql-assistant.git
   cd sql-assistant
   ```

2. Install dependencies:

   ``` bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in server directories
   - Update the environment variables with your configuration

4. Start the development servers:

   ``` bash
   # Start the backend server
   cd server
   cp .env.example .env.local
   npm run dev

   # Start the frontend development server
   cd ../client
   echo "VITE_API_URL=http://localhost:5000/api" >> .env.development
   npm run dev
   ```

## Docker Deployment

To run the application using Docker:

```bash
docker-compose up --build
```

## Development

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: SQLite3
- Containerization: Docker

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
