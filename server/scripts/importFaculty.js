const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
require('dotenv').config();

// Comprehensive faculty data for Saveetha School of Engineering
const facultyData = [
  // Computer Science and Engineering Department
  {
    facultyId: 'CSE001',
    name: 'Murali',
    department: 'Computer Science and Engineering',
    subjects: ['Data Structures', 'Algorithms', 'Programming Fundamentals'],
    contactNumber: '9566736726',
    email: 'murali@saveetha.ac.in',
    designation: 'Professor',
    experience: 15
  },
  {
    facultyId: 'CSE002',
    name: 'Anitha',
    department: 'Computer Science and Engineering',
    subjects: ['Database Management Systems', 'Softwring'],
    contactNumber: '9884578056',
    email: 'anitha@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 12
  },
  {
    facultyId: 'CSE003',
    name: 'Mahesh Muthulakshmi',
    department: 'Computer Science and Engineering',
    subjects: ['Computer Networks', 'Network Security'],
    contactNumber: '9840770494',
    email: 'mahesh@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 8
  },
  
  // IT Department
  {
    facultyId: 'IT001',
    name: 'Dhikhi',
    department: 'Information Technology',
    subjects: ['Web Technologies', 'Mobile App Development'],
    contactNumber: '9566023467',
    email: 'dhikhi@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 10
  },
  {
    facultyId: 'IT002',
    name: 'G.Charlyn Pushpa Latha',
    department: 'Information Technology',
    subjects: ['Machine Learning', 'Artificial Intelligence'],
    contactNumber: '9150963017',
    email: 'charlyn@saveetha.ac.in',
    designation: 'Professor',
    experience: 18
  },
  
  // ECE Department
  {
    facultyId: 'ECE001',
    name: 'Sivarama Subramanium',
    department: 'Electronics and Communication Engineering',
    subjects: ['Digital Signal Processing', 'Communication Systems'],
    contactNumber: '9994723140',
    email: 'sivarama@saveetha.ac.in',
    designation: 'Professor',
    experience: 20
  },
  {
    facultyId: 'ECE002',
    name: 'Sajiv',
    department: 'Electronics and Communication Engineering',
    subjects: ['VLSI Design', 'Embedded Systems'],
    contactNumber: '9994605662',
    email: 'sajiv@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 6
  },
  
  // EEE Department
  {
    facultyId: 'EEE001',
    name: 'N.ANBUSELVAN',
    department: 'Electrical and Electronics Engineering',
    subjects: ['Power Systems', 'Electrical Machines'],
    contactNumber: '9865604273',
    email: 'anbuselvan@saveetha.ac.in',
    designation: 'Professor',
    experience: 22
  },
  
  // Mechanical Department
  {
    facultyId: 'MECH001',
    name: 'Aravindh M',
    department: 'Mechanical Engineering',
    subjects: ['Thermodynamics', 'Heat Transfer'],
    contactNumber: '6379509311',
    email: 'aravindh@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 14
  },
  
  // Civil Department
  {
    facultyId: 'CIVIL001',
    name: 'Ragi Krishnan',
    department: 'Civil Engineering',
    subjects: ['Structural Analysis', 'Foundation Engineering'],
    contactNumber: '9567298996',
    email: 'ragi@saveetha.ac.in',
    designation: 'Professor',
    experience: 25
  }
];

async function importFaculty() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing faculty (optional - remove this if you want to keep existing data)
    // await Faculty.deleteMany({});
    // console.log('Cleared existing faculty data');

    // Insert new faculty data
    const result = await Faculty.insertMany(facultyData);
    console.log(`✅ Successfully imported ${result.length} faculty members`);

    // Display summary
    const departmentCounts = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Faculty by Department:');
    departmentCounts.forEach(dept => {
      console.log(`${dept._id}: ${dept.count} faculty`);
    });

    console.log('\n🎯 Import completed successfully!');
    console.log('You can now view and manage faculty in the admin portal.');

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the import
importFaculty();