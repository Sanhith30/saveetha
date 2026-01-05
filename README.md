# 🎓 Faculty Rating System - Saveetha School of Engineering

A comprehensive web application for students to search, view, and rate faculty members at Saveetha School of Engineering.

## 🌟 Features

- **Student Portal**: Register, login, search faculty, and submit ratings
- **Faculty Database**: 163+ faculty members across 9 departments
- **Rating System**: Multi-dimensional rating (teaching quality, explanation clarity, etc.)
- **Admin Panel**: Manage faculty, view analytics, and moderate content
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization

## 🏗️ Tech Stack

### Frontend
- **React.js** - User interface
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - API communication
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📊 Database Overview

- **163 Faculty Members** across departments:
  - Computer Science and Engineering (23)
  - Civil Engineering (22)
  - Electronics and Communication Engineering (22)
  - Mechanical Engineering (22)
  - Electrical and Electronics Engineering (20)
  - Information Technology (18)
  - Biomedical Engineering (12)
  - Biotechnology (12)
  - Chemical Engineering (12)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/faculty-rating-system.git
   cd faculty-rating-system
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Import Faculty Data**
   ```bash
   cd ../server
   npm run import-faculty
   ```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

### Default Admin Credentials
- **Email**: admin@saveetha.ac.in
- **Password**: admin123

## 🌐 Deployment

### Quick Deploy with PowerShell (Windows)
```powershell
.\deploy.ps1
```

### Quick Deploy with Bash (Linux/Mac)
```bash
./deploy.sh
```

### Manual Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Recommended Platforms
- **Vercel** (Frontend + Backend)
- **Railway** (Full-stack)
- **Render** (Free tier available)

## 📱 Screenshots

### Student Dashboard
- Search faculty by name or department
- View faculty profiles with contact information
- Submit detailed ratings and reviews

### Admin Panel
- Manage faculty database
- View rating analytics
- Monitor system usage

### Faculty Profiles
- Complete faculty information
- Rating history and statistics
- Contact details and subjects taught

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@saveetha.ac.in
ADMIN_PASSWORD=your_admin_password
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Faculty Endpoints
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/search` - Search faculty
- `GET /api/faculty/:id` - Get faculty details
- `POST /api/faculty` - Add faculty (admin only)

### Rating Endpoints
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/faculty/:id` - Get faculty ratings
- `GET /api/ratings/stats` - Get rating statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Your Name
- **Institution**: Saveetha School of Engineering
- **Contact**: your.email@saveetha.ac.in

## 🙏 Acknowledgments

- Saveetha School of Engineering for faculty data
- All faculty members included in the system
- Students who will use and benefit from this system

## 📞 Support

For support, email your.email@saveetha.ac.in or create an issue in this repository.

---

**Made with ❤️ for Saveetha School of Engineering**