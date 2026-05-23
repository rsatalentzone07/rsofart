import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Courses from './pages/Courses';

const CourseDetail    = lazy(() => import('./pages/CourseDetail'));
const Gallery         = lazy(() => import('./pages/Gallery'));
const Students        = lazy(() => import('./pages/Students'));
const Teachers        = lazy(() => import('./pages/Teachers'));
const Contact         = lazy(() => import('./pages/Contact'));
const AdmissionForm   = lazy(() => import('./pages/AdmissionForm'));

const AdminLogin          = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard      = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStudents       = lazy(() => import('./pages/admin/AdminStudents'));
const AdminAddStudent     = lazy(() => import('./pages/admin/AdminAddStudent'));
const AdminStudentProfile = lazy(() => import('./pages/admin/AdminStudentProfile'));
const AdminTeachers       = lazy(() => import('./pages/admin/AdminTeachers'));
const AdminTeacherProfile = lazy(() => import('./pages/admin/AdminTeacherProfile'));
const AdminAddTeacher     = lazy(() => import('./pages/admin/AdminAddTeacher'));
const AdminGallery        = lazy(() => import('./pages/admin/AdminGallery'));
const AdminBanner         = lazy(() => import('./pages/admin/AdminBanner'));
const AdminCourses        = lazy(() => import('./pages/admin/AdminCourses'));
const AdminAdmissions     = lazy(() => import('./pages/admin/AdminAdmissions'));
const AdminContacts       = lazy(() => import('./pages/admin/AdminContacts'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-[104px]">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        <Route path="/"            element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/courses"     element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/courses/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
        <Route path="/gallery"     element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/students"    element={<PublicLayout><Students /></PublicLayout>} />
        <Route path="/teachers"    element={<PublicLayout><Teachers /></PublicLayout>} />
        <Route path="/contact"     element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admission"   element={<PublicLayout><AdmissionForm /></PublicLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin"                   element={<AdminDashboard />} />
          <Route path="/admin/students"          element={<AdminStudents />} />
          <Route path="/admin/students/add"      element={<AdminAddStudent />} />
          <Route path="/admin/students/:id"      element={<AdminStudentProfile />} />
          <Route path="/admin/teachers"          element={<AdminTeachers />} />
          <Route path="/admin/teachers/add"      element={<AdminAddTeacher />} />
          <Route path="/admin/teachers/:id"      element={<AdminTeacherProfile />} />
          <Route path="/admin/teachers/:id/edit" element={<AdminAddTeacher />} />
          <Route path="/admin/gallery"           element={<AdminGallery />} />
          <Route path="/admin/banners"           element={<AdminBanner />} />
          <Route path="/admin/courses"           element={<AdminCourses />} />
          <Route path="/admin/admissions"        element={<AdminAdmissions />} />
          <Route path="/admin/contacts"          element={<AdminContacts />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;