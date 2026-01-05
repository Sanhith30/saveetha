# How to Start and Test the Saveetha Faculty Portal

## Prerequisites Completed ✅
- ✅ Node.js installed
- ✅ All dependencies installed
- ✅ MongoDB Atlas connection configured
- ⚠️  **Need to update password in server/.env**

## Step-by-Step Startup Process

### 1. Update Database Password
```bash
# Edit server/.env file
# Replace <db_password> with your actual MongoDB Atlas password
```

### 2. Seed Database (First time only)
```cmd
cd server
node scripts/seedData.js
```

### 3. Start the Application
```cmd
# Option A: Start both frontend and backend together
npm run dev

# Option B: Start separately (use 2 terminals)
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

### 4. Access the Application
- **Student Portal**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/login
- **API Health Check**: http://localhost:5000/api/health

## Test Accounts

### 👨‍🎓 Student Accounts
| Registration No | Password | Department |
|----------------|----------|------------|
| 1910010001 | student123 | Computer Science |
| 1910010002 | student123 | Computer Science |
| 1910020001 | student123 | Information Technology |
| 1910030001 | student123 | Electronics & Communication |
| 1910040001 | student123 | Mechanical Engineering |

### 👨‍💼 Admin Account
| Email | Password | Role |
|-------|----------|------|
| admin@saveetha.ac.in | admin123 | Super Admin |

## Testing Checklist

### Student Features ✅
- [ ] Register new student account
- [ ] Login with existing account
- [ ] Browse faculty directory
- [ ] Filter faculty by department/subject
- [ ] View faculty details and ratings
- [ ] Rate a faculty member
- [ ] View your rating history
- [ ] Browse academic resources
- [ ] Download/access resources
- [ ] Update profile and change password

### Admin Features ✅
- [ ] Login to admin panel
- [ ] View dashboard statistics
- [ ] Add new faculty member
- [ ] Edit faculty information
- [ ] Add new academic resource
- [ ] View all ratings
- [ ] Moderate ratings (verify/unverify)
- [ ] View system analytics

## Sample Data Included

### Faculty Members (10 total)
- **CSE**: Dr. Rajesh Kumar, Dr. Priya Sharma, Prof. Arun Krishnan
- **IT**: Dr. Meera Nair, Prof. Suresh Babu
- **ECE**: Dr. Lakshmi Devi, Prof. Venkat Reddy
- **MECH**: Dr. Ravi Chandran, Prof. Anitha Kumari
- **CIVIL**: Dr. Mohan Das

### Academic Resources (8 total)
- Data Structures Notes (PDF)
- DBMS Slides (PPT)
- Java Tutorial Videos (Link)
- Computer Networks Reference (PDF)
- DSP Concepts (PDF)
- Thermodynamics Solutions (PDF)
- Structural Analysis Tutorial (Link)
- Machine Learning Guide (PDF)

## Expected Behavior

### First Time Setup
1. Database seeding creates all sample data
2. You can immediately login and test features
3. Faculty ratings start empty (need minimum 3 ratings to show stats)
4. Resources are immediately accessible

### Rating System
- Students can rate each faculty only once
- Ratings are anonymous
- Aggregated statistics show after 3+ ratings
- Admin can moderate ratings

### Security Features
- JWT token authentication
- Password hashing
- Input validation
- Rate limiting
- CORS protection

## Troubleshooting

### Common Issues
1. **Database Connection Error**
   - Check MongoDB Atlas password
   - Verify IP whitelist in Atlas
   - Ensure network connectivity

2. **Port Already in Use**
   ```cmd
   # Kill processes on ports 3000 or 5000
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   taskkill /PID <process_id> /F
   ```

3. **Module Not Found Errors**
   ```cmd
   # Reinstall dependencies
   npm run install-all
   ```

## Success Indicators

✅ **Backend Running**: Console shows "Server running on port 5000"
✅ **Database Connected**: Console shows "Connected to MongoDB"
✅ **Frontend Running**: Browser opens http://localhost:3000
✅ **Can Login**: Student/Admin login works
✅ **Data Loaded**: Faculty and resources are visible

## Next Steps After Setup

1. **Test Core Features**: Try rating faculty, browsing resources
2. **Admin Functions**: Add new faculty/resources via admin panel
3. **Customization**: Modify departments, subjects, or UI as needed
4. **Deployment**: Consider deploying to cloud platforms for production use

## Support

If you encounter issues:
1. Check console logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB Atlas is accessible
4. Review the troubleshooting section above