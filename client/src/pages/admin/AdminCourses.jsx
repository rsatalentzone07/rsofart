import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'art', subCourse: '', duration: 'One Year', fee: '', description: '' });

  const fetchCourses = () => {
    api.get('/courses')
      .then(r => setCourses(r.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type) return toast.error('Title and type are required');
    try {
      if (editId) {
        await api.put(`/courses/${editId}`, { ...form, fee: Number(form.fee) || 0 });
        toast.success('Course updated!');
      } else {
        await api.post('/courses', { ...form, fee: Number(form.fee) || 0 });
        toast.success('Course added!');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ title: '', type: 'art', subCourse: '', duration: 'One Year', fee: '', description: '' });
      fetchCourses();
    } catch {
      toast.error('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      type: course.type,
      subCourse: course.subCourse || '',
      duration: course.duration || 'One Year',
      fee: course.fee || '',
      description: course.description || '',
    });
    setEditId(course._id);
    setShowForm(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const artCourses = courses.filter(c => c.type === 'art');
  const danceCourses = courses.filter(c => c.type === 'dance');

  return (
    <AdminLayout title="Courses">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', type: 'art', subCourse: '', duration: 'One Year', fee: '', description: '' }); }}
            className="btn-primary text-sm py-2 flex items-center gap-2"
          >
            {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Course</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-display text-lg font-semibold text-dark mb-4">{editId ? 'Edit Course' : 'Add New Course'}</h2>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. Adhya, 1st Year" />
              </div>
              <div>
                <label className="label">Type *</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                  <option value="art">Art</option>
                  <option value="dance">Dance</option>
                </select>
              </div>
              <div>
                <label className="label">Sub Course</label>
                <input value={form.subCourse} onChange={e => setForm(p => ({ ...p, subCourse: e.target.value }))} className="input-field" placeholder="e.g. Sub Junior Diploma" />
              </div>
              <div>
                <label className="label">Duration</label>
                <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className="input-field" placeholder="One Year" />
              </div>
              <div>
                <label className="label">Annual Fee (₹)</label>
                <input value={form.fee} onChange={e => setForm(p => ({ ...p, fee: e.target.value }))} type="number" className="input-field" placeholder="e.g. 1500" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Course description..." />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={16} /> {editId ? 'Update' : 'Add'} Course
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Art Courses */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {[{ label: 'Art Courses', data: artCourses, color: 'border-primary' }, { label: 'Dance Courses', data: danceCourses, color: 'border-secondary' }].map(({ label, data, color }) => (
              <div key={label} className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className={`px-6 py-4 border-b border-gray-100 border-l-4 ${color}`}>
                  <h2 className="font-display text-lg font-semibold text-dark">{label} ({data.length})</h2>
                </div>
                {data.length === 0 ? (
                  <p className="font-body text-gray-400 text-sm p-6">No courses added yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {['Title', 'Sub Course', 'Duration', 'Fee', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 font-body">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.map(course => (
                          <tr key={course._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-body font-semibold text-dark">{course.title}</td>
                            <td className="px-4 py-3 font-body text-gray-500">{course.subCourse || '—'}</td>
                            <td className="px-4 py-3 font-body text-gray-500">{course.duration || '—'}</td>
                            <td className="px-4 py-3 font-body text-gray-500">{course.fee > 0 ? `₹${course.fee.toLocaleString('en-IN')}` : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(course)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                  <Edit size={15} />
                                </button>
                                <button onClick={() => handleDelete(course._id, course.title)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
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
            ))}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
