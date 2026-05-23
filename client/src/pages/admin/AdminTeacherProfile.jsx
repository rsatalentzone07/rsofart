import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ImageCropModal from '../../components/ImageCropModal';
import { ArrowLeft, Trash2, User, Camera, Pencil, Save, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
const COURSE_TYPES = ['art', 'dance'];

const InfoCard = ({ label, children }) => (
  <div className="flex flex-col gap-1 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body">{label}</span>
    {children}
  </div>
);

const AdminTeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [uploading, setUploading]         = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const [editing, setEditing]             = useState(false);
  const [saving, setSaving]               = useState(false);
  const [form, setForm]                   = useState({});
  const [photoFile, setPhotoFile]         = useState(null);
  const [photoPreview, setPhotoPreview]   = useState(null);
  const [cropSrc, setCropSrc]             = useState(null);
  const [pendingFile, setPendingFile]     = useState(null);

  const fetchTeacher = () => {
    api.get(`/teachers/${id}`)
      .then(r => {
        setTeacher(r.data);
        setForm({
          name:           r.data.name           || '',
          email:          r.data.email          || '',
          courseType:     r.data.courseType     || 'art',
          qualification:  r.data.qualification  || '',
          workExperience: r.data.workExperience || '',
          area:           r.data.area           || '',
          skills:         (r.data.skills || []).join(', '),
        });
      })
      .catch(() => toast.error('Failed to load teacher'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeacher(); }, [id]);

  const imgSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;
  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);
      await api.put(`/teachers/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Teacher updated!');
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchTeacher();
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete teacher "${teacher.name}"?`)) return;
    try {
      await api.delete(`/teachers/${id}`);
      toast.success('Teacher deleted');
      navigate('/admin/teachers');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleArtFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setCropSrc(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCropDone = async (blob) => {
    setCropSrc(null);
    setUploading(true);
    const fd = new FormData();
    fd.append('artPhoto', blob, pendingFile?.name || 'artwork.jpg');
    try {
      await api.post(`/teachers/${id}/art`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Artwork uploaded!');
      fetchTeacher();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  const handleArtDelete = async (photoUrl) => {
    if (!window.confirm('Delete this artwork?')) return;
    setDeletingPhoto(photoUrl);
    try {
      await api.delete(`/teachers/${id}/art`, { data: { photoUrl } });
      toast.success('Artwork deleted');
      fetchTeacher();
    } catch {
      toast.error('Failed to delete artwork');
    } finally {
      setDeletingPhoto(null);
    }
  };

  if (loading) return (
    <AdminLayout title="Teacher Profile">
      <div className="flex justify-center items-center h-64">
        <div className="w-9 h-9 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  if (!teacher) return (
    <AdminLayout title="Teacher Profile">
      <p className="text-gray-500 font-body">Teacher not found.</p>
    </AdminLayout>
  );

  const currentPhoto = photoPreview || (teacher.photo ? imgSrc(teacher.photo) : null);
  const skillsList = teacher.skills || [];

  return (
    <AdminLayout title="Teacher Profile">
      <div className="max-w-5xl space-y-5">

        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-body text-sm transition-colors">
            <ArrowLeft size={15} /> Back to Teachers
          </button>
          <div className="flex items-center gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-body font-medium text-primary border border-primary/25 hover:border-primary/60 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all">
                <Pencil size={13} /> Edit
              </button>
            ) : (
              <>
                <button onClick={handleCancelEdit} className="flex items-center gap-1.5 text-sm font-body text-gray-500 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all">
                  <X size={13} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-sm font-body font-medium bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-60">
                  {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                  Save
                </button>
              </>
            )}
            <button onClick={handleDelete} className="flex items-center gap-1.5 text-sm font-body text-red-500 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-primary px-7 py-6 flex items-center gap-5 relative">
            {!editing && (
              <span className="absolute top-4 right-5 text-[11px] font-semibold px-3 py-1 rounded-full font-body capitalize bg-white/15 text-white border border-white/25">
                {teacher.courseType}
              </span>
            )}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 bg-white/10">
                {currentPhoto ? (
                  <img src={currentPhoto} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User size={30} className="text-white/50" /></div>
                )}
              </div>
              {editing && (
                <label className="absolute -bottom-1 -right-1 bg-white text-primary rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-50 transition-colors">
                  <Camera size={12} />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <input name="name" value={form.name} onChange={handleFormChange}
                  className="bg-white/15 border border-white/30 text-white placeholder-white/50 rounded-lg px-3 py-1.5 text-lg font-bold font-display w-full max-w-xs outline-none focus:bg-white/20 mb-1"
                  placeholder="Teacher name" />
              ) : (
                <h2 className="font-display text-xl font-bold text-white truncate">{teacher.name}</h2>
              )}
              <p className="text-sm text-white/60 font-body mt-0.5 capitalize">
                {editing ? form.courseType : teacher.courseType}
                {(editing ? form.qualification : teacher.qualification) && <> · {editing ? form.qualification : teacher.qualification}</>}
              </p>
            </div>
          </div>

          <div className="px-7 pb-7 pt-6">
            {!editing ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body mb-3">Personal Info</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                  {[
                    ['Email',           teacher.email          || '—'],
                    ['Work Experience', teacher.workExperience || '—'],
                    ['Area',            teacher.area           || '—'],
                  ].map(([label, val]) => (
                    <InfoCard key={label} label={label}>
                      <p className="text-sm font-semibold text-gray-800 font-body">{val}</p>
                    </InfoCard>
                  ))}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body mb-3">Course Details</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                  {[
                    ['Course Type',   teacher.courseType],
                    ['Qualification', teacher.qualification || '—'],
                  ].map(([label, val]) => (
                    <InfoCard key={label} label={label}>
                      <p className="text-sm font-semibold text-gray-800 font-body capitalize">{val}</p>
                    </InfoCard>
                  ))}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.length > 0 ? skillsList.map(s => (
                    <span key={s} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-body">{s}</span>
                  )) : <p className="text-sm font-semibold text-gray-800 font-body">—</p>}
                </div>
              </>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-body">
                {[
                  { label: 'Email',           name: 'email',          type: 'email', placeholder: 'Email' },
                  { label: 'Work Experience', name: 'workExperience',               placeholder: 'e.g. 5 years' },
                  { label: 'Area',            name: 'area',                         placeholder: 'e.g. Jamshedpur' },
                  { label: 'Qualification',   name: 'qualification',                placeholder: 'e.g. B.F.A, M.A Dance' },
                ].map(f => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{f.label}</label>
                    <input name={f.name} type={f.type || 'text'} value={form[f.name]} onChange={handleFormChange}
                      placeholder={f.placeholder} className="input-field py-2 text-sm" />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Course Type</label>
                  <select name="courseType" value={form.courseType} onChange={handleFormChange} className="input-field py-2 text-sm capitalize">
                    {COURSE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Skills (comma separated)</label>
                  <input name="skills" value={form.skills} onChange={handleFormChange}
                    placeholder="e.g. Painting, Sculpture, Charcoal" className="input-field py-2 text-sm" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-bold text-dark">
                Artwork
                {teacher.artPhotos?.length > 0 && (
                  <span className="ml-2 text-xs font-body font-normal text-gray-400">({teacher.artPhotos.length})</span>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">Click Upload → crop → save</p>
            </div>
            <label className={`flex items-center gap-1.5 btn-primary text-sm py-2 px-4 rounded-lg cursor-pointer font-body ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {uploading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={14} />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleArtFileSelect} disabled={uploading} />
            </label>
          </div>

          {teacher.artPhotos?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {teacher.artPhotos.map((photo, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img src={imgSrc(photo)} alt={`Artwork ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <p className="text-white text-xs font-semibold font-body truncate">{teacher.name}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-start justify-end p-2">
                    <button onClick={() => handleArtDelete(photo)} disabled={deletingPhoto === photo}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow disabled:opacity-50">
                      {deletingPhoto === photo ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 font-body">
              <Camera size={28} className="mb-2 opacity-25" />
              <p className="text-sm">No artwork uploaded yet.</p>
            </div>
          )}
        </div>

      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={4 / 3}
          title="Crop Artwork"
          onDone={handleCropDone}
          onCancel={() => { setCropSrc(null); setPendingFile(null); }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminTeacherProfile;