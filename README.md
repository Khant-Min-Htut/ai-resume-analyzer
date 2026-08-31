# AI Resume Analyzer

A full-stack web application that analyzes resumes using AI to provide actionable feedback for job seekers.

## Tech Stack

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **OpenAI API** - AI analysis
- **pdf-parse** - PDF parsing
- **mammoth** - DOCX parsing

### Database
- **MongoDB** - Document database

## Project Structure

```
ai-resume-analyzer/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app directory
│   │   └── lib/      # Utilities and API client
│   └── package.json
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── schemas/  # Mongoose schemas
│   │   ├── services/ # Business logic
│   │   ├── resume/   # Resume module
│   │   └── main.ts   # Application entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-resume-analyzer
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key
# - PORT: Backend port (default: 3001)
# - FRONTEND_URL: Frontend URL for CORS (default: http://localhost:3000)
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp ENV_EXAMPLE .env.local

# Edit .env.local and add your backend URL:
# - NEXT_PUBLIC_API_URL: Backend API URL (default: http://localhost:3001)
```

### 4. Start MongoDB

Make sure MongoDB is running. If using local MongoDB:

```bash
# On Windows with MongoDB installed as service
# MongoDB should start automatically

# Or start MongoDB manually
mongod
```

### 5. Run the Application

**Start the backend:**

```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

**Start the frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST /resume/upload
Upload a resume file for analysis.

**Request:** `multipart/form-data`
- `file`: Resume file (PDF, DOCX, or TXT)
- `jobDescription` (optional): Job description text

**Response:** Resume object with analysis status

### GET /resume/:id
Get a specific resume by ID.

### GET /resume
Get all resumes.

## Architecture

### Frontend Architecture
- **App Router**: Next.js 13+ app directory structure
- **API Client**: Centralized API calls in `src/lib/api.ts`
- **Components**: Modular React components with TypeScript

### Backend Architecture
- **Modules**: Feature-based module organization
- **Services**: Business logic separation
- **Controllers**: HTTP request handling
- **Schemas**: Mongoose data models

### Data Flow

```
Frontend (Next.js)
    ↓ Upload File
Backend (NestJS)
    ↓ Parse File
File Parser Service
    ↓ Extract Text
AI Analysis Service
    ↓ OpenAI API
Analysis Results
    ↓ Store in MongoDB
MongoDB
```

## Security Notes

- **Never expose the OpenAI API key** to the frontend. It's stored only in backend environment variables.
- **CORS is configured** to allow requests only from the specified frontend URL.
- **File uploads are validated** for file type and size.
- **Environment variables** are used for all sensitive configuration.

## Development

### Backend Development

```bash
cd backend
npm run start:dev    # Start with hot-reload
npm run build        # Build for production
npm run start:prod   # Start production build
npm run test         # Run tests
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run linter
```

## Features

- **File Upload**: Support for PDF, DOCX, and TXT files
- **AI Analysis**: OpenAI-powered resume analysis
- **Job Description Matching**: Optional job description for tailored feedback
- **Real-time Status**: Track analysis progress
- **Detailed Feedback**: Strengths, weaknesses, and suggestions
- **Keyword Matching**: Identify missing and matched keywords
- **Scoring System**: Overall resume score (0-100)

## Future Enhancements

- User authentication and account management
- Resume history and comparison
- Multiple resume templates
- Export analysis reports as PDF
- Integration with job boards
- Real-time analysis progress updates via WebSocket
- Advanced analytics and insights

## License

UNLICENSED

## Support

For issues or questions, please open an issue in the repository.
