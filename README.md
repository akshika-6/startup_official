# PitchBridge - Startup Pitch Platform

A full-stack web application that connects startups with investors through an intuitive pitch presentation and networking platform.

## 🚀 Project Structure

```
startup_official/
├── backend/              # Node.js/Express API server
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/         # API routes
│   ├── server.mjs      # Main server file
│   ├── Schema.mjs      # MongoDB schemas
│   ├── seed.mjs        # Database seeding
│   └── package.json    # Backend dependencies
├── frontend/           # React/Vite frontend
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── ...
└── README.md          # This file
```

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **Helmet** - Security middleware

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **React Toastify** - Notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd startup_official
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on: `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

## 📋 API Routes

### Authentication & Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Startups
- `GET /api/startups` - Get all startups
- `POST /api/startups` - Create startup
- `GET /api/startups/:id` - Get startup by ID
- `PUT /api/startups/:id` - Update startup
- `DELETE /api/startups/:id` - Delete startup

### Pitches
- `GET /api/pitches` - Get all pitches
- `POST /api/pitches` - Create pitch
- `GET /api/pitches/:id` - Get pitch by ID
- `PUT /api/pitches/:id` - Update pitch
- `DELETE /api/pitches/:id` - Delete pitch

### Meetings
- `GET /api/meetings` - Get meetings
- `POST /api/meetings` - Schedule meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Cancel meeting

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Update message

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id` - Mark as read

### Ratings & Comments
- `GET /api/ratings` - Get ratings
- `POST /api/ratings` - Add rating
- `GET /api/comments` - Get comments
- `POST /api/comments` - Add comment

### Investor Preferences
- `GET /api/investor-preferences` - Get preferences
- `POST /api/investor-preferences` - Set preferences
- `PUT /api/investor-preferences/:id` - Update preferences

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository: `startup_official`

2. **Configure Build Settings**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Set Environment Variables**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Your backend will be deployed and accessible at: `https://your-app-name.onrender.com`

### Frontend Deployment (Netlify)

1. **Build Configuration**
   - **Build Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist`

2. **Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   ```

3. **Deploy**
   - Connect GitHub repository to Netlify
   - Configure build settings
   - Deploy automatically on git push

### Alternative: Frontend on Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository

2. **Configure Build**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   ```

## 🔄 Development Workflow

### Local Development
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run backend:dev    # Backend on :3000
npm run frontend:dev   # Frontend on :5173
```

### Git Workflow
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Restructured project with backend and frontend folders"

# Push to GitHub
git remote add origin https://github.com/yourusername/startup_official.git
git branch -M main
git push -u origin main
```

### Deployment Workflow
1. **Push to GitHub** - All changes are automatically detected
2. **Render** - Backend auto-deploys from `backend/` folder
3. **Netlify/Vercel** - Frontend auto-deploys from `frontend/` folder

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `server.mjs` with your frontend URL
   - Add your domain to CORS whitelist

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure environment variables are set correctly

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Clear cache: `npm clean-install`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For any queries or support, please reach out to the development team.

---

**Note**: Make sure to update the MongoDB URI and other environment variables before deploying to production.