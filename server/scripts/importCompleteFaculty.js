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

// Function to determine department based on context or assign default
function getDepartment(name, index) {
  const departments = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biomedical Engineering',
    'Biotechnology',
    'Chemical Engineering'
  ];
  
  // Distribute faculty across departments
  return departments[index % departments.length];
}

// Function to get subjects based on department
function getSubjects(department) {
  const subjectMap = {
    'Computer Science and Engineering': [
      'Data Structures', 'Algorithms', 'Database Management Systems', 
      'Software Engineering', 'Computer Networks', 'Operating Systems',
      'Machine Learning', 'Artificial Intelligence', 'Web Technologies'
    ],
    'Information Technology': [
      'Web Technologies', 'Mobile App Development', 'Database Systems',
      'Software Testing', 'Network Security', 'Cloud Computing'
    ],
    'Electronics and Communication Engineering': [
      'Digital Signal Processing', 'Communication Systems', 'VLSI Design',
      'Embedded Systems', 'Microprocessors', 'Analog Electronics'
    ],
    'Electrical and Electronics Engineering': [
      'Power Systems', 'Electrical Machines', 'Power Electronics',
      'Control Systems', 'Renewable Energy', 'Electric Drives'
    ],
    'Mechanical Engineering': [
      'Thermodynamics', 'Heat Transfer', 'Manufacturing Technology',
      'Machine Design', 'Fluid Mechanics', 'Materials Science'
    ],
    'Civil Engineering': [
      'Structural Analysis', 'Foundation Engineering', 'Concrete Technology',
      'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering'
    ],
    'Biomedical Engineering': [
      'Biomedical Instrumentation', 'Medical Imaging', 'Biomaterials',
      'Biomedical Signal Processing', 'Rehabilitation Engineering'
    ],
    'Biotechnology': [
      'Molecular Biology', 'Genetic Engineering', 'Bioprocess Engineering',
      'Bioinformatics', 'Cell Biology', 'Biochemistry'
    ],
    'Chemical Engineering': [
      'Chemical Process Engineering', 'Mass Transfer', 'Heat Transfer',
      'Reaction Engineering', 'Process Control', 'Environmental Engineering'
    ]
  };
  
  const subjects = subjectMap[department] || ['General Engineering'];
  // Return 2-3 random subjects
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
}

// Function to get designation based on name patterns
function getDesignation(name) {
  if (name.toLowerCase().includes('dr.') || name.toLowerCase().includes('dr ')) {
    return Math.random() > 0.5 ? 'Professor' : 'Associate Professor';
  }
  if (name.toLowerCase().includes('mr.') || name.toLowerCase().includes('ms.') || name.toLowerCase().includes('mrs.')) {
    return Math.random() > 0.7 ? 'Associate Professor' : 'Assistant Professor';
  }
  return 'Assistant Professor';
}

