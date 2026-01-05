const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
require('dotenv').config();

// Comprehensive faculty data from the provided list
const facultyData = [
  // S&H (Mathematics Department)
  {
    facultyId: 'MATH001',
    name: 'Sivasankari',
    department: 'Computer Science and Engineering',
    subjects: ['Engineering Mathematics', 'Statistics'],
    contactNumber: '7305120286',
    email: 'sivasankari@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 8
  },
  {
    facultyId: 'MATH002',
    name: 'Karthik',
    department: 'Computer Science and Engineering',
    subjects: ['Engineering Mathematics', 'Discrete Mathematics'],
    contactNumber: '9025476050',
    email: 'karthik@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 6
  },
  {
    facultyId: 'MATH003',
    name: 'Thenmozhi',
    department: 'Computer Science and Engineering',
    subjects: ['Engineering Mathematics', 'Probability Theory'],
    contactNumber: '8939203705',
    email: 'thenmozhi@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 5
  },
  {
    facultyId: 'MATH004',
    name: 'Manigandan',
    department: 'Computer Science and Engineering',
    subjects: ['Engineering Mathematics', 'Linear Algebra'],
    contactNumber: '9585910748',
    email: 'manigandan@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 7
  },

  // CSE Department
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
    subjects: ['Database Management Systems', 'Software Engineering'],
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
  {
    facultyId: 'CSE004',
    name: 'Vivek Balaji',
    department: 'Computer Science and Engineering',
    subjects: ['Operating Systems', 'System Programming'],
    contactNumber: '9042564703',
    email: 'vivek@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 6
  },
  {
    facultyId: 'CSE005',
    name: 'Soundarya',
    department: 'Computer Science and Engineering',
    subjects: ['Machine Learning', 'Data Mining'],
    contactNumber: '9597665421',
    email: 'soundarya@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 10
  },
  {
    facultyId: 'CSE006',
    name: 'Raveena',
    department: 'Computer Science and Engineering',
    subjects: ['Artificial Intelligence', 'Deep Learning'],
    contactNumber: '8754599163',
    email: 'raveena@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 7
  },
  {
    facultyId: 'CSE007',
    name: 'Vincent',
    department: 'Computer Science and Engineering',
    subjects: ['Computer Graphics', 'Image Processing'],
    contactNumber: '9841742792',
    email: 'vincent@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 9
  },
  {
    facultyId: 'CSE008',
    name: 'Sathya',
    department: 'Computer Science and Engineering',
    subjects: ['Web Technologies', 'Mobile Computing'],
    contactNumber: '9566668293',
    email: 'sathya@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 5
  },
  {
    facultyId: 'CSE009',
    name: 'Venkatraman',
    department: 'Computer Science and Engineering',
    subjects: ['Compiler Design', 'Theory of Computation'],
    contactNumber: '9952372444',
    email: 'venkatraman@saveetha.ac.in',
    designation: 'Professor',
    experience: 18
  },
  {
    facultyId: 'CSE010',
    name: 'Godwin',
    department: 'Computer Science and Engineering',
    subjects: ['Software Testing', 'Quality Assurance'],
    contactNumber: '6382987960',
    email: 'godwin@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 6
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
  {
    facultyId: 'IT003',
    name: 'Balasundaram',
    department: 'Information Technology',
    subjects: ['Database Systems', 'Data Warehousing'],
    contactNumber: '9841288826',
    email: 'balasundaram@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 8
  },
  {
    facultyId: 'IT004',
    name: 'Anusuya',
    department: 'Information Technology',
    subjects: ['Software Engineering', 'Project Management'],
    contactNumber: '9787821102',
    email: 'anusuya@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 12
  },
  {
    facultyId: 'IT005',
    name: 'S.Christy',
    department: 'Information Technology',
    subjects: ['Computer Networks', 'Network Security'],
    contactNumber: '9884909250',
    email: 'christy@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 7
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
  {
    facultyId: 'ECE003',
    name: 'Meenakshi Sundaram',
    department: 'Electronics and Communication Engineering',
    subjects: ['Microprocessors', 'Digital Electronics'],
    contactNumber: '9500402524',
    email: 'meenakshi@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 14
  },
  {
    facultyId: 'ECE004',
    name: 'Sathish',
    department: 'Electronics and Communication Engineering',
    subjects: ['Analog Electronics', 'Electronic Circuits'],
    contactNumber: '9698683430',
    email: 'sathish@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 9
  },
  {
    facultyId: 'ECE005',
    name: 'Pushpalatha',
    department: 'Electronics and Communication Engineering',
    subjects: ['Control Systems', 'Signal Processing'],
    contactNumber: '7200165719',
    email: 'pushpalatha@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 8
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
  {
    facultyId: 'EEE002',
    name: 'Jayasankar K C',
    department: 'Electrical and Electronics Engineering',
    subjects: ['Power Electronics', 'Electric Drives'],
    contactNumber: '9710068298',
    email: 'jayasankar@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 16
  },
  {
    facultyId: 'EEE003',
    name: 'Sriabisha',
    department: 'Electrical and Electronics Engineering',
    subjects: ['Control Systems', 'Instrumentation'],
    contactNumber: '9952420561',
    email: 'sriabisha@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 7
  },
  {
    facultyId: 'EEE004',
    name: 'Bharathiraja',
    department: 'Electrical and Electronics Engineering',
    subjects: ['Renewable Energy', 'Power Quality'],
    contactNumber: '9791591737',
    email: 'bharathiraja@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 10
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
  {
    facultyId: 'MECH002',
    name: 'Dilli Ganesh',
    department: 'Mechanical Engineering',
    subjects: ['Manufacturing Technology', 'Production Engineering'],
    contactNumber: '8754145412',
    email: 'dilli@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 8
  },
  {
    facultyId: 'MECH003',
    name: 'D Rajesh Kumar',
    department: 'Mechanical Engineering',
    subjects: ['Machine Design', 'Mechanical Vibrations'],
    contactNumber: '9944902370',
    email: 'rajesh@saveetha.ac.in',
    designation: 'Professor',
    experience: 19
  },
  {
    facultyId: 'MECH004',
    name: 'Megavannan M',
    department: 'Mechanical Engineering',
    subjects: ['Fluid Mechanics', 'Hydraulic Machines'],
    contactNumber: '9751925937',
    email: 'megavannan@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 6
  },
  {
    facultyId: 'MECH005',
    name: 'Justin Raj Y',
    department: 'Mechanical Engineering',
    subjects: ['Materials Science', 'Metallurgy'],
    contactNumber: '9585081246',
    email: 'justin@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 12
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
  },
  {
    facultyId: 'CIVIL002',
    name: 'Sujitha VS',
    department: 'Civil Engineering',
    subjects: ['Concrete Technology', 'Construction Management'],
    contactNumber: '9840521072',
    email: 'sujitha@saveetha.ac.in',
    designation: 'Associate Professor',
    experience: 13
  },
  {
    facultyId: 'CIVIL003',
    name: 'Sharanabasava Patil',
    department: 'Civil Engineering',
    subjects: ['Geotechnical Engineering', 'Soil Mechanics'],
    contactNumber: '8217241924',
    email: 'sharanabasava@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 9
  },
  {
    facultyId: 'CIVIL004',
    name: 'Vijayan S',
    department: 'Civil Engineering',
    subjects: ['Transportation Engineering', 'Highway Engineering'],
    contactNumber: '9360503046',
    email: 'vijayan@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 11
  },
  {
    facultyId: 'CIVIL005',
    name: 'Nanthini M',
    department: 'Civil Engineering',
    subjects: ['Environmental Engineering', 'Water Resources'],
    contactNumber: '8220044910',
    email: 'nanthini@saveetha.ac.in',
    designation: 'Assistant Professor',
    experience: 7
  }
];

async function importAllFaculty() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing faculty (optional - remove this if you want to keep existing data)
    await Faculty.deleteMany({});
    console.log('Cleared existing faculty data');

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
    if (error.code === 11000) {
      console.error('Duplicate key error - some faculty IDs or contact numbers already exist');
    }
  } finally {
    mongoose.connection.close();
  }
}

// Run the import
importAllFaculty();