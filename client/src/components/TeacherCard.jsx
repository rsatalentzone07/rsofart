import { User, Briefcase, GraduationCap, MapPin } from 'lucide-react';

const COURSE_COLORS = {
  art: 'bg-primary/10 text-primary',
  dance: 'bg-secondary/20 text-secondary-dark',
  music: 'bg-blue-100 text-blue-700',
  yoga: 'bg-green-100 text-green-700',
};

const TeacherCard = ({ teacher }) => {
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

  return (
    <div className="card overflow-hidden group text-center">
      {/* Photo */}
      <div className="relative">
        <div className="h-52 bg-accent flex items-center justify-center overflow-hidden">
          {teacher.photo ? (
            <img
              src={teacher.photo.startsWith('http') ? teacher.photo : `${API_BASE}${teacher.photo}`}
              alt={teacher.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={40} className="text-primary/50" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-dark mb-1 group-hover:text-primary transition-colors">
          {teacher.name}
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full font-body capitalize ${COURSE_COLORS[teacher.courseType] || 'bg-gray-100 text-gray-600'}`}>
          {teacher.courseType}
        </span>

        {teacher.qualification && (
          <div className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500 font-body">
            <GraduationCap size={14} className="text-secondary shrink-0" />
            <span className="truncate">{teacher.qualification}</span>
          </div>
        )}

        {teacher.workExperience && (
          <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-gray-500 font-body">
            <Briefcase size={14} className="text-secondary shrink-0" />
            <span className="line-clamp-1">{teacher.workExperience}</span>
          </div>
        )}

        {teacher.area && (
          <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-gray-500 font-body">
            <MapPin size={14} className="text-secondary shrink-0" />
            <span>{teacher.area}</span>
          </div>
        )}

        {teacher.skills && teacher.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 justify-center">
            {teacher.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-xs bg-accent text-gray-600 px-2 py-0.5 rounded-full font-body">
                {skill}
              </span>
            ))}
            {teacher.skills.length > 3 && (
              <span className="text-xs bg-accent text-gray-500 px-2 py-0.5 rounded-full font-body">
                +{teacher.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;
