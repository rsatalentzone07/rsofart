import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, Trash2, Image } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
const CATEGORIES = ['art', 'dance', 'event', 'campus'];

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ caption: '', category: 'art' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const fetchGallery = () => {
    api.get('/gallery')
      .then(r => setImages(r.data))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGallery(); }, []);

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
    fd.append('caption', form.caption);
    fd.append('category', form.category);
    try {
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setFile(null);
      setPreview('');
      setForm({ caption: '', category: 'art' });
      fetchGallery();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Image deleted');
      setImages(prev => prev.filter(img => img._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const imgSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

  return (
    <AdminLayout title="Gallery">
      <div className="space-y-6">
        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-display text-lg font-semibold text-dark mb-4">Upload New Image</h2>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 items-start">
            {/* File Input */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-accent overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Image size={28} className="text-gray-300" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm font-body text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20 cursor-pointer"
              />
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Caption</label>
                <input
                  value={form.caption}
                  onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                  className="input-field py-2 text-sm"
                  placeholder="Image caption (optional)"
                />
              </div>
              <div>
                <label className="label text-xs">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="input-field py-2 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={uploading || !file} className="btn-primary text-sm py-2 flex items-center gap-2 mt-4 sm:mt-6 disabled:opacity-60 shrink-0">
              {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-display text-lg font-semibold text-dark mb-4">Gallery Images ({images.length})</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-body">
              <Image size={36} className="mx-auto mb-2 opacity-30" />
              <p>No images yet. Upload your first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {images.map(img => (
                <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden bg-accent">
                  <img
                    src={imgSrc(img.imageUrl)}
                    alt={img.caption || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-xs font-body capitalize bg-secondary/80 px-2 py-0.5 rounded-full">
                      {img.category}
                    </span>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-body truncate">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