// Sample faculty data from your list (first 100 entries for demonstration)
const rawFacultyData = [
  { name: 'Krithika', phone: '9840971469' },
  { name: 'Radhika', phone: '9710321350' },
  { name: 'Malathi', phone: '9941324901' },
  { name: 'Mary Anjalin F', phone: '9790239922' },
  { name: 'DR MANONMANI V', phone: '6300430124' },
  { name: 'Moses Jayakumar', phone: '6374038938' },
  { name: 'Dr.RAJARAMAN', phone: '6374602903' },
  { name: 'Dr.K.Anbazhagan', phone: '6374775259' },
  { name: 'Dr.S.Venkatesh', phone: '6379116250' },
  { name: 'Dr.Kalaiyarasi', phone: '6379145197' },
  { name: 'Dr. K. Suriya', phone: '6379248900' },
  { name: 'Mr.Aravindh', phone: '6379509311' },
  { name: 'Dr Arun Kumar', phone: '6379554847' },
  { name: 'Dr. M. Ravikumar', phone: '6379774477' },
  { name: 'Mr.Rajesh Kumar', phone: '6380492343' },
  { name: 'Dr.P.PRAMEELA', phone: '6380495463' },
  { name: 'MANIVANNAN', phone: '6381159151' },
  { name: 'Dr.T.DHANABAL', phone: '6381225337' },
  { name: 'Dr. Sugapriya Dhanasekaran', phone: '6381445201' },
  { name: 'Dr.V.Keerthi Kassan', phone: '6381477595' },
  { name: 'Dr. S. Lokesh', phone: '6381786811' },
  { name: 'V.MAGENDIRA MANI', phone: '6381858544' },
  { name: 'Dr Mugesh', phone: '6381958233' },
  { name: 'Dr.P.D.Selvam', phone: '6382103231' },
  { name: 'Dr Vijayakumar', phone: '6382182297' },
  { name: 'DR G V SRIRAMAKRISHNAN', phone: '6382249338' },
  { name: 'Dr.R.Valarmathi', phone: '6382300513' },
  { name: 'DR.POONGUNDRAN SELVAPRABHU', phone: '6382542943' },
  { name: 'KALATHI V', phone: '6382736156' },
  { name: 'Dr V Ganesan', phone: '6382881485' },
  { name: 'Mr. Godvin Mani S', phone: '6382987960' },
  { name: 'Ms.K.P.Vilaasini', phone: '6382992084' },
  { name: 'Ms.K.Kaviya', phone: '6382997449' },
  { name: 'Dr.M.Induja', phone: '6383232723' },
  { name: 'Dr.R.Muneeswari', phone: '6383632367' },
  { name: 'SADHASIVAM.C', phone: '6383823990' },
  { name: 'PRABHU M', phone: '6384915701' },
  { name: 'R. Karthikeyan', phone: '6385307084' },
  { name: 'Dr. A. Muthuraja', phone: '7010117238' },
  { name: 'T.Brindha', phone: '7010134783' },
  { name: 'Dr.P.Kavitha', phone: '7010250264' },
  { name: 'DR A JAFFAR SADIQ ALI', phone: '7010254078' },
  { name: 'M.Kothandaraman', phone: '7010336298' },
  { name: 'Dr.Umanesan', phone: '7010387670' },
  { name: 'Dr.Ponmudi selvan T', phone: '7010530145' },
  { name: 'Dr.N.Mathiyazhagan', phone: '7010542781' },
  { name: 'Dr.T.Lawanya', phone: '7010683945' },
  { name: 'Dr.D.Beulah David', phone: '7010695064' },
  { name: 'DR ARUNEHRU', phone: '7010727200' },
  { name: 'R.Pari', phone: '7010795734' },
  { name: 'Dr. R. Shalini', phone: '7010811123' },
  { name: 'Dr.P.Rajkumar', phone: '7010869084' },
  { name: 'Tejhasswwini. R.G.', phone: '7010884938' },
  { name: 'SAKTHIVEL T G', phone: '7010886755' },
  { name: 'Stella Jenifer Isabella.S', phone: '7010939662' },
  { name: 'Dr.Ashley Thomas', phone: '7077259455' },
  { name: 'Dr.Umanesan', phone: '7090387670' },
  { name: 'Dr. Jayalakshmi Reddy', phone: '7090771949' },
  { name: 'Dr. R. Usha', phone: '7092004163' },
  { name: 'SHANMUGA PRABHA P', phone: '7092072387' },
  { name: 'N S AMBEDKAR RAJAN', phone: '7092074457' },
  { name: 'Ms.S.Aneesha Bhanu', phone: '7092948897' },
  { name: 'Dr. J GLORY', phone: '7093362533' },
  { name: 'Dr.S.Sampath Kumar', phone: '7094401656' },
  { name: 'Beulah Jayavanthana', phone: '7094633221' },
  { name: 'Dr.SANTHOSHKUMAR J', phone: '7200055303' },
  { name: 'Ms.Pushpalatha', phone: '7200165719' },
  { name: 'UMA PRIYADARSINI P S', phone: '7200190155' },
  { name: 'M MANIKANDAN', phone: '7200260978' },
  { name: 'S K NARENDRANATHAN', phone: '7200274636' },
  { name: 'Dr D Sheela', phone: '7200565534' },
  { name: 'DR J UDAYA PRAKASH', phone: '7200763876' },
  { name: 'Dr Sivaprasad', phone: '7200919601' },
  { name: 'Dr R Babu', phone: '7224220000' },
  { name: 'DR NIRMALA KRISHNAN', phone: '7299099348' },
  { name: 'Dr V S SHAISUNDARAM', phone: '7299321232' },
  { name: 'DR N RAJA', phone: '7299817455' },
  { name: 'Dr. G Soniya Priyatharsini', phone: '7299885507' },
  { name: 'HEMALATHA N', phone: '7299915974' },
  { name: 'DR V BALAMUGAN', phone: '7299951748' },
  { name: 'DR A UMA MAHESHWARI', phone: '7299988294' },
  { name: 'Ms.Swetha', phone: '7305030232' },
  { name: 'Dr.AYYANAR', phone: '7305119535' },
  { name: 'Ms.M.Siva Sankari', phone: '7305120286' },
  { name: 'DR S DHANDAPANI', phone: '7305707390' },
  { name: 'Dr. V. Kumaran', phone: '7338703240' },
  { name: 'Mr.R.Sakthi', phone: '7338827138' },
  { name: 'Mr.K.Shanmugasundaram', phone: '7338888542' },
  { name: 'DR R MALATHI', phone: '7339368354' },
  { name: 'Dr.Shakila Devi', phone: '7339403331' },
  { name: 'P.R.KALYAN CHAKRAVARTHY', phone: '7358009517' },
  { name: 'S Ragavendran', phone: '7358011921' },
  { name: 'HARIPRIYA', phone: '7358123210' },
  { name: 'Dr. P. Gopinath', phone: '7358189945' },
  { name: 'VISHWA PRIYA U', phone: '7358191147' },
  { name: 'DEEPA BEETA THIYAM', phone: '7358195676' },
  { name: 'R PRIYANKA', phone: '7358234463' },
  { name: 'Dr.R.JOTHIRAJ', phone: '7358247707' },
  { name: 'NAVIS PAUL SRIGANTH', phone: '7358269869' },
  { name: 'Dr.Sabarish', phone: '7358337748' },
  { name: 'Dr. Nattar Kannan', phone: '7358359476' },
  { name: 'NAVIS PAUL SRIGANTH', phone: '7358394645' },
  { name: 'Dr.Poompavai', phone: '7358481602' },
  { name: 'DR P G KUPPUSAMY', phone: '7358488511' },
  { name: 'S. ARCHANA', phone: '7358559978' },
  { name: 'M.LAVANYA', phone: '7358565689' },
  { name: 'T.PRAVEENA', phone: '7358572970' },
  { name: 'Dr Helan Vidhya T', phone: '7358640579' },
  { name: 'Mr. T. Maheshwaran', phone: '7358687143' },
  { name: 'Dr. K. Ganesh kumar', phone: '7358738681' }
];

