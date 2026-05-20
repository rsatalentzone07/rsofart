import { useEffect, useState } from 'react';
import TeacherCard from '../components/TeacherCard';
import api from '../utils/api';

const TYPES = ['all', 'art', 'dance', 'music', 'yoga'];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teachers')
      .then(r => setTeachers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? teachers : teachers.filter(t => t.courseType === filter);

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Teachers</h1>
          <p className="font-body text-gray-300 text-lg max-w-xl mx-auto">
            Expert faculty dedicated to nurturing your artistic potential
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full font-body font-medium capitalize text-sm transition-all ${
                filter === type
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-white text-gray-600 hover:bg-primary/10'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-body">No teachers found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(teacher => <TeacherCard key={teacher._id} teacher={teacher} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;
