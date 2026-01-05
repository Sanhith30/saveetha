const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const Resource = require('../models/Resource');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Admin.deleteMany({}),
      Resource.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create Admin
    const admin = new Admin({
      email: 'admin@saveetha.ac.in',
      password: 'admin123',
      name: 'System Administrator',
      role: 'super_admin',
      permissions: [
        'manage_faculty',
        'manage_resources',
        'moderate_ratings',
        'view_analytics',
        'manage_students'
      ]
    });

    await admin.save();
    console.log('Admin created');

    // Sample Faculty Data
    const facultyData = [
      {
        facultyId: 'CSE001',
        name: 'Dr. Rajesh Kumar',
        department: 'Computer Science and Engineering',
        subjects: ['Data Structures', 'Algorithms', 'Programming in C'],
        contactNumber: '9876543210',
        email: 'rajesh.kumar@saveetha.ac.in',
        designation: 'Professor',
        experience: 15
      },
      {
        facultyId: 'CSE002',
        name: 'Dr. Priya Sharma',
        department: 'Computer Science and Engineering',
        subjects: ['Database Management Systems', 'Software Engineering', 'Web Technologies'],
        contactNumber: '9876543211',
        email: 'priya.sharma@saveetha.ac.in',
        designation: 'Associate Professor',
        experience: 12
      },
      {
        facultyId: 'CSE003',
        name: 'Prof. Arun Krishnan',
        department: 'Computer Science and Engineering',
        subjects: ['Computer Networks', 'Network Security', 'Cryptography'],
        contactNumber: '9876543212',
        email: 'arun.krishnan@saveetha.ac.in',
        designation: 'Assistant Professor',
        experience: 8
      },
      {
        facultyId: 'IT001',
        name: 'Dr. Meera Nair',
        department: 'Information Technology',
        subjects: ['Object Oriented Programming', 'Java Programming', 'Mobile App Development'],
        contactNumber: '9876543213',
        email: 'meera.nair@saveetha.ac.in',
        designation: 'Professor',
        experience: 18
      },
      {
        facultyId: 'IT002',
        name: 'Prof. Suresh Babu',
        department: 'Information Technology',
        subjects: ['Data Mining', 'Machine Learning', 'Artificial Intelligence'],
        contactNumber: '9876543214',
        email: 'suresh.babu@saveetha.ac.in',
        designation: 'Associate Professor',
        experience: 10
      },
      {
        facultyId: 'ECE001',
        name: 'Dr. Lakshmi Devi',
        department: 'Electronics and Communication Engineering',
        subjects: ['Digital Signal Processing', 'Communication Systems', 'VLSI Design'],
        contactNumber: '9876543215',
        email: 'lakshmi.devi@saveetha.ac.in',
        designation: 'Professor',
        experience: 20
      },
      {
        facultyId: 'ECE002',
        name: 'Prof. Venkat Reddy',
        department: 'Electronics and Communication Engineering',
        subjects: ['Microprocessors', 'Embedded Systems', 'Digital Electronics'],
        contactNumber: '9876543216',
        email: 'venkat.reddy@saveetha.ac.in',
        designation: 'Assistant Professor',
        experience: 6
      },
      {
        facultyId: 'MECH001',
        name: 'Dr. Ravi Chandran',
        department: 'Mechanical Engineering',
        subjects: ['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics'],
        contactNumber: '9876543217',
        email: 'ravi.chandran@saveetha.ac.in',
        designation: 'Professor',
        experience: 22
      },
      {
        facultyId: 'MECH002',
        name: 'Prof. Anitha Kumari',
        department: 'Mechanical Engineering',
        subjects: ['Manufacturing Technology', 'CAD/CAM', 'Production Engineering'],
        contactNumber: '9876543218',
        email: 'anitha.kumari@saveetha.ac.in',
        designation: 'Associate Professor',
        experience: 14
      },
      {
        facultyId: 'CIVIL001',
        name: 'Dr. Mohan Das',
        department: 'Civil Engineering',
        subjects: ['Structural Analysis', 'Concrete Technology', 'Foundation Engineering'],
        contactNumber: '9876543219',
        email: 'mohan.das@saveetha.ac.in',
        designation: 'Professor',
        experience: 25
      }
    ];

    await Faculty.insertMany(facultyData);
    console.log('Faculty data seeded');

    // Sample Resource Data
    const resourceData = [
      {
        title: 'Data Structures and Algorithms - Complete Notes',
        description: 'Comprehensive notes covering all data structures including arrays, linked lists, stacks, queues, trees, and graphs with algorithm implementations.',
        subject: 'Data Structures',
        department: 'Computer Science and Engineering',
        resourceType: 'Notes',
        fileUrl: '/resources/dsa-notes.pdf',
        semester: 3,
        uploadedBy: 'Admin',
        tags: ['algorithms', 'data-structures', 'programming'],
        fileSize: 2048000,
        fileFormat: 'PDF'
      },
      {
        title: 'Database Management Systems - PPT Slides',
        description: 'PowerPoint presentations covering DBMS concepts, SQL queries, normalization, and transaction management.',
        subject: 'Database Management Systems',
        department: 'Computer Science and Engineering',
        resourceType: 'PPT',
        fileUrl: '/resources/dbms-slides.pptx',
        semester: 4,
        uploadedBy: 'Admin',
        tags: ['database', 'sql', 'normalization'],
        fileSize: 5120000,
        fileFormat: 'PPTX'
      },
      {
        title: 'Java Programming Tutorial Videos',
        description: 'Complete video series on Java programming from basics to advanced concepts including OOP, collections, and multithreading.',
        subject: 'Java Programming',
        department: 'Information Technology',
        resourceType: 'Link',
        externalLink: 'https://youtube.com/playlist?list=java-tutorial',
        semester: 3,
        uploadedBy: 'Admin',
        tags: ['java', 'programming', 'oop']
      },
      {
        title: 'Computer Networks Reference Book',
        description: 'Essential reference material for computer networks covering OSI model, TCP/IP, routing protocols, and network security.',
        subject: 'Computer Networks',
        department: 'Computer Science and Engineering',
        resourceType: 'Reference',
        fileUrl: '/resources/networks-reference.pdf',
        semester: 5,
        uploadedBy: 'Admin',
        tags: ['networks', 'protocols', 'security'],
        fileSize: 8192000,
        fileFormat: 'PDF'
      },
      {
        title: 'Digital Signal Processing Concepts',
        description: 'Detailed explanation of DSP concepts including Fourier transforms, filters, and signal analysis techniques.',
        subject: 'Digital Signal Processing',
        department: 'Electronics and Communication Engineering',
        resourceType: 'Concept',
        fileUrl: '/resources/dsp-concepts.pdf',
        semester: 6,
        uploadedBy: 'Admin',
        tags: ['dsp', 'signals', 'fourier'],
        fileSize: 3072000,
        fileFormat: 'PDF'
      },
      {
        title: 'Thermodynamics Problem Solutions',
        description: 'Step-by-step solutions to thermodynamics problems covering all major topics and applications.',
        subject: 'Thermodynamics',
        department: 'Mechanical Engineering',
        resourceType: 'Notes',
        fileUrl: '/resources/thermo-solutions.pdf',
        semester: 4,
        uploadedBy: 'Admin',
        tags: ['thermodynamics', 'problems', 'solutions'],
        fileSize: 4096000,
        fileFormat: 'PDF'
      },
      {
        title: 'Structural Analysis Software Tutorial',
        description: 'Tutorial on using structural analysis software for civil engineering applications.',
        subject: 'Structural Analysis',
        department: 'Civil Engineering',
        resourceType: 'Link',
        externalLink: 'https://example.com/structural-analysis-tutorial',
        semester: 5,
        uploadedBy: 'Admin',
        tags: ['structural', 'analysis', 'software']
      },
      {
        title: 'Machine Learning Algorithms Guide',
        description: 'Comprehensive guide to machine learning algorithms with practical examples and implementations.',
        subject: 'Machine Learning',
        department: 'Information Technology',
        resourceType: 'Notes',
        fileUrl: '/resources/ml-guide.pdf',
        semester: 7,
        uploadedBy: 'Admin',
        tags: ['machine-learning', 'algorithms', 'ai'],
        fileSize: 6144000,
        fileFormat: 'PDF'
      }
    ];

    await Resource.insertMany(resourceData);
    console.log('Resource data seeded');

    // Sample Student Data
    const studentData = [
      {
        regNo: '192310001',
        password: 'student123',
        department: 'Computer Science and Engineering',
        year: 3
      },
      {
        regNo: '192310002',
        password: 'student123',
        department: 'Computer Science and Engineering',
        year: 3
      },
      {
        regNo: '192320001',
        password: 'student123',
        department: 'Information Technology',
        year: 3
      },
      {
        regNo: '192330001',
        password: 'student123',
        department: 'Electronics and Communication Engineering',
        year: 2
      },
      {
        regNo: '192340001',
        password: 'student123',
        department: 'Mechanical Engineering',
        year: 4
      }
    ];

    await Student.insertMany(studentData);
    console.log('Student data seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👨‍💼 Admin Login:');
    console.log('   Email: admin@saveetha.ac.in');
    console.log('   Password: admin123');
    console.log('\n👨‍🎓 Sample Student Login:');
    console.log('   Registration No: 192310001');
    console.log('   Password: student123');
    console.log('\n🎯 You can now start the application and test all features!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedData();