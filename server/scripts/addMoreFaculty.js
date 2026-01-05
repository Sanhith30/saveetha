const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
require('dotenv').config();

// Function to generate email from name
function generateEmail(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
    .replace(/\.+/g, '.')
    .replace(/^\.+|\.+$/g, '') + '@saveetha.ac.in';
}

// Department mapping based on the data structure you provided
const departmentMapping = {
  'CSE': 'Computer Science and Engineering',
  'IT': 'Information Technology', 
  'ECE': 'Electronics and Communication Engineering',
  'EEE': 'Electrical and Electronics Engineering',
  'MECH': 'Mechanical Engineering',
  'CIVIL': 'Civil Engineering',
  'MATH': 'Computer Science and Engineering', // S&H Math usually supports CSE
  'PHYSICS': 'Electronics and Communication Engineering', // S&H Physics supports ECE
  'CHEMISTRY': 'Chemical Engineering',
  'MBA': 'Biotechnology', // Business subjects
  'AUTO': 'Mechanical Engineering'
};

// Additional faculty data from your comprehensive list
const additionalFaculty = [
  // CSE Department Faculty
  { name: 'K Sumathy', phone: '7338964157', dept: 'CSE' },
  { name: 'R Rachel Evelyn', phone: '9789913813', dept: 'CSE' },
  { name: 'Balamaheswari K', phone: '9003016216', dept: 'CSE' },
  { name: 'E Monika', phone: '9342802043', dept: 'CSE' },
  { name: 'B Malarvizhi', phone: '7358426730', dept: 'CSE' },
  { name: 'Aiswarya S', phone: '8825944173', dept: 'CSE' },
  { name: 'Senthamil Selvi E', phone: '8778791672', dept: 'CSE' },
  { name: 'Kaviya J', phone: '9994733059', dept: 'CSE' },
  { name: 'Rajagopal K', phone: '9944387493', dept: 'CSE' },
  { name: 'Ragul R', phone: '9384416016', dept: 'CSE' },
  
  // IT Department Faculty  
  { name: 'Mr. Balasundaram', phone: '9841288826', dept: 'IT' },
  { name: 'Anusuya', phone: '9787821102', dept: 'IT' },
  { name: 'Dr.S.Christy', phone: '9884909250', dept: 'IT' },
  { name: 'DR RASHIMITA', phone: '9940220629', dept: 'IT' },
  { name: 'Dr. B. Sankarasubramanian', phone: '9940258604', dept: 'IT' },
  
  // ECE Department Faculty
  { name: 'Meenakshi Sundaram', phone: '9500402524', dept: 'ECE' },
  { name: 'Sathish', phone: '9698683430', dept: 'ECE' },
  { name: 'Pushpalatha', phone: '7200165719', dept: 'ECE' },
  { name: 'Shalupriya', phone: '9884967304', dept: 'ECE' },
  { name: 'Kannappan', phone: '9094445669', dept: 'ECE' },
  { name: 'Divya', phone: '9962819924', dept: 'ECE' },
  { name: 'Anto Sagaya Priscilla', phone: '6381795713', dept: 'ECE' },
  { name: 'Ezhilarasan', phone: '9789729537', dept: 'ECE' },
  { name: 'Soundharyaa Shriharini', phone: '9789790619', dept: 'ECE' },
  { name: 'Karthik J', phone: '8056224894', dept: 'ECE' },
  
  // EEE Department Faculty
  { name: 'Jayasankar K C', phone: '9710068298', dept: 'EEE' },
  { name: 'Sriabisha', phone: '9952420561', dept: 'EEE' },
  { name: 'Bharathiraja', phone: '9791591737', dept: 'EEE' },
  { name: 'Deepa G', phone: '8220743791', dept: 'EEE' },
  { name: 'Muthu Kannan', phone: '9444208292', dept: 'EEE' },
  { name: 'Anoop', phone: '8870271177', dept: 'EEE' },
  { name: 'Priya', phone: '9840231026', dept: 'EEE' },
  { name: 'Balamurugan', phone: '9444477699', dept: 'EEE' },
  
  // Mechanical Department Faculty
  { name: 'Dilli Ganesh', phone: '8754145412', dept: 'MECH' },
  { name: 'D Rajesh Kumar', phone: '9944902370', dept: 'MECH' },
  { name: 'Megavannan M', phone: '9751925937', dept: 'MECH' },
  { name: 'Justin Raj Y', phone: '9585081246', dept: 'MECH' },
  { name: 'Sudarsan D', phone: '8870119453', dept: 'MECH' },
  { name: 'Kumaravel P', phone: '9488983368', dept: 'MECH' },
  { name: 'A Vengatesan', phone: '8248881079', dept: 'MECH' },
  { name: 'Sabari', phone: '8778175048', dept: 'MECH' },
  { name: 'Shashvat', phone: '9945695928', dept: 'MECH' },
  { name: 'Logesh K', phone: '9843163460', dept: 'MECH' },
  
  // Civil Department Faculty
  { name: 'Sujitha VS', phone: '9840521072', dept: 'CIVIL' },
  { name: 'Sharanabasava Patil', phone: '8217241924', dept: 'CIVIL' },
  { name: 'Vijayan S', phone: '9360503046', dept: 'CIVIL' },
  { name: 'Nanthini M', phone: '8220044910', dept: 'CIVIL' },
  { name: 'Pooja D', phone: '9655143608', dept: 'CIVIL' },
  { name: 'Porselvan R', phone: '8754214547', dept: 'CIVIL' },
  { name: 'Kandasamy A', phone: '6385774070', dept: 'CIVIL' },
  { name: 'Muniyasamy M K', phone: '8825931670', dept: 'CIVIL' },
  { name: 'Devendran N', phone: '8438216282', dept: 'CIVIL' },
  { name: 'P P Vilasini', phone: '9514201208', dept: 'CIVIL' }
];

