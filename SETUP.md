# Saveetha Faculty Portal - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (server + client)
   npm run install-all
   ```

2. **Database Setup**
   ```bash
   # Make sure MongoDB is running on your system
   # Default connection: mongodb://localhost:27017/saveetha_portal
   
   # Seed the database with sample data
   cd server
   node scripts/seedData.js
   ```

3. **Environment Configuration**
   ```bash
   # Server environment is already configured in server/.env
   # You can modify the settings if needed:
   # - MongoDB URI
   # - JWT Secret
   # - Port numbers
   ```

4. **Start the Application**
   ```bash
   # Start both server and client concurrently
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Server (Port 5000)
   npm run server
   
   # Terminal 2 - Client (Port 3000)
   npm run client
   ```

5. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Health Check**: http://localhost:5000/api/health

## 🔐 Default Login Credentials

### Admin Login
- **URL**: http://localhost:3000/admin/login
- **Email**: admin@saveetha.ac.in
- **Password**: admin123

### Student Login
- **URL**: http://localhost:3000/login
- **Registration No**: 191001001
- **Password**: student123

### Additional Test Students
- 191001002 / student123 (CSE)
- 191002001 / student123 (IT)
- 191003001 / student123 (ECE)
- 191004001 / student123 (MECH)

## 📊 Sample Data Included

### Faculty Members (10 faculty across departments)
- Computer Science & Engineering: 3 faculty
- Information Technology: 2 faculty
- Electronics & Communication: 2 faculty
- Mechanical Engineering: 2 faculty
- Civil Engineering: 1 faculty

### Academic Resources (8 resources)
- Notes, PPTs, Videos, Reference materials
- Covering various subjects and semesters
- Different file formats and external links

### Students (5 test accounts)
- Different departments and years
- Ready for testing rating functionality

## 🎯 Testing the Application

### Student Features
1. **Registration & Login**
   - Register new student with valid reg no (19xxxxxxxx)
   - Login with existing credentials

2. **Faculty Rating**
   - Browse faculty by department/subject
   - Rate faculty (one rating per faculty per student)
   - View aggregated ratings (minimum 3 ratings required)

3. **Faculty Directory**
   - Search and filter faculty
   - View contact information
   - Sort by ratings, strictness, etc.

4. **Academic Resources**
   - Browse by subject/department
   - Download/access study materials
   - Search functionality

5. **Profile Management**
   - View profile information
   - Change password

### Admin Features
1. **Dashboard**
   - View system statistics
   - Recent activities overview

2. **Faculty Management**
   - Add/edit/delete faculty
   - Manage contact information

3. **Resource Management**
   - Upload new resources
   - Manage existing materials

4. **Rating Moderation**
   - View all ratings
   - Verify/unverify ratings

## 🔧 Development Commands

```bash
# Install dependencies
npm run install-all

# Development (both server & client)
npm run dev

# Server only
npm run server

# Client only
npm run client

# Build for production
npm run build

# Seed database
cd server && node scripts/seedData.js
```

## 📁 Project Structure

```
saveetha-faculty-portal/
├── server/                 # Backend (Node.js/Express)
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & validation
│   ├── scripts/           # Database seeding
│   └── index.js           # Server entry point
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── App.js         # Main app component
│   └── public/            # Static files
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **Rate Limiting**: API request limiting
- **CORS Protection**: Cross-origin request security
- **Anonymous Ratings**: Student identity protection

## 🎨 UI/UX Features

- **Material-UI Design**: Modern, responsive interface
- **Mobile Friendly**: Works on all device sizes
- **Dark/Light Theme**: Consistent color scheme
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages
- **Toast Notifications**: Real-time feedback

## 📈 Key Functionalities

### Rating System
- ⭐ Teaching Quality (1-5 stars)
- 📊 Strictness Level (Loose/Moderate/Strict)
- 📈 Internal Marks Range (40-50/50-60/60-70)
- 💬 Explanation Clarity (1-5 stars)
- 😊 Student Friendliness (Yes/No)
- 📝 Optional Text Feedback

### Faculty Information
- 📞 Contact Numbers
- 📧 Email Addresses
- 🏫 Department & Subjects
- 👨‍🏫 Designation & Experience
- 📊 Aggregated Rating Statistics

### Academic Resources
- 📚 Notes & Study Materials
- 🎥 Video Tutorials
- 🔗 Reference Links
- 📊 PPT Presentations
- 🏷️ Subject-wise Organization

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Make sure MongoDB is running
   mongod
   
   # Check connection string in server/.env
   MONGODB_URI=mongodb://localhost:27017/saveetha_portal
   ```

2. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 or 5000
   npx kill-port 3000
   npx kill-port 5000
   ```

3. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules server/node_modules client/node_modules
   npm run install-all
   ```

4. **Database Seeding Issues**
   ```bash
   # Drop database and reseed
   mongo saveetha_portal --eval "db.dropDatabase()"
   cd server && node scripts/seedData.js
   ```

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check port availability
5. Review the troubleshooting section above

## 🎉 Success!

Once setup is complete, you should be able to:
- ✅ Access the application at http://localhost:3000
- ✅ Login as student or admin
- ✅ Browse faculty and ratings
- ✅ Access academic resources
- ✅ Submit faculty ratings
- ✅ Use admin panel features

The application is now ready for demonstration and further development!