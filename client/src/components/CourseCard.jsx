import { Link } from 'react-router-dom';
import { Clock, IndianRupee, ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="card overflow-hidden group">
      {/* Color band */}
      <div className={`h-2 ${course.type === 'art' ? 'bg-primary' : 'bg-secondary'}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full font-body ${
            course.type === 'art'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary/20 text-secondary-dark'
          }`}>
            {course.type === 'art' ? 'Art' : 'Dance'}
          </span>
          {course.subCourse && (
            <span className="text-xs text-gray-400 font-body">{course.subCourse}</span>
          )}
        </div>

        <h3 className="font-display text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="font-body text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm font-body text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-secondary" />
            <span>{course.duration || 'One Year'}</span>
          </div>
          {course.fee > 0 && (
            <div className="flex items-center gap-1">
              <IndianRupee size={14} className="text-secondary" />
              <span>{course.fee.toLocaleString('en-IN')}/year</span>
            </div>
          )}
        </div>

        <Link
          to="/admission"
          className="flex items-center gap-2 text-primary font-semibold text-sm font-body group-hover:gap-3 transition-all"
        >
          Apply Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