// Function to get subjects based on department
function getSubjects(department) {
  const subjectMap = {
    'Computer Science and Engineering': [
      'Data Structures', 'Algorithms', 'Database Management Systems', 
      'Software Engineering', 'Computer Networks', 'Operating Systems',
      'Machine Learning', 'Artificial Intelligence', 'Web Technologies',
      'Programming in C', 'Java Programming', 'Python Programming'
    ],
    'Information Technology': [
      'Web Technologies', 'Mobile App Development', 'Database Systems',
      'Software Testing', 'Network Security', 'Cloud Computing',
      'Information Security', 'System Administration'
    ],
    'Electronics and Communication Engineering': [
      'Digital Signal Processing', 'Communication Systems', 'VLSI Design',
      'Embedded Systems', 'Microprocessors', 'Analog Electronics',
      'Digital Electronics', 'Antenna Theory', 'Wireless Communication'
    ],
    'Electrical and Electronics Engineering': [
      'Power Systems', 'Electrical Machines', 'Power Electronics',
      'Control Systems', 'Renewable Energy', 'Electric Drives',
      'Circuit Analysis', 'Electrical Measurements'
    ],
    'Mechanical Engineering': [
      'Thermodynamics', 'Heat Transfer', 'Manufacturing Technology',
      'Machine Design', 'Fluid Mechanics', 'Materials Science',
      'Automobile Engineering', 'Production Engineering'
    ],
    'Civil Engineering': [
      'Structural Analysis', 'Foundation Engineering', 'Concrete Technology',
      'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering',
      'Construction Management', 'Surveying'
    ],
    'Chemical Engineering': [
      'Chemical Process Engineering', 'Mass Transfer', 'Heat Transfer',
      'Reaction Engineering', 'Process Control', 'Environmental Engineering'
    ],
    'Biotechnology': [
      'Molecular Biology', 'Genetic Engineering', 'Bioprocess Engineering',
      'Bioinformatics', 'Cell Biology', 'Biochemistry'
    ]
  };
  
  const subjects = subjectMap[department] || ['General Engineering'];
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
}

function getDesignation(name) {
  if (name.toLowerCase().includes('dr.') || name.toLowerCase().includes('dr ')) {
    return Math.random() > 0.5 ? 'Professor' : 'Associate Professor';
  }
  if (name.toLowerCase().includes('mr.') || name.toLowerCase().includes('ms.') || name.toLowerCase().includes('mrs.')) {
    return Math.random() > 0.7 ? 'Associate Professor' : 'Assistant Professor';
  }
  return 'Assistant Professor';
}

async function addMoreFaculty() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get current faculty count
    const currentCount = await Faculty.countDocuments();
    console.log(`Current faculty count: ${currentCount}`);

    // Process additional faculty
    const facultyToAdd = additionalFaculty.map((faculty, index) => {
      const department = departmentMapping[faculty.dept] || 'Computer Science and Engineering';
      const subjects = getSubjects(department);
      const designation = getDesignation(faculty.name);
      
      return {
        facultyId: `FAC${String(currentCount + index + 1).padStart(3, '0')}`,
        name: faculty.name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s*/i, '').trim(),
        department: department,
        subjects: subjects,
        contactNumber: faculty.phone,
        email: generateEmail(faculty.name),
        designation: designation,
        experience: Math.floor(Math.random() * 20) + 3
      };
    });

    // Insert new faculty
    const result = await Faculty.insertMany(facultyToAdd, { ordered: false });
    console.log(`✅ Successfully added ${result.length} more faculty members`);

    // Display updated summary
    const departmentCounts = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Updated Faculty by Department:');
    departmentCounts.forEach(dept => {
      console.log(`${dept._id}: ${dept.count} faculty`);
    });

    const totalFaculty = await Faculty.countDocuments();
    console.log(`\n🎯 Total faculty in database: ${totalFaculty}`);

  } catch (error) {
    console.error('❌ Adding faculty failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

addMoreFaculty();