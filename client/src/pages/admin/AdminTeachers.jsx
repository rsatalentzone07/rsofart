import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, Eye, User } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/teachers')
      .then(r => setTeachers(r.data))
      .catch(() => toast.error('Failed to load teachers'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete teacher "${name}"?`)) return;
    try {
      await api.delete(`/teachers/${id}`);
      toast.success('Teacher deleted');
      setTeachers(prev => prev.filter(t => t._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout title="Teachers">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link to="/admin/teachers/add" className="btn-primary text-sm py-2 flex items-center gap-2">
            <UserPlus size={16} /> Add Teacher
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-body">
              <p>No teachers yet.</p>
              <Link to="/admin/teachers/add" className="text-primary hover:underline text-sm mt-2 block">
                Add your first teacher
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Teacher', 'Course Type', 'Qualification', 'Area', 'Skills', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 font-body">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {teachers.map(t => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent overflow-hidden shrink-0">
                            {t.photo ? (
                              <img
                                src={t.photo.startsWith('http') ? t.photo : `${API_BASE}${t.photo}`}
                                alt={t.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={18} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-body font-semibold text-dark">{t.name}</p>
                            <p className="text-xs text-gray-400 font-body">{t.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize font-body bg-primary/10 text-primary">
                          {t.courseType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-gray-600 max-w-[180px] truncate">{t.qualification || '—'}</td>
                      <td className="px-4 py-3 font-body text-gray-600">{t.area || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(t.skills || []).slice(0, 2).map(s => (
                            <span key={s} className="text-xs bg-accent text-gray-600 px-2 py-0.5 rounded-full font-body">{s}</span>
                          ))}
                          {(t.skills || []).length > 2 && (
                            <span className="text-xs text-gray-400 font-body">+{t.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/teachers/${t._id}`)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id, t.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeachers;