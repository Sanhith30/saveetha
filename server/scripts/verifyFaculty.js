const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
require('dotenv').config();

async function verifyFaculty() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get total count
    const totalCount = await Faculty.countDocuments();
    console.log(`\n📊 Total Faculty: ${totalCount}`);

    // Get department-wise count
    const departmentCounts = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n🏢 Faculty by Department:');
    departmentCounts.forEach(dept => {
      console.log(`  ${dept._id}: ${dept.count} faculty`);
    });

    // Get designation-wise count
    const designationCounts = await Faculty.aggregate([
      { $group: { _id: '$designation', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n👥 Faculty by Designation:');
    designationCounts.forEach(des => {
      console.log(`  ${des._id}: ${des.count} faculty`);
    });

    // Show sample faculty from each department
    console.log('\n📋 Sample Faculty from Each Department:');
    
    for (const dept of departmentCounts) {
      const sampleFaculty = await Faculty.findOne({ department: dept._id });
      if (sampleFaculty) {
        console.log(`\n${dept._id}:`);
        console.log(`  Name: ${sampleFaculty.name}`);
        console.log(`  Faculty ID: ${sampleFaculty.facultyId}`);
        console.log(`  Designation: ${sampleFaculty.designation}`);
        console.log(`  Contact: ${sampleFaculty.contactNumber}`);
        console.log(`  Email: ${sampleFaculty.email}`);
        console.log(`  Subjects: ${sampleFaculty.subjects.join(', ')}`);
        console.log(`  Experience: ${sampleFaculty.experience} years`);
      }
    }

    console.log('\n✅ Faculty verification completed!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Start your application: npm run dev (in server directory)');
    console.log('2. Access admin panel: http://localhost:5000/admin');
    console.log('3. Login with admin credentials to manage faculty');
    console.log('4. Students can now search and rate faculty members');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyFaculty();