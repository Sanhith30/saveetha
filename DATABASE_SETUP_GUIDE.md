# Database Setup Guide

## Step 1: Update MongoDB Connection

1. Open `server/.env` file
2. Replace `<db_password>` with your actual MongoDB Atlas password
3. The line should look like:
   ```
   MONGODB_URI=mongodb+srv://sanhithreddy5131_db_user:YOUR_ACTUAL_PASSWORD@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1
   ```

## Step 2: Seed Database with Sample Data

After updating the password, run:
```cmd
cd server
node scripts/seedData.js
```

## Step 3: Start the Application

```cmd
# Start both frontend and backend
npm run dev
```

## Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Login Credentials

### Admin Login (http://localhost:3000/admin/login)
- Email: admin@saveetha.ac.in
- Password: admin123

### Student Login (http://localhost:3000/login)
- Registration No: 191001001
- Password: student123

## Troubleshooting

If you get authentication errors:
1. Check your MongoDB Atlas password
2. Ensure your IP address is whitelisted in MongoDB Atlas
3. Verify the database user has proper permissions

## Testing Features

### As Student:
1. Register/Login with registration number
2. Browse faculty directory
3. Rate faculty members
4. View academic resources
5. Check your rating history

### As Admin:
1. Login to admin panel
2. View dashboard statistics
3. Manage faculty and resources
4. Moderate ratings

## Next Steps

Once the database is connected:
1. The seeding script will create sample data
2. You can start testing all features
3. The application will be fully functional