import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Gallery from './pages/Gallery';
import Teachers from './pages/Teachers';
import Contact from './pages/Contact';
import AdmissionForm from './pages/AdmissionForm';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAddStudent from './pages/admin/AdminAddStudent';
import AdminStudentProfile from './pages/admin/AdminStudentProfile';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminTeacherProfile from './pages/admin/AdminTeacherProfile';
import AdminAddTeacher from './pages/admin/AdminAddTeacher';
import AdminGallery from './pages/admin/AdminGallery';
import AdminBanner from './pages/admin/AdminBanner';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import AdminContacts from './pages/admin/AdminContacts';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-[104px]">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
      <Route path="/courses/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/teachers" element={<PublicLayout><Teachers /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/admission" element={<PublicLayout><AdmissionForm /></PublicLayout>} />

      {/* Admin Login (no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/students/add" element={<AdminAddStudent />} />
        <Route path="/admin/students/:id" element={<AdminStudentProfile />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/teachers/add" element={<AdminAddTeacher />} />
        <Route path="/admin/teachers/:id" element={<AdminTeacherProfile />} />
        <Route path="/admin/teachers/:id/edit" element={<AdminAddTeacher />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/banners" element={<AdminBanner />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/admissions" element={<AdminAdmissions />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Route>
    </Routes>
  );
}

export default App;
