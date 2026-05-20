import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Upload, Trash2, User, Camera, CheckCircle,
  XCircle, Pencil, Save, X,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const COURSE_TYPES = ['art', 'dance'];
const SUB_COURSES = {
  art: ['Drawing', 'Painting', 'Sculpture', 'Craft'],
  dance: ['Bharatnatyam', 'Kathak', 'Folk', 'Western'],
};
const CLASSES = ['Sub Junior', 'Junior', 'Senior', 'Diploma', 'Master Diploma'];

/* ── Info card ─────────────────────────────────────────────────── */
const InfoCard = ({ label, children }) => (
  <div className="flex flex-col gap-1 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body">{label}</span>
    {children}
  </div>
);

/* ── Main ──────────────────────────────────────────────────────── */
const AdminStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const [fees, setFees]                 = useState([]);

  const [editing, setEditing]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [form, setForm]                 = useState({});
  const [photoFile, setPhotoFile]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchStudent = () => {
    api.get(`/students/${id}`)
      .then(r => {
        setStudent(r.data);
        setFees(r.data.feesRecord || []);
        setForm({
          name:          r.data.name          || '',
          age:           r.data.age           || '',
          class:         r.data.class         || '',
          courseType:    r.data.courseType    || 'art',
          subCourse:     r.data.subCourse     || '',
          guardianName:  r.data.guardianName  || '',
          phone:         r.data.phone         || '',
          email:         r.data.email         || '',
          admissionDate: r.data.admissionDate
            ? new Date(r.data.admissionDate).toISOString().split('T')[0]
            : '',
        });
      })
      .catch(() => toast.error('Failed to load student'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudent(); }, [id]);

  const imgSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'courseType' ? { subCourse: '' } : {}),
    }));
  };

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
      await api.put(`/students/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Student updated!');
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchStudent();
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
    if (!window.confirm(`Delete student "${student.name}"?`)) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      navigate('/admin/students');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleArtUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('artPhoto', file);
    try {
      await api.post(`/students/${id}/art`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Art photo uploaded!');
      fetchStudent();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleArtDelete = async (photoUrl) => {
    if (!window.confirm('Delete this artwork?')) return;
    setDeletingPhoto(photoUrl);
    try {
      await api.delete(`/students/${id}/art`, { data: { photoUrl } });
      toast.success('Artwork deleted');
      fetchStudent();
    } catch {
      toast.error('Failed to delete artwork');
    } finally {
      setDeletingPhoto(null);
    }
  };

  const handleFeeToggle = async (monthIndex) => {
    const updatedFees = fees.map((f, i) =>
      i === monthIndex ? { ...f, paid: !f.paid } : f
    );
    setFees(updatedFees);
    try {
      await api.put(`/students/${id}`, { feesRecord: updatedFees });
      toast.success('Fee record updated');
    } catch {
      toast.error('Failed to update fees');
      setFees(fees);
    }
  };

  if (loading) return (
    <AdminLayout title="Student Profile">
      <div className="flex justify-center items-center h-64">
        <div className="w-9 h-9 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  if (!student) return (
    <AdminLayout title="Student Profile">
      <p className="text-gray-500 font-body">Student not found.</p>
    </AdminLayout>
  );

  const totalPaid = fees.filter(f => f.paid).reduce((s, f) => s + f.tuitionFees + f.admissionFees + f.fine, 0);
  const totalDue  = fees.filter(f => !f.paid).reduce((s, f) => s + f.tuitionFees + f.admissionFees + f.fine, 0);
  const currentPhoto = photoPreview || (student.photo ? imgSrc(student.photo) : null);

  return (
    <AdminLayout title="Student Profile">
      <div className="max-w-5xl space-y-5">

        {/* ── Top bar ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-body text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to Students
          </button>

          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm font-body font-medium text-primary border border-primary/25 hover:border-primary/60 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
              >
                <Pencil size={13} /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 text-sm font-body text-gray-500 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm font-body font-medium bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-60"
                >
                  {saving
                    ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Save size={13} />}
                  Save
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm font-body text-red-500 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* ── Profile card ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Hero banner — avatar + name live INSIDE */}
          <div className="bg-primary px-7 py-6 flex items-center gap-5 relative">
            {/* Course badge */}
            {!editing && (
              <span className="absolute top-4 right-5 text-[11px] font-semibold px-3 py-1 rounded-full font-body capitalize bg-white/15 text-white border border-white/25">
                {student.courseType}
              </span>
            )}

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 bg-white/10">
                {currentPhoto ? (
                  <img src={currentPhoto} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={30} className="text-white/50" />
                  </div>
                )}
              </div>
              {editing && (
                <label className="absolute -bottom-1 -right-1 bg-white text-primary rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-50 transition-colors">
                  <Camera size={12} />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </div>

            {/* Name + subtitle */}
            <div className="min-w-0 flex-1">
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="bg-white/15 border border-white/30 text-white placeholder-white/50 rounded-lg px-3 py-1.5 text-lg font-bold font-display w-full max-w-xs outline-none focus:bg-white/20 mb-1"
                  placeholder="Student name"
                />
              ) : (
                <h2 className="font-display text-xl font-bold text-white truncate">{student.name}</h2>
              )}
              <p className="text-sm text-white/60 font-body mt-0.5">
                {editing ? form.class : student.class}
                {(editing ? form.subCourse : student.subCourse) && (
                  <> · {editing ? form.subCourse : student.subCourse}</>
                )}
              </p>
            </div>
          </div>

          <div className="px-7 pb-7 pt-6">
            {/* ── View mode ──────────────────────────────────────── */}
            {!editing ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body mb-3">Personal Info</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                  {[
                    ['Age',            student.age ? `${student.age} years` : '—'],
                    ['Guardian',       student.guardianName || '—'],
                    ['Phone',          student.phone        || '—'],
                    ['Email',          student.email        || '—'],
                    ['Admission Date', student.admissionDate
                      ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'],
                  ].map(([label, val]) => (
                    <InfoCard key={label} label={label}>
                      <p className="text-sm font-semibold text-gray-800 font-body">{val}</p>
                    </InfoCard>
                  ))}
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body mb-3">Course Details</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    ['Course Type', student.courseType],
                    ['Sub Course',  student.subCourse || '—'],
                    ['Class',       student.class     || '—'],
                  ].map(([label, val]) => (
                    <InfoCard key={label} label={label}>
                      <p className="text-sm font-semibold text-gray-800 font-body capitalize">{val}</p>
                    </InfoCard>
                  ))}
                </div>
              </>
            ) : (
              /* ── Edit mode ─────────────────────────────────────── */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-body">
                {[
                  { label: 'Age', name: 'age', type: 'number', placeholder: 'Age' },
                  { label: 'Guardian Name', name: 'guardianName', placeholder: 'Guardian name' },
                  { label: 'Phone', name: 'phone', placeholder: 'Phone' },
                  { label: 'Email', name: 'email', type: 'email', placeholder: 'Email' },
                  { label: 'Admission Date', name: 'admissionDate', type: 'date' },
                ].map(f => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type || 'text'}
                      value={form[f.name]}
                      onChange={handleFormChange}
                      placeholder={f.placeholder}
                      className="input-field py-2 text-sm"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Course Type</label>
                  <select name="courseType" value={form.courseType} onChange={handleFormChange} className="input-field py-2 text-sm capitalize">
                    {COURSE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Sub Course</label>
                  <select name="subCourse" value={form.subCourse} onChange={handleFormChange} className="input-field py-2 text-sm">
                    <option value="">Select sub-course</option>
                    {(SUB_COURSES[form.courseType] || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Class</label>
                  <select name="class" value={form.class} onChange={handleFormChange} className="input-field py-2 text-sm">
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Fee Record ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-dark">Fee Record</h3>
            <div className="flex gap-4 text-xs font-body">
              <span className="flex items-center gap-1.5 font-semibold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Paid ₹{totalPaid.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Due ₹{totalDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  {['Month', 'Admission', 'Tuition', 'Fine', 'Total', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-body whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fees.map((fee, i) => {
                  const total = fee.admissionFees + fee.tuitionFees + fee.fine;
                  return (
                    <tr key={fee.month} className={`border-b border-gray-50 last:border-0 ${fee.paid ? 'bg-green-50/20' : ''}`}>
                      <td className="px-5 py-3 font-body font-semibold text-gray-800 text-sm">{fee.month}</td>
                      <td className="px-5 py-3 font-body text-gray-500 text-sm">₹{fee.admissionFees}</td>
                      <td className="px-5 py-3 font-body text-gray-500 text-sm">₹{fee.tuitionFees}</td>
                      <td className="px-5 py-3 font-body text-gray-500 text-sm">₹{fee.fine}</td>
                      <td className="px-5 py-3 font-body font-semibold text-gray-800 text-sm">₹{total}</td>
                      <td className="px-5 py-3">
                        {fee.paid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-body text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            <CheckCircle size={11} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-body text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                            <XCircle size={11} /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleFeeToggle(i)}
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full font-body transition-all border
                            ${fee.paid
                              ? 'border-red-200 text-red-500 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          {fee.paid ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Artwork ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-bold text-dark">
                Artwork
                {student.artPhotos?.length > 0 && (
                  <span className="ml-2 text-xs font-body font-normal text-gray-400">({student.artPhotos.length})</span>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">Photos uploaded by or for this student</p>
            </div>
            <label className={`flex items-center gap-1.5 btn-primary text-sm py-2 px-4 rounded-lg cursor-pointer font-body ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {uploading
                ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera size={14} />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleArtUpload} disabled={uploading} />
            </label>
          </div>

          {student.artPhotos?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {student.artPhotos.map((photo, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={imgSrc(photo)}
                    alt={`Artwork ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2
                                  translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <p className="text-white text-xs font-semibold font-body truncate">{student.name}</p>
                    <p className="text-gray-300 text-[10px] font-body truncate">
                      {[student.subCourse, student.age ? `Age ${student.age}` : ''].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-start justify-end p-2">
                    <button
                      onClick={() => handleArtDelete(photo)}
                      disabled={deletingPhoto === photo}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow disabled:opacity-50"
                      title="Delete artwork"
                    >
                      {deletingPhoto === photo
                        ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={13} />}
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
    </AdminLayout>
  );
};

export default AdminStudentProfile;