import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import TeacherCard from '../components/TeacherCard';
import api from '../utils/api';

const TYPES = ['all', 'art', 'dance'];
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

const ArtworkModal = ({ teacher, onClose }) => {
  const [active, setActive] = useState(0);
  const photos = teacher.artPhotos || [];

  const prev = () => setActive(i => (i - 1 + photos.length) % photos.length);
  const next = () => setActive(i => (i + 1) % photos.length);
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // ← lock scroll when modal opens
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = ''; // ← restore scroll when modal closes
      window.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onBackdrop}>
      <div className="relative w-full max-w-4xl flex flex-col lg:flex-row gap-4">

        <button onClick={onClose} className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-body">
          <X size={16} /> Close
        </button>

        <div className="relative flex-1 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: 320 }}>
          <img src={resolveUrl(photos[active])} alt={`Artwork ${active + 1}`} className="max-h-[65vh] max-w-full object-contain" />
          {photos.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button onClick={next} className="absolute right-3 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20">
                <ChevronRight size={20} className="text-white" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:w-52 flex flex-col gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            {teacher.photo && (
              <img src={resolveUrl(teacher.photo)} alt={teacher.name} className="w-14 h-14 rounded-xl object-cover mb-3 border-2 border-white/20" />
            )}
            <h3 className="font-display text-white text-base font-semibold leading-tight">{teacher.name}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-body capitalize mt-2 inline-block ${teacher.courseType === 'art' ? 'bg-primary/40 text-white' : 'bg-yellow-500/30 text-white'
              }`}>{teacher.courseType}</span>
            {teacher.qualification && <p className="text-white/50 text-xs font-body mt-1">{teacher.qualification}</p>}
            {teacher.area && <p className="text-white/40 text-xs font-body">{teacher.area}</p>}
            <p className="text-white/30 text-xs font-body mt-2 border-t border-white/10 pt-2">
              {photos.length} artwork{photos.length !== 1 ? 's' : ''}
            </p>
          </div>

          {photos.length > 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {photos.map((url, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${active === i ? 'border-primary scale-105' : 'border-transparent opacity-50 hover:opacity-90'
                      }`}>
                    <img src={resolveUrl(url)} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/teachers')
      .then(r => setTeachers(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? teachers : teachers.filter(t => t.courseType === filter);

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Teachers</h1>
          <p className="font-body text-gray-300 text-lg max-w-xl mx-auto">Expert faculty dedicated to nurturing your artistic potential</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {TYPES.map(type => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full font-body font-medium capitalize text-sm transition-all ${filter === type ? 'bg-primary text-white shadow-card' : 'bg-white text-gray-600 hover:bg-primary/10'
                }`}>
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-body">No teachers found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(teacher => <TeacherCard key={teacher._id} teacher={teacher} onViewArtwork={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <ArtworkModal teacher={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Teachers;