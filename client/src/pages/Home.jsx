import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import CourseCard from '../components/CourseCard';
import GalleryGrid from '../components/GalleryGrid';
import api from '../utils/api';
import { Phone, Award, Users, BookOpen, MapPin, ArrowRight, Star } from 'lucide-react';

const SectionDivider = ({ children }) => (
  <div className="flex items-center gap-4 mb-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-secondary/40"></div>
    <span className="font-accent text-secondary text-xl">{children || '✦'}</span>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-secondary/40"></div>
  </div>
);

const BRANCHES = [
  { name: 'Main Branch', address: 'Ghamaria, Jharkhand', phone: '7903495153' },
  { name: 'Branch 2', address: 'Adityapur, Jharkhand', phone: '8797288121' },
  { name: 'Branch 3', address: 'Ranchi, Jharkhand', phone: '8797288121' },
];

const Home = () => {
  const [courses, setCourses]   = useState([]);
  const [gallery, setGallery]   = useState([]);

  useEffect(() => {
  Promise.all([
    api.get('/courses').catch(() => ({ data: [] })),
    api.get('/gallery').catch(() => ({ data: [] })),
  ]).then(([coursesRes, galleryRes]) => {
    setCourses(coursesRes.data.slice(0, 6));
    setGallery(galleryRes.data.slice(0, 6));
  });
}, []);

  const stats = [
    { icon: <Award size={28} />, value: '20+', label: 'Years of Excellence' },
    { icon: <Users size={28} />, value: '1000+', label: 'Students Trained' },
    { icon: <BookOpen size={28} />, value: '20+', label: 'Courses Offered' },
    { icon: <Star size={28} />, value: '30+', label: 'Expert Teachers' },
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
                Kendra, Chandigarh (Regd. No. 5071), we offer a comprehensive curriculum in Art, Dance.
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
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {BRANCHES.map((branch, i) => (
              <div key={i} className="border border-secondary/30 rounded-xl p-6 hover:border-secondary transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={22} className="text-secondary shrink-0" />
                  <h3 className="font-display text-xl font-semibold">{branch.name}</h3>
                </div>
                <p className="font-body text-gray-300 mb-2">{branch.address}</p>
                <a href={`tel:${branch.phone}`} className="font-body text-secondary hover:text-yellow-300 transition-colors text-sm flex items-center gap-1.5">
  <Phone size={14} />
  {branch.phone}
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
