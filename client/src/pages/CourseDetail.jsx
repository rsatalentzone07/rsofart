import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Clock, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(r => {
        const found = r.data.find(c => c._id === id);
        setCourse(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="font-body text-gray-500">Course not found.</p>
      <Link to="/courses" className="btn-primary">Back to Courses</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-accent py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/courses" className="inline-flex items-center gap-2 text-primary font-body font-semibold mb-8 hover:underline">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="p-8">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full font-body ${course.type === 'art' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-dark'}`}>
              {course.type === 'art' ? 'Art' : 'Dance'}
            </span>
            <h1 className="font-display text-3xl font-bold text-dark mt-4 mb-2">{course.title}</h1>
            <p className="font-body text-gray-500 text-sm mb-6">{course.subCourse}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-accent rounded-xl p-4 flex items-center gap-3">
                <Clock size={20} className="text-secondary" />
                <div>
                  <p className="text-xs text-gray-400 font-body">Duration</p>
                  <p className="font-semibold font-body text-dark">{course.duration || 'One Year'}</p>
                </div>
              </div>
              {course.fee > 0 && (
                <div className="bg-accent rounded-xl p-4 flex items-center gap-3">
                  <IndianRupee size={20} className="text-secondary" />
                  <div>
                    <p className="text-xs text-gray-400 font-body">Annual Fee</p>
                    <p className="font-semibold font-body text-dark">₹{course.fee.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>

            {course.description && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-dark mb-3">About this Course</h2>
                <p className="font-body text-gray-600 leading-relaxed">{course.description}</p>
              </div>
            )}

            <Link to="/admission" className="btn-primary inline-flex items-center gap-2">
              Apply for this Course <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
