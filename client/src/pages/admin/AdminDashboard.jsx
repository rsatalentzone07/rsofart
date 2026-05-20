import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import { Users, ClipboardList, MessageSquare, GraduationCap, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className={`block bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body text-gray-500 text-sm">{label}</p>
        <p className="font-display text-3xl font-bold text-dark mt-1">{value}</p>
      </div>
      <div className="text-gray-300">{icon}</div>
    </div>
  </Link>
);

const statusColor = { pending: 'text-yellow-600 bg-yellow-50', approved: 'text-green-600 bg-green-50', rejected: 'text-red-600 bg-red-50' };
const statusIcon = { pending: <Clock size={14} />, approved: <CheckCircle size={14} />, rejected: <XCircle size={14} /> };

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, pendingAdmissions: 0, unreadMessages: 0, teachers: 0 });
  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/admissions'),
      api.get('/contacts'),
      api.get('/teachers'),
    ]).then(([students, admissions, contacts, teachers]) => {
      setStats({
        students: students.data.length,
        pendingAdmissions: admissions.data.filter(a => a.status === 'pending').length,
        unreadMessages: contacts.data.filter(c => !c.isRead).length,
        teachers: teachers.data.length,
      });
      setAdmissions(admissions.data.slice(0, 5));
      setContacts(contacts.data.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={36} />} label="Total Students" value={stats.students} color="border-primary" to="/admin/students" />
            <StatCard icon={<ClipboardList size={36} />} label="Pending Admissions" value={stats.pendingAdmissions} color="border-yellow-400" to="/admin/admissions" />
            <StatCard icon={<MessageSquare size={36} />} label="Unread Messages" value={stats.unreadMessages} color="border-blue-400" to="/admin/contacts" />
            <StatCard icon={<GraduationCap size={36} />} label="Total Teachers" value={stats.teachers} color="border-secondary" to="/admin/teachers" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Admissions */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-display text-lg font-semibold text-dark">Recent Admissions</h2>
                <Link to="/admin/admissions" className="text-primary text-sm font-body hover:underline">View all</Link>
              </div>
              {admissions.length === 0 ? (
                <p className="font-body text-gray-400 text-sm p-6">No admissions yet.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {admissions.map(a => (
                    <li key={a._id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-body font-semibold text-sm text-dark">{a.applicantName}</p>
                        <p className="font-body text-xs text-gray-400">{a.applyingForClass} · {new Date(a.submittedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full capitalize font-body ${statusColor[a.status]}`}>
                        {statusIcon[a.status]} {a.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Contacts */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-display text-lg font-semibold text-dark">Recent Messages</h2>
                <Link to="/admin/contacts" className="text-primary text-sm font-body hover:underline">View all</Link>
              </div>
              {contacts.length === 0 ? (
                <p className="font-body text-gray-400 text-sm p-6">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {contacts.map(c => (
                    <li key={c._id} className="px-6 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`font-body text-sm font-semibold truncate ${c.isRead ? 'text-gray-500' : 'text-dark'}`}>{c.name}</p>
                        <p className="font-body text-xs text-gray-400 truncate">{c.message}</p>
                      </div>
                      {!c.isRead && <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-display text-lg font-semibold text-dark mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/students/add" className="btn-primary text-sm py-2">+ Add Student</Link>
              <Link to="/admin/teachers/add" className="btn-secondary text-sm py-2">+ Add Teacher</Link>
              <Link to="/admin/gallery" className="btn-outline text-sm py-2">Upload Gallery</Link>
              <Link to="/admin/banners" className="btn-outline text-sm py-2">Manage Banners</Link>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
