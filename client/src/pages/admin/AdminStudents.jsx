import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Search, UserPlus, Trash2, Eye } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const navigate = useNavigate();

  const fetchStudents = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (courseFilter) params.set('courseType', courseFilter);
    api.get(`/students?${params}`)
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [search, courseFilter]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch {
      toast.error('Failed to delete student');
    }
  };

  return (
    <AdminLayout title="Students">
      <div className="space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 w-full sm:w-auto">

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            {/* Filter */}
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="py-2 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="art">Art</option>
              <option value="dance">Dance</option>
            </select>
          </div>

          {/* Add button */}
          <Link
            to="/admin/students/add"
            className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5 shrink-0 rounded-lg"
          >
            <UserPlus size={15} />
            Add Student
          </Link>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-7 h-7 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <p className="text-sm font-body">No students found.</p>
              <Link
                to="/admin/students/add"
                className="text-primary hover:underline text-xs font-body"
              >
                Add your first student
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 font-body">Student</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 font-body">Age</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 font-body">Class</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 font-body">Type</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 font-body">Phone</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr
                      key={s._id}
                      className={`group hover:bg-gray-50/80 transition-colors ${i !== students.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      {/* Student name + avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100">
                            {s.photo ? (
                              <img
                                src={s.photo.startsWith('http') ? s.photo : `${API_BASE}${s.photo}`}
                                alt={s.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold font-display">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 font-body truncate">{s.name}</p>
                            <p className="text-xs text-gray-400 font-body truncate">{s.email || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Age */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-body">{s.age}</td>

                      {/* Class */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-body">{s.class}</td>

                      {/* Course type badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize font-body
                          ${s.courseType === 'art'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          {s.courseType}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-body">{s.phone || '—'}</td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 flex items-center">
                          <button
                            onClick={() => navigate(`/admin/students/${s._id}`)}
                            title="View Profile"
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id, s.name)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Row count footer */}
              <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400 font-body">
                  {students.length} {students.length === 1 ? 'student' : 'students'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminStudents;