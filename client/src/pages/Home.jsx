import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import HeroSlider from '../components/HeroSlider';
import CourseCard from '../components/CourseCard';
import TeacherCard from '../components/TeacherCard';
import GalleryGrid from '../components/GalleryGrid';
import api from '../utils/api';
import { Award, Users, BookOpen, MapPin, ArrowRight, Star } from 'lucide-react';

const SectionDivider = ({ children }) => (
  <div className="flex items-center gap-4 mb-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-secondary/40"></div>
    <span className="font-accent text-secondary text-xl">{children || '✦'}</span>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-secondary/40"></div>
  </div>
);

/* ─── Student Artwork Flip Card ──────────────────────────────────────────── */
const ArtworkFlipCard = ({ artwork }) => {
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  const src = artwork.imageUrl?.startsWith('http')
    ? artwork.imageUrl
    : `${API_BASE}${artwork.imageUrl}`;

  const student = artwork.studentId && typeof artwork.studentId === 'object'
    ? artwork.studentId
    : null;

  const studentName = student?.name || artwork.caption?.replace('Artwork by ', '') || 'Student';
  const courseType  = student?.courseType
    ? student.courseType.charAt(0).toUpperCase() + student.courseType.slice(1)
    : '';
  const subCourse   = student?.subCourse || '';
  const age         = student?.age ? `${student.age} yrs` : '';

  return (
    <div className="group [perspective:1000px] aspect-square cursor-pointer">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-card">
          <img src={src} alt={artwork.caption || 'Student artwork'} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden shadow-card bg-primary flex flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-1">
            <span className="font-accent text-secondary text-2xl">✦</span>
          </div>
          <p className="font-display text-white text-lg font-bold leading-tight">{studentName}</p>
          {(courseType || subCourse) && (
            <p className="font-body text-secondary text-sm font-semibold">
              {[courseType, subCourse].filter(Boolean).join(' · ')}
            </p>
          )}
          {age && <p className="font-body text-gray-300 text-xs">Age: {age}</p>}
        </div>
      </div>
    </div>
  );
};

/* ─── Teacher Artwork Flip Card ──────────────────────────────────────────── */
const TeacherArtworkFlipCard = ({ photoUrl, teacher }) => {
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  const src = photoUrl?.startsWith('http') ? photoUrl : `${API_BASE}${photoUrl}`;
  const teacherPhoto = teacher.photo?.startsWith('http') ? teacher.photo : teacher.photo ? `${API_BASE}${teacher.photo}` : null;

  const courseLabel = teacher.courseType
    ? teacher.courseType.charAt(0).toUpperCase() + teacher.courseType.slice(1)
    : '';

  return (
    <div className="group [perspective:1000px] aspect-square cursor-pointer">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front — artwork photo */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-card">
          <img src={src} alt={`Artwork by ${teacher.name}`} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Back — teacher info */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden shadow-card bg-primary flex flex-col items-center justify-center gap-2 px-4 text-center">
          {/* Teacher profile photo */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary mb-1 shrink-0">
            {teacherPhoto ? (
              <img src={teacherPhoto} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                <span className="font-accent text-secondary text-2xl">✦</span>
              </div>
            )}
          </div>

          <p className="font-display text-white text-lg font-bold leading-tight">{teacher.name}</p>

          {courseLabel && (
            <p className="font-body text-secondary text-sm font-semibold">{courseLabel}</p>
          )}

          {teacher.qualification && (
            <p className="font-body text-gray-300 text-xs">{teacher.qualification}</p>
          )}

          {teacher.workExperience && (
            <p className="font-body text-gray-400 text-xs">{teacher.workExperience} experience</p>
          )}

          {teacher.skills?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {teacher.skills.slice(0, 3).map((s, i) => (
                <span key={i} className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-body">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Home ───────────────────────────────────────────────────────────────── */
const Home = () => {
  const [courses, setCourses]     = useState([]);
  const [teachers, setTeachers]   = useState([]);
  const [gallery, setGallery]     = useState([]);
  const [artworks, setArtworks]   = useState([]);

  // Flatten teacher artPhotos into { photoUrl, teacher } pairs
  const teacherArtworks = teachers
    .filter(t => t.artPhotos?.length > 0)
    .flatMap(t => t.artPhotos.map(url => ({ photoUrl: url, teacher: t })));

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.slice(0, 6))).catch(() => {});
    api.get('/teachers').then(r => setTeachers(r.data)).catch(() => {});
    api.get('/gallery').then(r => setGallery(r.data.slice(0, 6))).catch(() => {});
    api.get('/gallery?category=art&populate=true').then(r => setArtworks(r.data.slice(0, 8))).catch(() => {});
  }, []);

  const stats = [
    { icon: <Award size={28} />, value: '20+', label: 'Years of Excellence' },
    { icon: <Users size={28} />, value: '500+', label: 'Students Trained' },
    { icon: <BookOpen size={28} />, value: '14+', label: 'Courses Offered' },
    { icon: <Star size={28} />, value: '10+', label: 'Expert Teachers' },
  ];

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Stats Bar */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-secondary flex justify-center mb-2">{s.icon}</div>
              <div className="font-display text-2xl font-bold">{s.value}</div>
              <div className="font-body text-sm text-gray-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionDivider />
              <h2 className="section-heading">About Rabindra School of Art</h2>
              <p className="section-subheading font-body">Nurturing Creativity Since 2002</p>
              <p className="font-body text-gray-600 leading-relaxed mb-4">
                Rabindra School of Art was established in 2002 with a vision to preserve and promote India's rich
                cultural heritage through classical arts education. Affiliated with the prestigious Pracheen Kala
                Kendra, Chandigarh (Regd. No. 5071), we offer a comprehensive curriculum in Art, Dance, Music,
                Aerobics, and Yoga.
              </p>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                Our dedicated faculty, structured curriculum, and nurturing environment help students discover their
                artistic potential and achieve excellence in their chosen art form.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/courses" className="btn-primary">Explore Courses</Link>
                <Link to="/contact" className="btn-outline">Contact Us</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-white p-6 rounded-xl">
                <div className="font-accent text-secondary text-3xl mb-2">✦</div>
                <h3 className="font-display text-lg font-semibold mb-2">Art</h3>
                <p className="font-body text-sm text-gray-300">Sub Junior to Master Diploma levels with classical Indian and contemporary techniques.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-card">
                <div className="font-accent text-secondary text-3xl mb-2">✦</div>
                <h3 className="font-display text-lg font-semibold text-dark mb-2">Dance</h3>
                <p className="font-body text-sm text-gray-500">Classical and folk dance forms including Junior and Senior Diploma programs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      {courses.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="section-heading text-center">Our Courses</h2>
              <p className="section-subheading text-center">Structured programs from beginner to master level</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
                View All Courses <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Student Artworks — Flip Cards ─────────────────────────────── */}
      {artworks.length > 0 && (
        <section className="py-20 bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="section-heading text-center">Student Artworks</h2>
              <p className="section-subheading text-center">
                Hover over an artwork to discover the artist behind it
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {artworks.map((artwork, i) => (
                <ArtworkFlipCard key={artwork._id || i} artwork={artwork} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/gallery" className="btn-outline inline-flex items-center gap-2">
                View Full Gallery <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Teacher Artworks — Flip Cards ─────────────────────────────── */}
      {teacherArtworks.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="section-heading text-center">Teacher Artworks</h2>
              <p className="section-subheading text-center">
                Hover over an artwork to meet the teacher behind it
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {teacherArtworks.slice(0, 8).map((item, i) => (
                <TeacherArtworkFlipCard
                  key={`${item.teacher._id}-${i}`}
                  photoUrl={item.photoUrl}
                  teacher={item.teacher}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/teachers" className="btn-outline inline-flex items-center gap-2">
                Meet All Teachers <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="section-heading text-center">Gallery</h2>
              <p className="section-subheading text-center">Showcasing our students' artistic journey</p>
            </div>
            <GalleryGrid images={gallery} />
            <div className="text-center mt-10">
              <Link to="/gallery" className="btn-outline inline-flex items-center gap-2">
                View Full Gallery <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Branches */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Our Branches</h2>
            <p className="font-body text-secondary text-lg">Conveniently located across the city</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { name: 'Main Branch', address: 'Jamshedpur, Jharkhand', phone: '7903495153' },
              { name: 'Branch 2',    address: 'Jamshedpur, Jharkhand', phone: '8797288121' },
            ].map((branch, i) => (
              <div key={i} className="border border-secondary/30 rounded-xl p-6 hover:border-secondary transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={22} className="text-secondary shrink-0" />
                  <h3 className="font-display text-xl font-semibold">{branch.name}</h3>
                </div>
                <p className="font-body text-gray-300 mb-2">{branch.address}</p>
                <a href={`tel:${branch.phone}`} className="font-body text-secondary hover:text-yellow-300 transition-colors text-sm">
                  📞 {branch.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">
            Begin Your Artistic Journey Today
          </h2>
          <p className="font-body text-gray-700 mb-8 text-lg">
            Join Rabindra School of Art and discover your creative potential under expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admission" className="bg-primary text-white px-8 py-4 rounded-lg font-body font-semibold hover:bg-primary-dark transition-all text-lg">
              Apply for Admission
            </Link>
            <Link to="/contact" className="bg-dark text-white px-8 py-4 rounded-lg font-body font-semibold hover:bg-gray-800 transition-all text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;