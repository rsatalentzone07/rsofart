import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Mail, MailOpen, Phone, X } from 'lucide-react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contacts')
      .then(r => setContacts(r.data))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/contacts/${id}/read`);
      setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      if (selected?._id === id) setSelected(prev => ({ ...prev, isRead: true }));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const openContact = (contact) => {
    setSelected(contact);
    if (!contact.isRead) markAsRead(contact._id);
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  return (
    <AdminLayout title="Contact Messages">
      <div className="space-y-6">
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow-card px-5 py-4">
            <p className="font-body text-sm text-gray-500">Total Messages</p>
            <p className="font-display text-2xl font-bold text-dark">{contacts.length}</p>
          </div>
          <div className="bg-primary/10 rounded-xl px-5 py-4 border border-primary/20">
            <p className="font-body text-sm text-primary">Unread</p>
            <p className="font-display text-2xl font-bold text-primary">{unreadCount}</p>
          </div>
        </div>

        {/* Message List */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-body">
              <Mail size={36} className="mx-auto mb-2 opacity-30" />
              <p>No messages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {contacts.map(c => (
                <div
                  key={c._id}
                  onClick={() => openContact(c)}
                  className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!c.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className={`mt-0.5 shrink-0 ${c.isRead ? 'text-gray-300' : 'text-primary'}`}>
                    {c.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <p className={`font-body font-semibold truncate ${c.isRead ? 'text-gray-600' : 'text-dark'}`}>
                        {c.name}
                      </p>
                      <span className="text-xs text-gray-400 font-body shrink-0">
                        {new Date(c.submittedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="font-body text-sm text-gray-500 truncate">{c.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {c.email && <span className="text-xs text-gray-400 font-body">{c.email}</span>}
                      {c.phone && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 font-body">
                          <Phone size={11} /> {c.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  {!c.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-dark">Message</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-dark">{selected.name}</h3>
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="font-body text-sm text-primary hover:underline block">
                      {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="font-body text-sm text-gray-500 flex items-center gap-1 mt-0.5 hover:text-primary transition-colors">
                      <Phone size={13} /> {selected.phone}
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-body">{new Date(selected.submittedAt).toLocaleString('en-IN')}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-body ${selected.isRead ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'}`}>
                    {selected.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>

              <div className="bg-accent rounded-xl p-4">
                <p className="font-body text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3">
                {selected.email && (
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your message to Rabindra School of Art`}
                    className="btn-primary text-sm py-2 flex items-center gap-2"
                  >
                    <Mail size={15} /> Reply via Email
                  </a>
                )}
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="btn-outline text-sm py-2 flex items-center gap-2"
                  >
                    <Phone size={15} /> Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContacts;
