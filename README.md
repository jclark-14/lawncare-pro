# LawnCare Pro

**Full-stack lawn planning application built with React, TypeScript, Node.js, Express, PostgreSQL, and AWS.**

LawnCare Pro helps homeowners turn location and lawn characteristics into practical, personalized lawn-care plans. The application combines ZIP-code climate data, grass recommendations, persistent user plans, and step-by-step scheduling in a complete full-stack workflow.

## What It Demonstrates

- End-to-end full-stack application design
- REST API development with Node.js and Express
- Relational data modeling with PostgreSQL
- JWT-based authentication and protected user workflows
- Argon2 password hashing
- External API integration for ZIP-code climate data
- Dynamic plan generation and sequential task scheduling
- Responsive React + TypeScript frontend development
- Cloud deployment to AWS EC2

## Core Features

- **Personalized recommendations** based on ZIP-code climate data and lawn characteristics
- **Grass-species selection** tailored to local growing conditions
- **Step-by-step lawn plans** generated from reusable plan templates
- **Persistent user accounts and plans** stored in PostgreSQL
- **Progress tracking** for individual plan steps
- **Protected workflows** using JWT authentication
- **Responsive interface** built with React, TypeScript, and Tailwind CSS

## Architecture

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- REST APIs
- JWT authentication
- Argon2 password hashing

### Data
- PostgreSQL
- Relational plan, user, and step data
- Transactional creation of generated plans and scheduled plan steps

### External Services / Deployment
- Climate by ZIP API
- AWS EC2

## Application Flow

1. A user creates an account or signs in.
2. The application retrieves climate data for the user's ZIP code.
3. Lawn characteristics and climate information are used to recommend appropriate grass species.
4. The user selects a plan type.
5. The backend generates an individualized plan from reusable templates.
6. Plan steps are persisted and scheduled sequentially.
7. The user can return to the application and track progress over time.

## Preview

![LawnCare Pro Preview](assets/gif7.gif)

## Running Locally

### Requirements

- Node.js 18.18+
- npm 10+
- PostgreSQL 14+

### Setup

```bash
git clone https://github.com/jclark-14/lawncare-pro.git
cd lawncare-pro
npm install
```

Create a `.env` file in the server directory:

```env
TOKEN_SECRET=<your_jwt_secret>
DATABASE_URL=<your_database_url>
```

Create/import the PostgreSQL database and start the development environment:

```bash
createdb lawncarepro
npm run db:import
npm run dev
```

The development client is available at `http://localhost:5173`.

## Project Context

LawnCare Pro was built as an independent full-stack project to explore how domain knowledge, external data, user-specific inputs, and reusable application logic can be combined into a practical decision-support tool. The emphasis was on building the complete system—from interface and API design through persistence, authentication, plan-generation logic, and deployment—rather than a standalone frontend demo.
