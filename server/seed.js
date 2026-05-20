const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Gallery = require('./models/Gallery');
const Banner = require('./models/Banner');

const connectDB = require('./config/db');

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const courses = [
  // ART - Sub Junior Diploma
  { title: 'Adhya', type: 'art', subCourse: 'Sub Junior Diploma', duration: 'One Year', fee: 1200, description: 'Foundation level art course introducing basic drawing and coloring techniques.' },
  { title: 'Madhya', type: 'art', subCourse: 'Sub Junior Diploma', duration: 'One Year', fee: 1200, description: 'Intermediate foundation level building on Adhya with more complex compositions.' },
  { title: 'Purna', type: 'art', subCourse: 'Sub Junior Diploma', duration: 'One Year', fee: 1200, description: 'Completion of the Sub Junior Diploma foundation with advanced foundation techniques.' },
  // ART - Junior Diploma
  { title: 'Prarambhik 1', type: 'art', subCourse: 'Junior Diploma', duration: 'One Year', fee: 1500, description: 'Junior level art course with focus on still life and portraiture basics.' },
  { title: 'Prarambhik 2', type: 'art', subCourse: 'Junior Diploma', duration: 'One Year', fee: 1500, description: 'Advanced junior level course covering landscape and mixed media art.' },
  // ART - Senior Diploma
  { title: '1st Year', type: 'art', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'First year of the Senior Diploma with fundamental academic art studies.' },
  { title: '2nd Year', type: 'art', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'Second year advancing in academic drawing and painting.' },
  { title: '3rd Year', type: 'art', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'Third year with specialized studies in classical Indian art forms.' },
  { title: '4th Year', type: 'art', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'Fourth year exploring contemporary art techniques and art history.' },
  { title: '5th Year', type: 'art', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'Final year of Senior Diploma with portfolio development and exhibition.' },
  // ART - Master Diploma
  { title: '6th Year', type: 'art', subCourse: 'Master Diploma', duration: 'One Year', fee: 2500, description: 'First year of Master Diploma with advanced research and specialization.' },
  { title: '7th Year', type: 'art', subCourse: 'Master Diploma', duration: 'One Year', fee: 2500, description: 'Final year of Master Diploma with thesis and solo exhibition.' },
  // DANCE
  { title: 'Junior Diploma', type: 'dance', subCourse: 'Junior Diploma', duration: 'One Year', fee: 1500, description: 'Junior dance diploma covering classical Indian dance forms.' },
  { title: 'Senior Diploma', type: 'dance', subCourse: 'Senior Diploma', duration: 'One Year', fee: 2000, description: 'Senior dance diploma with advanced classical and folk dance styles.' },
];

const teachers = [
  {
    name: 'Priya Sharma',
    courseType: 'art',
    skills: ['Oil Painting', 'Watercolor', 'Sketching', 'Portrait Art'],
    qualification: 'Master of Fine Arts (MFA)',
    workExperience: '12 years of teaching experience in fine arts',
    area: 'Main Branch, Jamshedpur',
    email: 'priya.sharma@rabindraart.com',
    photo: '',
  },
  {
    name: 'Anita Kumari',
    courseType: 'dance',
    skills: ['Bharatanatyam', 'Odissi', 'Kathak', 'Folk Dance'],
    qualification: 'Sangeet Visharad, Pracheen Kala Kendra',
    workExperience: '15 years of classical dance teaching',
    area: 'Main Branch, Jamshedpur',
    email: 'anita.kumari@rabindraart.com',
    photo: '',
  },
];

const banners = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=80',
    title: 'Welcome to Rabindra School of Art',
    subtitle: 'Nurturing creativity since 2002 — Fine Art, Dance, Music & More',
    order: 1,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
    title: 'Affiliated with Pracheen Kala Kendra',
    subtitle: 'Recognized excellence in classical arts education — Regd. No. 5071',
    order: 2,
    isActive: true,
  },
];

const galleryImages = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    caption: 'Student artwork exhibition 2023',
    category: 'art',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80',
    caption: 'Annual dance performance',
    category: 'dance',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    caption: 'Campus event 2023',
    category: 'event',
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Course.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Gallery.deleteMany({});
    await Banner.deleteMany({});

    // Create admin
    const admin = await Admin.create({
      email: 'binit@gmail.com',
      password: 'binit8570',
      name: 'Admin',
    });
    console.log('Admin created:', admin.email);

    // Create courses
    await Course.insertMany(courses);
    console.log(`${courses.length} courses created`);

    // Create teachers
    await Teacher.insertMany(teachers);
    console.log(`${teachers.length} teachers created`);

    // Create sample students
    const student1 = await Student.create({
      name: 'Ravi Kumar',
      age: 12,
      class: 'Adhya',
      courseType: 'art',
      subCourse: 'Sub Junior Diploma',
      guardianName: 'Suresh Kumar',
      phone: '9876543210',
      email: 'ravi@example.com',
      admissionDate: new Date('2023-06-01'),
      feesRecord: months.map(month => ({ month, admissionFees: 0, tuitionFees: 1200, fine: 0, paid: true })),
    });

    const student2 = await Student.create({
      name: 'Priti Devi',
      age: 15,
      class: 'Junior Diploma',
      courseType: 'dance',
      subCourse: 'Junior Diploma',
      guardianName: 'Ramesh Devi',
      phone: '9123456780',
      email: 'priti@example.com',
      admissionDate: new Date('2023-07-15'),
      feesRecord: months.map(month => ({ month, admissionFees: 0, tuitionFees: 1500, fine: 0, paid: month === 'January' ? false : true })),
    });
    console.log('2 sample students created');

    // Create banners
    await Banner.insertMany(banners);
    console.log('2 banners created');

    // Create gallery
    await Gallery.insertMany(galleryImages);
    console.log('3 gallery images created');

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin email: admin@rabindraart.com');
    console.log('Admin password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
