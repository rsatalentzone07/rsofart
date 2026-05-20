import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, Eye, X } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchAdmissions = () => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/admissions${params}`)
      .then(r => setAdmissions(r.data))
      .catch(() => toast.error('Failed to load admissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); fetchAdmissions(); }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/admissions/${id}/status`, { status });
      setAdmissions(prev => prev.map(a => a._id === id ? { ...a, status: data.status } : a));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: data.status }));
      toast.success(`Application ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout title="Admissions">
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex gap-3">
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-primary/10 shadow-sm'
              }`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-body">No admissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Applicant', 'Applying For', 'Phone', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 font-body">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admissions.map(a => (
                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.photo ? (
                            <img
                              src={a.photo.startsWith('http') ? a.photo : `${API_BASE}${a.photo}`}
                              alt={a.applicantName}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary text-xs font-bold font-display">{a.applicantName.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-body font-semibold text-dark">{a.applicantName}</p>
                            <p className="text-xs text-gray-400 font-body">{a.fatherName ? `S/D of ${a.fatherName}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-gray-600">{a.applyingForClass}</td>
                      <td className="px-4 py-3 font-body text-gray-600">{a.phoneNo || '—'}</td>
                      <td className="px-4 py-3 font-body text-gray-500 text-xs">{new Date(a.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize font-body ${STATUS_STYLES[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelected(a)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          {a.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(a._id, 'approved')}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {a.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(a._id, 'rejected')}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          )}
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-dark">Admission Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo & status */}
              <div className="flex items-center gap-4">
                {selected.photo ? (
                  <img
                    src={selected.photo.startsWith('http') ? selected.photo : `${API_BASE}${selected.photo}`}
                    alt={selected.applicantName}
                    className="w-20 h-24 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-24 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-body">No Photo</span>
                  </div>
                )}
                <div>
                  <h3 className="font-display text-xl font-bold text-dark">{selected.applicantName}</h3>
                  <p className="font-body text-gray-500 text-sm">Applying for: <strong>{selected.applyingForClass}</strong></p>
                  <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full capitalize font-body ${STATUS_STYLES[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm font-body">
                {[
                  ['Father\'s Name', selected.fatherName],
                  ['Mother\'s Name', selected.motherName],
                  ['Date of Birth', selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString('en-IN') : '—'],
                  ['Age', selected.age ? `${selected.age} years` : '—'],
                  ['Sex', selected.sex],
                  ['Category', selected.category],
                  ['Nationality', selected.nationality],
                  ['Phone', selected.phoneNo],
                  ['School/College', selected.school],
                  ['Currently in Class', selected.studyingInClass],
                  ['Academic Qualification', selected.academicQualification],
                  ['Occupation', selected.occupation],
                ].map(([label, val]) => val ? (
                  <div key={label} className="bg-accent rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-dark capitalize">{val}</p>
                  </div>
                ) : null)}
                {selected.residentialAddress && (
                  <div className="col-span-2 bg-accent rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Residential Address</p>
                    <p className="font-semibold text-dark">{selected.residentialAddress}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                {selected.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'approved')}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                )}
                {selected.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'rejected')}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-red-600 transition-colors"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                )}
                {selected.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'pending')}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    <Clock size={16} /> Mark Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAdmissions;
