
# 📄 ResumeCanvas: Professional Resume Builder

> A full-stack MERN application for creating, editing, and exporting professional resumes with an intuitive drag-and-drop interface.

A modern, feature-rich resume builder with real-time editing, multi-page support, and beautiful PDF exports. Create professional resumes in minutes with a visual canvas editor and structured form inputs.

[![GitHub](https://img.shields.io/badge/⭐_Star-on%20GitHub-yellow?style=for-the-badge&logo=github)](https://github.com/NainaKothari-14/resume-canvas)

---

## 🛠️ Built With

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-000000?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 TL;DR Quick Start

```bash
# Clone the repository
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas

# Backend Setup
cd resume-canvas-server
npm install
npm run dev  # Runs on http://localhost:5000

# Frontend Setup (in new terminal)
cd resume-canvas-client
npm install
npm run dev  # Runs on http://localhost:5173
```

**Configure MongoDB:**
Create `.env` in `resume-canvas-server/`:
```env
MONGODB_URI=mongodb://localhost:27017/resume-canvas
PORT=5000
NODE_ENV=development
```

Open `http://localhost:5173` → Create your first resume → Download as PDF!

---

## 📑 Table of Contents
- [Why ResumeCanvas](#why-resumecanvas)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## 🎯 Why ResumeCanvas

ResumeCanvas reimagines resume creation with a professional visual editor that combines the flexibility of drag-and-drop design with the structure of form-based editing. Unlike traditional resume builders, ResumeCanvas gives you complete control over layout while maintaining professional formatting.

**Key Benefits:**
- **Visual Canvas Editor**: Drag, resize, and position elements exactly where you want them
- **Multi-Resume Management**: Create, save, edit, and organize multiple resumes
- **Professional PDFs**: Export with clickable links and perfect formatting
- **Real-time Collaboration**: Multiple pages, undo/redo, autosave
- **Modern Stack**: Built with latest MERN technologies for performance and scalability

---

## ✨ Features

### 🎨 **Visual Editor**
- **Drag-and-Drop Canvas**: Freely position text blocks, headings, and sections
- **Resize & Reposition**: Precise control over element dimensions and placement
- **Multi-Page Support**: Create resumes spanning multiple pages
- **Zoom & Pan**: Navigate large documents with ease
- **Grid View**: Optional alignment guides

### 📝 **Content Management**
- **Structured Forms**: Fill in details through organized sidebar forms
- **Live Preview**: See changes instantly on the canvas
- **Auto-Save**: Never lose your work
- **Template Generation**: Generate complete resume layouts from form data
- **Undo/Redo**: Full history management with 50-step memory

### 💼 **Professional Sections**
- Basic Info (Name, Headline, Contact)
- Professional Summary
- Work Experience (with multiple entries)
- Skills (categorized)
- Education (with GPA support)
- Projects (with clickable links)
- Achievements
- Social Links (GitHub, LinkedIn, Portfolio)

### 📊 **Dashboard**
- **Resume Library**: View all saved resumes in grid or list view
- **Search & Filter**: Find resumes by title or name
- **Sort Options**: By date updated, date created, or alphabetically
- **Quick Actions**: Edit, duplicate, delete with one click
- **Beautiful UI**: Premium glassmorphism design with animations

### 📤 **Export & Sharing**
- **PDF Export**: High-quality PDFs with clickable hyperlinks
- **Custom Titles**: Name your resumes for easy organization
- **Download Anytime**: One-click PDF generation
- **Preserved Formatting**: Links remain clickable in exported PDFs

### 🎭 **Customization**
- **Editable Title**: Click to rename any resume
- **Custom Styling**: Font size, weight, color, alignment
- **Text Formatting**: Bold, italic, underline, letter spacing
- **Dividers**: Visual section separators
- **List Formatting**: Editable bullet points

---

## 🏗️ Architecture

**Full-Stack MERN Application:**

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Dashboard   │  │    Editor    │  │ Properties│ │
│  │  (Resume     │  │  (Canvas +   │  │  Panel    │ │
│  │   Library)   │  │   Sidebar)   │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│           │                 │                │       │
│           └─────────────────┴────────────────┘       │
│                       │                              │
│                Zustand State Management              │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │ REST API
┌───────────────────────┼──────────────────────────────┐
│                Backend (Node.js + Express)           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Routes     │→ │ Controllers  │→ │   Models  │ │
│  │  /resumes    │  │  (Business   │  │ (Mongoose)│ │
│  │   /auth      │  │   Logic)     │  │  Schemas  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                          │           │
└──────────────────────────────────────────┼───────────┘
                                           │
                                    ┌──────┴──────┐
                                    │   MongoDB   │
                                    │  (Database) │
                                    └─────────────┘
```

### **What is Business Logic?**

**Business Logic** is the core of your application - the layer that contains all the rules, validations, and operations specific to your business domain. In ResumeCanvas:

**Examples of Business Logic:**
- **Validation**: Ensuring resume titles are not empty
- **Data Transformation**: Converting user input into the correct format
- **Business Rules**: "A resume must have at least a title and basic info"
- **Calculations**: Counting blocks, pages, calculating last modified dates
- **Authorization**: Checking if a user can edit/delete a resume
- **Data Processing**: Duplicating a resume with a "(Copy)" suffix

**In the Controller Layer:**
```javascript
// Example: Business Logic in Resume Controller
async createResume(req, res) {
  // ✅ Validation (Business Logic)
  if (!req.body.title) {
    return res.status(400).json({ 
      error: 'Title is required' 
    });
  }
  
  // ✅ Data Transformation (Business Logic)
  const resumeData = {
    title: req.body.title.trim(),
    blocks: req.body.blocks || [],
    // Auto-generate lastModified
    lastModified: new Date(),
  };
  
  // ✅ Business Rule (Business Logic)
  // Ensure at least one page exists
  if (!resumeData.pages || resumeData.pages.length === 0) {
    resumeData.pages = [{ id: 'page-1', width: 794, height: 1123 }];
  }
  
  // Database operation (handled by Model)
  const resume = await Resume.create(resumeData);
  
  res.status(201).json({ success: true, data: resume });
}
```

**Why Separate Business Logic?**
- **Maintainability**: Easy to find and update rules
- **Testability**: Can test logic without database
- **Reusability**: Same logic can be used in multiple routes
- **Clean Code**: Keeps routes thin and focused

---

**Request Flow:**
1. User interacts with React frontend (Dashboard or Editor)
2. State updates via Zustand store
3. API calls made to Express backend
4. **Routes** receive the request and pass to appropriate controller
5. **Controllers** execute business logic (validate, transform, apply rules)
6. **Models** handle database operations (save, update, delete)
7. Response sent back to frontend
8. UI updates with new data

**Key Design Patterns:**
- **MVC Architecture**: Separation of concerns (Routes → Controllers → Models)
- **RESTful API**: Standard HTTP methods for CRUD operations
- **State Management**: Zustand for predictable state updates
- **Component Architecture**: Reusable React components
- **Schema Validation**: Mongoose schemas ensure data integrity
- **Error Boundaries**: Graceful error handling throughout

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library with Hooks
- **Vite** - Lightning-fast development and builds
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **react-rnd** - Drag and resize components
- **react-to-print** - Client-side PDF generation
- **Lucide React** - Beautiful icons

### **Backend**
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart on changes
- **dotenv** - Environment variables

---

## 📦 Installation

### **Prerequisites**
- Node.js 16+ and npm 8+
- MongoDB 5+ (local or Atlas)
- 3GB free disk space
- Modern browser (Chrome, Firefox, Safari, Edge)

### **Detailed Setup**

#### **1. Clone Repository**
```bash
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas
```

#### **2. Backend Setup**
```bash
cd resume-canvas-server
npm install

# Create .env file
cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/resume-canvas
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOL

# Start MongoDB (if local)
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
# On Windows: net start MongoDB

# Start backend
npm run dev
```

Backend runs on `http://localhost:5000`

#### **3. Frontend Setup**
```bash
# Open new terminal
cd resume-canvas-client
npm install

# Create .env file (optional)
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

#### **4. Verify Installation**
1. Open browser to `http://localhost:5173`
2. Click "Create New Resume"
3. Fill in some details in the sidebar
4. See content appear on canvas
5. Click "Save"
6. Navigate back to Dashboard
7. Resume should appear in the list
8. Click "Edit" to reopen
9. Click "Export PDF" to download

---

## 📖 Usage Guide

### Creating Your First Resume

1. **Start from Dashboard**
   - Click "Create New Resume" button
   - You'll be taken to the editor

2. **Fill Basic Information**
   - Open sidebar (left panel)
   - Expand "📝 Basic Info" section
   - Enter your name, headline, contact details
   - Add professional summary

3. **Add Links**
   - Expand "🔗 Links" section
   - Enter GitHub, LinkedIn, Portfolio URLs
   - Links become clickable automatically

4. **Add Experience**
   - Expand "💼 Experience" section
   - Click "+ Add Experience"
   - Fill in company, position, dates, description
   - Add more entries as needed

5. **Add Skills**
   - Expand "🛠️ Skills" section
   - Click "+ Add Skill Category"
   - Enter category (e.g., "Backend") and skills

6. **Add Education**
   - Expand "🎓 Education" section
   - Fill in degree, institution, dates, GPA

7. **Add Projects**
   - Expand "🚀 Projects" section
   - Add project name, link, tech stack, description

8. **Customize Layout**
   - Drag text blocks on canvas to reposition
   - Resize blocks by dragging corners
   - Use drag handle (top of selected block) to move
   - Double-click text to edit directly on canvas

9. **Save Your Work**
   - Click "Save" in top bar
   - Give your resume a title (click pencil icon)
   - Changes save automatically

10. **Export PDF**
    - Click "Export PDF" button
    - PDF downloads with all formatting preserved
    - Open and verify

### Managing Multiple Resumes

**Dashboard Features:**
- **Search**: Type in search bar to filter by title/name
- **Sort**: Use dropdown to sort by date or title
- **View Modes**: Toggle between grid and list view
- **Actions**: 
  - **Edit**: Open resume in editor
  - **Duplicate**: Create a copy to customize
  - **Delete**: Remove resume permanently

### Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save resume
- **Ctrl/Cmd + Z**: Undo last action
- **Ctrl/Cmd + Shift + Z**: Redo action
- **Delete**: Delete selected block
- **Double-click**: Edit text in place
- **Esc**: Deselect block

---

## 📚 API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### **GET /resumes**
Get all resumes for the user.

**Query Parameters:**
- `sort` (string, optional) - Sort field: `createdAt`, `updatedAt`, `title`
- `order` (string, optional) - Sort order: `asc`, `desc`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "648f...",
      "title": "Software Engineer Resume",
      "resumeData": {
        "fullName": "John Doe",
        "headline": "Full Stack Developer",
        ...
      },
      "blocks": [...],
      "pages": [...],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ]
}
```

#### **GET /resumes/:id**
Get a specific resume by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "648f...",
    "title": "Software Engineer Resume",
    "resumeData": {...},
    "blocks": [...],
    "sections": {...}
  }
}
```

#### **POST /resumes**
Create a new resume.

**Request Body:**
```json
{
  "title": "My Resume",
  "resumeData": {
    "fullName": "Jane Smith",
    "headline": "Backend Developer",
    "email": "jane@email.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "summary": "Experienced developer...",
    "github": "github.com/jane",
    "linkedin": "linkedin.com/in/jane",
    "portfolio": "janesmith.dev"
  },
  "sections": {
    "experience": [...],
    "skills": [...],
    "education": [...],
    "projects": [...],
    "achievements": [...]
  },
  "blocks": [...],
  "pages": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "648f...",
    "title": "My Resume",
    ...
  }
}
```

#### **PUT /resumes/:id**
Update an existing resume.

**Request Body:** Same as POST

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

#### **DELETE /resumes/:id**
Delete a resume.

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

#### **POST /resumes/:id/duplicate**
Create a copy of a resume.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new-id",
    "title": "My Resume (Copy)",
    ...
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation failed: title is required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resume not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## ⚙️ Configuration

### Backend Configuration

**File:** `resume-canvas-server/.env`

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/resume-canvas
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-canvas

# Server
PORT=5000
NODE_ENV=development  # or 'production'

# CORS
CORS_ORIGIN=http://localhost:5173  # Frontend URL

# Optional
JWT_SECRET=your-secret-key  # For future authentication
RATE_LIMIT_MAX=100  # Max requests per window
RATE_LIMIT_WINDOW=15  # Window in minutes
```

### Frontend Configuration

**File:** `resume-canvas-client/.env`

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# For production:
# VITE_API_URL=https://your-api-domain.com/api
```

### MongoDB Configuration

**Local MongoDB:**
```bash
# Default connection
mongodb://localhost:27017/resume-canvas
```

**MongoDB Atlas (Cloud):**
1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist your IP
4. Get connection string
5. Update MONGODB_URI in .env

---

## 📸 Screenshots

### Dashboard - Resume Library
![Dashboard](screenshots/Dashboard.png)
*Manage all your resumes in one place with search, sort, and quick actions*

### Resume Editor
![Editor](screenshots/Editor.png)
*Visual canvas editor with sidebar forms for structured data entry*

### Form Editing
![Form Editing](screenshots/FormEditing.png)
*Organized sidebar forms for all resume sections with collapsible panels*

### Canvas Editing
![Canvas Editing](screenshots/CanvasEditing.png)
*Drag, resize, and position elements with precision on the visual canvas*

### PDF Export
![PDF Export](screenshots/ExportPDF.png)
*High-quality PDF export with clickable links and professional formatting*

---

## 🚀 Deployment

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB (Atlas recommended)
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Implement authentication
- [ ] Add monitoring (uptime, performance)

### Deploy Backend

**Heroku:**
```bash
cd resume-canvas-server
heroku create your-app-name-api
heroku config:set MONGODB_URI=your-mongo-uri
heroku config:set NODE_ENV=production
git push heroku main
```

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**DigitalOcean / AWS EC2:**
```bash
# SSH into server
ssh user@your-server-ip

# Clone and setup
git clone https://github.com/NainaKothari-14/resume-canvas.git
cd resume-canvas/resume-canvas-server
npm install --production

# Setup PM2 for process management
npm install -g pm2
pm2 start npm --name "resume-api" -- start
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/resume-api
# Configure proxy_pass to localhost:5000
```

### Deploy Frontend

**Vercel:**
```bash
cd resume-canvas-client
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
# Build
npm run build

# Deploy dist folder via Netlify dashboard
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Update API URL:**
After deploying backend, update frontend .env:
```bash
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🔒 Security

### Implemented Security Measures

- **Helmet**: Security headers (XSS protection, MIME sniffing prevention)
- **CORS**: Restrict cross-origin requests
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Mongoose schema validation
- **Error Handling**: No sensitive data in error messages

### Recommended Additions

**Authentication:**
```javascript
// Implement JWT authentication
npm install jsonwebtoken bcryptjs

// Add to backend
const jwt = require('jsonwebtoken');

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Content Security:**
- Sanitize HTML inputs (use DOMPurify)
- Validate file uploads
- Implement CSRF protection
- Use HTTPS in production
- Regular dependency updates: `npm audit fix`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Write clean, commented code
   - Follow existing code style
   - Test thoroughly
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- **Frontend**: 
  - Use functional components with Hooks
  - Props destructuring
  - Meaningful variable names
  - Comments for complex logic

- **Backend**:
  - Async/await over callbacks
  - Proper error handling
  - RESTful route naming
  - Input validation

### Commit Message Convention
```
Add: New feature
Fix: Bug fix
Update: Improvements to existing feature
Remove: Delete deprecated code
Docs: Documentation updates
Style: Code formatting (no logic changes)
Refactor: Code restructuring
Test: Adding tests
```

---

## 🐛 Troubleshooting

### Common Issues

**Q: MongoDB connection failed**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**A:** Ensure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Q: CORS errors in browser console**
```
Access to fetch at 'http://localhost:5000/api/resumes' from origin 
'http://localhost:5173' has been blocked by CORS policy
```
**A:** Check backend CORS configuration in `.env`:
```bash
CORS_ORIGIN=http://localhost:5173
```

**Q: Frontend can't connect to backend**
```
Failed to fetch
```
**A:** Verify:
1. Backend is running on port 5000
2. Frontend .env has correct API URL
3. No firewall blocking requests

**Q: PDF export not working**
```
There is nothing to print
```
**A:** Ensure `react-to-print` is installed correctly:
```bash
npm install react-to-print
```

**Q: Resume not loading when clicking Edit**
```
You cannot render a <Router> inside another <Router>
```
**A:** Remove duplicate `<BrowserRouter>` from `main.jsx`. Should only be in `App.jsx`.

**Q: Title not showing on dashboard**
**A:** Resumes created before title feature need to be re-saved. Open resume, save it, and title will appear.

**Q: Port 5000 already in use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**A:** Kill the process or change port:
```bash
# Find process
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill it
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

---

## 🗺️ Roadmap

### Short-term (v1.1)
- [ ] User authentication and accounts
- [ ] Resume templates (Professional, Creative, Minimalist)
- [ ] Drag-and-drop section reordering
- [ ] Color theme customization
- [ ] Font family selection
- [ ] Export to Word (.docx)
- [ ] Resume analytics (views, downloads)
- [ ] Public sharing links

### Mid-term (v1.5)
- [ ] AI-powered content suggestions
- [ ] Grammar and spell check
- [ ] Resume scoring and tips
- [ ] ATS optimization checker
- [ ] Cover letter generator
- [ ] Multiple resume versions (per job)
- [ ] Collaborative editing
- [ ] Mobile-responsive editor

### Long-term (v2.0)
- [ ] LinkedIn import
- [ ] Job application tracker
- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] Video resume support
- [ ] Portfolio integration
- [ ] Interview preparation tools
- [ ] Marketplace for premium templates

