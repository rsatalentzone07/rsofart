import { User, BookOpen, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const StudentCard = ({ student, onClick }) => {
  return (
    <div
      className="card p-4 flex items-center gap-4 cursor-pointer hover:border-primary border border-transparent transition-all"
      onClick={onClick}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden bg-accent flex items-center justify-center shrink-0">
        {student.photo ? (
          <img
            src={student.photo.startsWith('http') ? student.photo : `${API_BASE}${student.photo}`}
            alt={student.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={24} className="text-primary/40" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-dark truncate">{student.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
          <BookOpen size={13} className="text-secondary shrink-0" />
          <span className="truncate">{student.class} — {student.subCourse}</span>
        </div>
        {student.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-400 font-body mt-0.5">
            <Phone size={13} className="text-secondary shrink-0" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full font-body shrink-0 ${
        student.courseType === 'art' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-dark'
      }`}>
        {student.courseType}
      </span>
    </div>
  );
};

export default StudentCard;
