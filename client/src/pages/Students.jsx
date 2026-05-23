import { useEffect, useState } from 'react';
import { User, X, Image, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
const TYPES = ['all', 'art', 'dance'];
const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

const ArtworkModal = ({ student, onClose }) => {
  const [active, setActive] = useState(0);
  const photos = student.artPhotos || [];

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
            {student.photo && (
              <img src={resolveUrl(student.photo)} alt={student.name} className="w-14 h-14 rounded-xl object-cover mb-3 border-2 border-white/20" />
            )}
            <h3 className="font-display text-white text-base font-semibold leading-tight">{student.name}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-body capitalize mt-2 inline-block ${
              student.courseType === 'art' ? 'bg-primary/40 text-white' : 'bg-yellow-500/30 text-white'
            }`}>{student.courseType}</span>
            {student.class && <p className="text-white/50 text-xs font-body mt-1">{student.class}</p>}
            {student.subCourse && <p className="text-white/40 text-xs font-body">{student.subCourse}</p>}
            <p className="text-white/30 text-xs font-body mt-2 border-t border-white/10 pt-2">
              {photos.length} artwork{photos.length !== 1 ? 's' : ''}
            </p>
          </div>

          {photos.length > 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {photos.map((url, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      active === i ? 'border-primary scale-105' : 'border-transparent opacity-50 hover:opacity-90'
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

const StudentCard = ({ student, onViewArtwork }) => {
  const hasArtwork = student.artPhotos && student.artPhotos.length > 0;
  return (
    <div className="card overflow-hidden group text-center">
      <div className="relative">
        <div className="h-52 bg-accent flex items-center justify-center overflow-hidden">
          {student.photo ? (
            <img src={resolveUrl(student.photo)} alt={student.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"><User size={40} className="text-primary/50" /></div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-dark mb-3 group-hover:text-primary transition-colors">{student.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex-1 text-xs font-semibold px-3 py-2 rounded-lg font-body capitalize text-center ${
            student.courseType === 'art' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-yellow-700'
          }`}>{student.courseType}</span>
          <button onClick={() => hasArtwork && onViewArtwork(student)} disabled={!hasArtwork}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-body font-semibold transition-all ${
              hasArtwork ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}>
            <Image size={13} />
            {hasArtwork ? `Artwork (${student.artPhotos.length})` : 'No Artwork'}
          </button>
        </div>
        {student.class && <p className="font-body text-sm text-gray-500">{student.class}</p>}
        {student.subCourse && <p className="font-body text-xs text-gray-400 mt-0.5">{student.subCourse}</p>}
      </div>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/students/public`)
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? students : students.filter(s => s.courseType === filter);

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Students</h1>
          <p className="font-body text-gray-300 text-lg max-w-xl mx-auto">Talented young artists nurturing their passion at Rabindra School of Art</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {TYPES.map(type => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full font-body font-medium capitalize text-sm transition-all ${
                filter === type ? 'bg-primary text-white shadow-card' : 'bg-white text-gray-600 hover:bg-primary/10'
              }`}>
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-body">No students found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(student => <StudentCard key={student._id} student={student} onViewArtwork={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <ArtworkModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Students;