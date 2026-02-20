# 📄 ResumeCanvas

> A full-stack MERN resume builder with a visual drag-and-drop canvas editor, real-time preview, and one-click PDF export.

[![Live Demo](https://img.shields.io/badge/Live_Demo-resume--canvas--zeta.vercel.app-6366f1?style=flat-square&logo=vercel&logoColor=white)](https://resume-canvas-zeta.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/NainaKothari-14/resume-canvas?style=flat-square&logo=github&color=f59e0b)](https://github.com/NainaKothari-14/resume-canvas/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/NainaKothari-14/resume-canvas?style=flat-square&color=ef4444)](https://github.com/NainaKothari-14/resume-canvas/issues)

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB_5+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#-quick-start)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Author](#author)

---

## Overview

**ResumeCanvas** is a drag-and-drop resume editor built on the MERN stack. It combines a freeform visual canvas with structured sidebar forms, so you get full layout control without sacrificing professional formatting. Fill in your details, arrange blocks exactly how you want them, and export a link-preserving PDF in one click.

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas

# Backend
cd resume-canvas-server && npm install && npm run dev
# → running on http://localhost:5000

# Frontend (open a new terminal)
cd resume-canvas-client && npm install && npm run dev
# → running on http://localhost:5173
```

> Make sure MongoDB is running locally and create a `.env` in `resume-canvas-server/` — see [Getting Started](#getting-started) for the full setup.

---

## Screenshots

### Dashboard — Resume Library
<img src="screenshots/Dashboard.png" width="70%" alt="Dashboard" />

*Manage all your resumes in one place with search, sort, and quick actions*

### Resume Editor
<img src="screenshots/Editor.png" width="70%" alt="Editor" />

*Visual canvas editor with sidebar forms for structured data entry*

### Form Editing
<img src="screenshots/FormEditing.png" width="70%" alt="Form Editing" />

*Organized sidebar forms for all resume sections with collapsible panels*

### Canvas Editing
<img src="screenshots/CanvasEditing.png" width="70%" alt="Canvas Editing" />

*Drag, resize, and position elements with precision on the visual canvas*

### PDF Export
<img src="screenshots/ExportPDF.png" width="70%" alt="PDF Export" />

*High-quality PDF export with clickable links and professional formatting*

---

## Features

### 🎨 Visual Canvas Editor
- Freely drag, resize, and reposition text blocks, headings, and sections
- Multi-page support for longer resumes
- Zoom & pan for navigating large documents
- Optional grid with alignment guides
- Double-click to edit text directly on the canvas

### 📝 Structured Form Editing
- Organized sidebar forms for every resume section
- Live preview — see changes reflected on the canvas instantly
- Auto-save so you never lose work
- Generate a full resume layout from form data in one click
- 50-step undo/redo history

### 💼 Resume Sections
| Section | Details |
|---|---|
| Basic Info | Name, headline, phone, email, location, GitHub, LinkedIn, Portfolio |
| Summary | Professional summary / objective |
| Experience | Multiple entries with company, role, dates & description |
| Skills | Categorized skill groups (e.g. "Backend: Node, Express") |
| Education | Degree, institution, dates, GPA |
| Projects | Name, tech stack, description, clickable link |
| Achievements | Awards, certifications, milestones |

### 📊 Resume Dashboard
- Grid and list view for your resume library
- Search by title or candidate name
- Sort by last updated, date created, or alphabetically
- One-click edit, duplicate, or delete
- Glassmorphism UI with smooth animations

### 📤 PDF Export
- High-quality PDF with **clickable hyperlinks preserved**
- Custom resume titles for easy organization
- One-click download at any time

### 🎭 Styling & Customization
- Font size, weight, color, and alignment controls
- Bold, italic, underline, and letter-spacing support
- Visual section dividers
- Editable bullet point lists

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Frontend (React 18)                    │
│                                                            │
│   Dashboard          Editor              Properties Panel  │
│   (Resume Library)   (Canvas + Sidebar)  (Block Controls)  │
│                                                            │
│                  Zustand State Management                  │
└───────────────────────────┬────────────────────────────────┘
                            │ REST API (HTTP/JSON)
┌───────────────────────────┼────────────────────────────────┐
│            Backend (Node.js + Express)                     │
│                                                            │
│   Routes ──► Controllers (Business Logic) ──► Models      │
│   /api/resumes             Validation           Mongoose   │
│   /api/auth                Transformation       Schemas    │
└───────────────────────────┬────────────────────────────────┘
                            │
                       ┌────┴────┐
                       │ MongoDB │
                       └─────────┘
```

**Request lifecycle:**
1. User interacts with the React UI (Dashboard or Editor)
2. Zustand store updates local state
3. API call is dispatched to Express backend
4. Routes forward request to the appropriate Controller
5. Controller executes business logic (validation, transformation, rules)
6. Mongoose Model handles the database operation
7. Response travels back to the frontend and the UI re-renders

**Design patterns used:** MVC architecture · RESTful API · Zustand state management · Reusable component architecture · Mongoose schema validation · Global error boundaries

---

## Tech Stack

**Frontend**

| Package | Purpose |
|---|---|
| React 18 | UI library with Hooks |
| Vite 5 | Dev server and build tooling |
| Zustand | Lightweight global state management |
| React Router | Client-side routing |
| Tailwind CSS | Utility-first styling |
| react-rnd | Drag and resize canvas elements |
| react-to-print | Triggers browser print dialog for PDF export (Save as PDF) |
| Lucide React | Icon library |

**Backend**

| Package | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | Web application framework |
| MongoDB + Mongoose | Database and ODM |
| Helmet | Security headers middleware |
| CORS | Cross-origin request handling |
| Express Rate Limit | API rate limiting |
| dotenv | Environment variable management |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (Node 20 LTS recommended) and **npm** 9+
- **MongoDB** 5+ (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A modern browser (Chrome, Firefox, Safari, Edge)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas
```

**2. Set up the backend**

```bash
cd resume-canvas-server
npm install
```

Create a `.env` file in `resume-canvas-server/`:

```env
MONGODB_URI=mongodb://localhost:27017/resume-canvas
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRE=7d
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

Start MongoDB if running locally:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

Then start the backend server:

```bash
npm run dev
# Running on http://localhost:5000
```

**3. Set up the frontend**

Open a new terminal:

```bash
cd resume-canvas-client
npm install
```

Optionally create a `.env` file in `resume-canvas-client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
# Running on http://localhost:5173
```

**4. Verify the setup**

1. Open `http://localhost:5173` in your browser
2. Click **Create New Resume**
3. Fill in some details in the sidebar — they should appear on the canvas live
4. Click **Save**, then navigate back to the Dashboard
5. Click **Export PDF** to download your resume

---

## Usage Guide

### Creating a Resume

1. Click **Create New Resume** on the Dashboard
2. Use the **left sidebar** to fill in each section — Basic Info, Summary, Experience, Skills, Education, Projects, and Achievements
3. Watch the **canvas update in real time** as you type
4. Drag and resize blocks on the canvas to fine-tune the layout
5. Double-click any text block to edit it directly on the canvas
6. Click the **pencil icon** next to the title to rename your resume
7. Hit **Save** or use `Ctrl/Cmd + S`
8. Click **Export PDF** for a one-click download

### Managing Resumes

From the Dashboard you can search resumes by title or name, sort by date or alphabetically, switch between grid and list view, and use quick action buttons to edit, duplicate, or delete any resume.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + S` | Save resume |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Delete` | Delete selected block |
| `Double-click` | Edit text in place |
| `Esc` | Deselect block |

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/resumes` | Fetch all resumes |
| `GET` | `/resumes/:id` | Fetch a single resume by ID |
| `POST` | `/resumes` | Create a new resume |
| `PUT` | `/resumes/:id` | Update an existing resume |
| `DELETE` | `/resumes/:id` | Delete a resume |
| `POST` | `/resumes/:id/duplicate` | Duplicate a resume |

#### GET /resumes

Optional query parameters: `sort` (`createdAt` \| `updatedAt` \| `title`) and `order` (`asc` \| `desc`).

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "648f...",
      "title": "Software Engineer Resume",
      "resumeData": { "fullName": "Jane Smith", "headline": "Full Stack Developer" },
      "blocks": [],
      "pages": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ]
}
```

#### POST /resumes — Request Body

```json
{
  "title": "My Resume",
  "resumeData": {
    "fullName": "Jane Smith",
    "headline": "Backend Developer",
    "email": "jane@email.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "summary": "Experienced developer with...",
    "github": "github.com/jane",
    "linkedin": "linkedin.com/in/jane",
    "portfolio": "janesmith.dev"
  },
  "sections": {
    "experience": [],
    "skills": [],
    "education": [],
    "projects": [],
    "achievements": []
  },
  "blocks": [],
  "pages": []
}
```

#### Error Responses

```json
{ "success": false, "error": "Validation failed: title is required" }  // 400
{ "success": false, "error": "Resume not found" }                       // 404
{ "success": false, "error": "Internal server error" }                  // 500
```

---

## Configuration

### Backend — `resume-canvas-server/.env`

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-canvas
# For Atlas: mongodb+srv://user:password@cluster.mongodb.net/resume-canvas

# Server
PORT=5000
NODE_ENV=development

# CORS — must match your frontend origin exactly
CLIENT_URL=http://localhost:5173

# Auth (required even if auth is not yet fully implemented)
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend — `resume-canvas-client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

### Backend

<details>
<summary>Heroku</summary>

```bash
cd resume-canvas-server
heroku create your-app-api
heroku config:set MONGODB_URI=your-mongo-uri NODE_ENV=production
git push heroku main
```

</details>

<details>
<summary>Railway</summary>

```bash
npm i -g @railway/cli
railway login && railway init && railway up
```

</details>

<details>
<summary>DigitalOcean / AWS EC2</summary>

```bash
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas/resume-canvas-server && npm install --production

npm install -g pm2
pm2 start npm --name "resume-api" -- start
pm2 startup && pm2 save
```

Then configure Nginx as a reverse proxy pointing to `localhost:5000`.

</details>

### Frontend

<details>
<summary>Vercel</summary>

```bash
cd resume-canvas-client
npm i -g vercel && vercel --prod
```

</details>

<details>
<summary>Netlify</summary>

```bash
npm run build
npm i -g netlify-cli && netlify deploy --prod --dir=dist
```

</details>

After deploying the backend, update `VITE_API_URL` in your frontend environment to the production API URL.

### Production Checklist

- [ ] `NODE_ENV=production`
- [ ] MongoDB Atlas (or managed DB) configured
- [ ] Strong `JWT_SECRET` set
- [ ] CORS restricted to production domain
- [ ] HTTPS / SSL enabled
- [ ] Rate limiting configured
- [ ] Error logging set up (e.g., Sentry)
- [ ] Database backups scheduled
- [ ] Authentication implemented
- [ ] Uptime monitoring active

---

## Security

**Already implemented:**

- `helmet` — sets secure HTTP headers (XSS protection, MIME sniffing prevention, etc.)
- CORS restricted to `CLIENT_URL` origin
- API rate limiting via `express-rate-limit`
- Mongoose schema-level input validation
- Error messages sanitized (no stack traces in production)

**PDF export note:** PDF generation uses `react-to-print` to trigger the browser's native print dialog (Save as PDF). Clickable links are preserved because the browser renders the live DOM into the PDF — no server-side generation involved.

**Recommended additions:**

- JWT-based authentication (`JWT_SECRET` env var is already scaffolded)
- Input sanitization — the canvas editor uses `contentEditable`, which stores plain text. If you ever persist HTML, add [DOMPurify](https://github.com/cure53/DOMPurify) before saving to the database
- CSRF protection
- Regular dependency audits: `npm audit fix`
- HTTPS enforced in production

---

## Roadmap

**v1.1 — Near Term**
- [ ] User authentication and accounts
- [ ] Resume templates (Professional, Minimalist, Creative)
- [ ] Color theme and font family customization
- [ ] Drag-and-drop section reordering
- [ ] Export to Word (`.docx`)
- [ ] Public shareable resume links
- [ ] Resume view / download analytics

**v1.5 — Mid Term**
- [ ] AI-powered content suggestions
- [ ] ATS compatibility checker
- [ ] Grammar and spell check
- [ ] Cover letter generator
- [ ] Multiple versions per job application
- [ ] Mobile-responsive editor

**v2.0 — Long Term**
- [ ] LinkedIn profile import
- [ ] Job application tracker
- [ ] Browser extension
- [ ] iOS and Android apps
- [ ] Portfolio integration
- [ ] Premium template marketplace

---

## Contributing

Contributions of all kinds are welcome — bug fixes, new features, documentation improvements, or design feedback.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes using the convention below
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open a Pull Request** with a clear description of what you changed and why

**Commit message convention:**

```
Add: New feature or capability
Fix: Bug fix
Update: Improvement to existing feature
Remove: Delete deprecated code
Docs: Documentation changes only
Refactor: Code restructuring, no logic change
Style: Formatting only, no logic change
Test: Add or update tests
```

**Code style:**
- Frontend — functional components with Hooks, props destructuring, meaningful names, comments on complex logic
- Backend — `async/await` over callbacks, proper error handling, RESTful route naming, input validation on every endpoint

---

## Troubleshooting

<details>
<summary><strong>MongoDB connection refused</strong> — <code>connect ECONNREFUSED 127.0.0.1:27017</code></summary>

MongoDB is not running. Start it:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

</details>

<details>
<summary><strong>CORS error</strong> in the browser console</summary>

Verify your backend `.env` has the correct frontend origin — the key is `CLIENT_URL`, not `CORS_ORIGIN`:

```env
CLIENT_URL=http://localhost:5173
```

Then restart the backend server.

</details>

<details>
<summary><strong>Frontend can't reach backend</strong> — <code>Failed to fetch</code></summary>

1. Confirm the backend is running on port 5000
2. Check `VITE_API_URL` in `resume-canvas-client/.env`
3. Ensure no firewall is blocking local requests

</details>

<details>
<summary><strong>PDF export not working</strong> — <code>There is nothing to print</code></summary>

Reinstall `react-to-print`:

```bash
npm install react-to-print
```

</details>

<details>
<summary><strong>Router error</strong> — <code>You cannot render a Router inside another Router</code></summary>

Remove the duplicate `<BrowserRouter>` from `main.jsx`. It should only appear once, in `App.jsx`.

</details>

<details>
<summary><strong>Port 5000 already in use</strong></summary>

```bash
# macOS / Linux — find and kill the process
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change the port in your `.env`: `PORT=5001`

</details>

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

## Author

**Naina Kothari**

[![GitHub](https://img.shields.io/badge/GitHub-NainaKothari--14-181717?style=flat-square&logo=github)](https://github.com/NainaKothari-14)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-naina--kothari-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/naina-kothari)

---

<div align="center">

If ResumeCanvas helped you, a ⭐ on GitHub means a lot!

[![Star on GitHub](https://img.shields.io/badge/⭐_Star_this_repo-GitHub-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NainaKothari-14/resume-canvas)

**Built with care for developers, designers, and job seekers everywhere.**

</div>