**Want to help?** Check out our [Contributing](#contributing) section!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Use commercially
- ✅ Modify as needed
- ✅ Distribute freely
- ✅ Private use
- ⚠️ Must include license and copyright notice
- ❌ No warranty provided

---

## 🙏 Acknowledgments

This project was built with incredible open-source tools:

- **React Team** - Amazing UI library
- **MongoDB** - Flexible NoSQL database
- **Express.js** - Fast web framework
- **Zustand** - Simple state management
- **Tailwind CSS** - Beautiful styling
- **react-to-print** - Client-side PDF generation
- **react-rnd** - Drag and resize functionality
- **Lucide** - Beautiful icon library
- **Vite** - Lightning-fast build tool

Special thanks to the open-source community for continuous inspiration and support!

---

## 👩‍💻 Author

**Naina Kothari**

- GitHub: [@NainaKothari-14](https://github.com/NainaKothari-14)
- LinkedIn: [Connect with me](https://linkedin.com/in/naina-kothari)
- Portfolio: [nainakothari.dev](https://your-portfolio.com)

---

## 🌟 Get Involved

If this project helped you, please consider:

- ⭐ **Starring the repository** on GitHub
- 🐛 **Reporting bugs** you encounter
- 💡 **Suggesting features** you'd like
- 🔀 **Contributing code** improvements
- 📝 **Improving documentation**
- 💬 **Spreading the word** to others

[![Star on GitHub](https://img.shields.io/badge/⭐_Star-on%20GitHub-yellow?style=for-the-badge&logo=github)](https://github.com/NainaKothari-14/resume-canvas)

---

## 💬 Support

**Need help?**
- 📖 Check the [Troubleshooting](#troubleshooting) section
- 🐛 [Open an issue](https://github.com/NainaKothari-14/resume-canvas/issues)
- 💬 Start a [discussion](https://github.com/NainaKothari-14/resume-canvas/discussions)

---

**Thank you for using ResumeCanvas!** 

This project represents a commitment to making professional resume creation accessible, intuitive, and powerful for everyone. Whether you're a fresh graduate, experienced professional, or career changer, we hope ResumeCanvas helps you land your dream job! 🚀

---

**⚡ Built with passion by developers, for developers ⚡**
