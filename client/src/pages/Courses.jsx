import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import api from '../utils/api';
import { Palette, Music2, Clock, ArrowRight } from 'lucide-react';

const ART_STRUCTURE = [
  {
    title: 'Sub Junior Diploma',
    levels: ['Adhya (Foundation)', 'Madhya (Foundation)', 'Purna (Foundation)'],
  },
  {
    title: 'Junior Diploma',
    levels: ['Prarambhik 1', 'Prarambhik 2'],
  },
  {
    title: 'Senior Diploma',
    levels: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
  },
  {
    title: 'Master Diploma',
    levels: ['6th Year', '7th Year'],
  },
];

const DANCE_STRUCTURE = [
  {
    title: 'Junior Diploma',
    levels: ['Prarambhik 1', 'Prarambhik 2'],
  },
  {
    title: 'Senior Diploma',
    levels: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
  },
];

const Courses = () => {
  const [activeTab, setActiveTab] = useState('art');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(r => setCourses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => c.type === activeTab);

  return (
    <div className="min-h-screen bg-accent">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Courses</h1>
          <p className="font-body text-gray-300 text-lg max-w-2xl mx-auto">
            Affiliated with Pracheen Kala Kendra, Chandigarh — structured curriculum from beginner to master level
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tabs */}
        <div className="flex gap-4 mb-12 justify-center">
          <button
            onClick={() => setActiveTab('art')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-body font-semibold transition-all text-base ${
              activeTab === 'art'
                ? 'bg-primary text-white shadow-card'
                : 'bg-white text-gray-600 hover:bg-primary/10'
            }`}
          >
            <Palette size={18} /> Art
          </button>
          <button
            onClick={() => setActiveTab('dance')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-body font-semibold transition-all text-base ${
              activeTab === 'dance'
                ? 'bg-primary text-white shadow-card'
                : 'bg-white text-gray-600 hover:bg-primary/10'
            }`}
          >
            <Music2 size={18} /> Dance
          </button>
        </div>

        {/* Structure Overview */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-primary mb-6 text-center">
            {activeTab === 'art' ? 'Art Program Structure' : 'Dance Program Structure'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(activeTab === 'art' ? ART_STRUCTURE : DANCE_STRUCTURE).map((group, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-card border-t-4 border-primary flex flex-col h-full"
              >
                <h3 className="font-display font-semibold text-dark text-base mb-3">{group.title}</h3>
                <ul className="space-y-1">
                  {group.levels.map((level, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-body text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                      {level}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 flex items-center gap-1 text-xs text-gray-400 font-body">
                  <Clock size={12} />
                  <span>1 Year per level</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Cards from DB */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <h2 className="font-display text-2xl font-bold text-primary mb-6 text-center">Available Classes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400 font-body">No courses found.</div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 text-white text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Ready to Enroll?</h2>
          <p className="font-body text-gray-300 mb-6">Fill out our admission form and begin your artistic journey today.</p>
          <Link to="/admission" className="bg-secondary text-dark px-8 py-3 rounded-lg font-body font-semibold hover:bg-secondary-dark transition-all inline-flex items-center gap-2">
            Apply for Admission <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Courses;
