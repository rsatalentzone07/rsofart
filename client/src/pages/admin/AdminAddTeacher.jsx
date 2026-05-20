import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  courseType: z.enum(['art', 'dance', 'music', 'yoga']),
  qualification: z.string().optional(),
  workExperience: z.string().optional(),
  area: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

const AdminAddTeacher = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { courseType: 'art' },
  });

  useEffect(() => {
    if (isEdit) {
      api.get('/teachers').then(r => {
        const teacher = r.data.find(t => t._id === id);
        if (teacher) {
          reset({
            name: teacher.name,
            courseType: teacher.courseType,
            qualification: teacher.qualification || '',
            workExperience: teacher.workExperience || '',
            area: teacher.area || '',
            email: teacher.email || '',
          });
          setSkills(teacher.skills || []);
          setExistingPhoto(teacher.photo || '');
        }
      }).catch(() => toast.error('Failed to load teacher data'));
    }
  }, [id, isEdit, reset]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill));

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') formData.append(k, v); });
    skills.forEach(s => formData.append('skills', s));
    if (photo) formData.append('photo', photo);

    try {
      if (isEdit) {
        await api.put(`/teachers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Teacher updated!');
      } else {
        await api.post('/teachers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Teacher added!');
      }
      navigate('/admin/teachers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save teacher');
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  const Field = ({ label, error, children, required, className = '' }) => (
    <div className={className}>
      <label className="label">{label}{required && ' *'}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 font-body">{error}</p>}
    </div>
  );

  return (
    <AdminLayout title={isEdit ? 'Edit Teacher' : 'Add Teacher'}>
      <div className="max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-body text-sm mb-6 hover:underline">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-xl shadow-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" error={errors.name?.message} required className="sm:col-span-2">
                <input {...register('name')} className="input-field" placeholder="Teacher's full name" />
              </Field>
              <Field label="Course Type" error={errors.courseType?.message} required>
                <select {...register('courseType')} className="input-field">
                  <option value="art">Art</option>
                  <option value="dance">Dance</option>
               
                </select>
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder="teacher@email.com" />
              </Field>
              <Field label="Qualification" error={errors.qualification?.message} className="sm:col-span-2">
                <input {...register('qualification')} className="input-field" placeholder="e.g. MFA, Sangeet Visharad" />
              </Field>
              <Field label="Work Experience" error={errors.workExperience?.message} className="sm:col-span-2">
                <input {...register('workExperience')} className="input-field" placeholder="e.g. 10 years of teaching classical dance" />
              </Field>
              <Field label="Area / Branch" error={errors.area?.message} className="sm:col-span-2">
                <input {...register('area')} className="input-field" placeholder="e.g. Main Branch, Jamshedpur" />
              </Field>
            </div>

            {/* Skills */}
            <div>
              <label className="label">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="input-field flex-1 py-2"
                  placeholder="Type a skill and press Enter or Add"
                />
                <button type="button" onClick={addSkill} className="btn-secondary py-2 px-4 text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-body">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-dark ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="label">Teacher Photo</label>
              <div className="flex items-center gap-5 mt-1">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 bg-accent overflow-hidden flex items-center justify-center">
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover rounded-full" />
                  ) : existingPhoto ? (
                    <img src={existingPhoto.startsWith('http') ? existingPhoto : `${API_BASE}${existingPhoto}`} alt="existing" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-gray-400 text-xs font-body">Photo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPhoto(e.target.files[0])}
                  className="text-sm font-body text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Teacher' : 'Add Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddTeacher;
