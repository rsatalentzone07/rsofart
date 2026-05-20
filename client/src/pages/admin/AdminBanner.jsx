import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, Trash2, Eye, EyeOff, Image } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ title: '', subtitle: '', order: 1 });

  const fetchBanners = () => {
    api.get('/banners/all')
      .then(r => setBanners(r.data))
      .catch(() => toast.error('Failed to load banners'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', form.title);
    fd.append('subtitle', form.subtitle);
    fd.append('order', form.order);
    fd.append('isActive', 'true');
    try {
      await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Banner added!');
      setFile(null);
      setPreview('');
      setForm({ title: '', subtitle: '', order: banners.length + 2 });
      fetchBanners();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, isActive: !b.isActive } : b));
      toast.success(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const imgSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

  return (
    <AdminLayout title="Hero Banners">
      <div className="space-y-6">
        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-display text-lg font-semibold text-dark mb-4">Add New Banner</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-40 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-accent overflow-hidden flex items-center justify-center shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Image size={28} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm font-body text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20 cursor-pointer mb-3 block"
                />
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="input-field py-2 text-sm sm:col-span-2"
                    placeholder="Banner title (optional)"
                  />
                  <input
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    type="number"
                    className="input-field py-2 text-sm"
                    placeholder="Order"
                  />
                  <input
                    value={form.subtitle}
                    onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    className="input-field py-2 text-sm sm:col-span-3"
                    placeholder="Banner subtitle (optional)"
                  />
                </div>
              </div>
            </div>
            <button type="submit" disabled={uploading || !file} className="btn-primary text-sm py-2 flex items-center gap-2 disabled:opacity-60">
              {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Add Banner'}
            </button>
          </form>
        </div>

        {/* Banner List */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-display text-lg font-semibold text-dark">Current Banners ({banners.length})</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-body">No banners yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {banners.sort((a, b) => a.order - b.order).map(banner => (
                <div key={banner._id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-28 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={imgSrc(banner.imageUrl)} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-dark truncate">{banner.title || '(No title)'}</p>
                    <p className="font-body text-xs text-gray-400 truncate">{banner.subtitle || '(No subtitle)'}</p>
                    <p className="font-body text-xs text-gray-400 mt-0.5">Order: {banner.order}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full font-body ${banner.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleActive(banner)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      title={banner.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {banner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanner;