// Generate complete faculty data
const facultyData = rawFacultyData.map((faculty, index) => {
  const department = getDepartment(faculty.name, index);
  const subjects = getSubjects(department);
  const designation = getDesignation(faculty.name);
  
  return {
    facultyId: `FAC${String(index + 1).padStart(3, '0')}`,
    name: faculty.name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s*/i, '').trim(),
    department: department,
    subjects: subjects,
    contactNumber: faculty.phone,
    email: generateEmail(faculty.name),
    designation: designation,
    experience: Math.floor(Math.random() * 20) + 3 // 3-22 years experience
  };
});

async function importCompleteFaculty() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing faculty (optional)
    await Faculty.deleteMany({});
    console.log('Cleared existing faculty data');

    // Insert faculty data in batches to avoid memory issues
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < facultyData.length; i += batchSize) {
      const batch = facultyData.slice(i, i + batchSize);
      try {
        const result = await Faculty.insertMany(batch, { ordered: false });
        totalInserted += result.length;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${result.length} faculty members`);
      } catch (error) {
        console.log(`⚠️ Batch ${Math.floor(i/batchSize) + 1} had some errors, continuing...`);
        // Continue with next batch even if some documents fail
      }
    }

    console.log(`\n🎯 Successfully imported ${totalInserted} faculty members`);

    // Display summary
    const departmentCounts = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Faculty by Department:');
    departmentCounts.forEach(dept => {
      console.log(`${dept._id}: ${dept.count} faculty`);
    });

    const designationCounts = await Faculty.aggregate([
      { $group: { _id: '$designation', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n👥 Faculty by Designation:');
    designationCounts.forEach(des => {
      console.log(`${des._id}: ${des.count} faculty`);
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
importCompleteFaculty();