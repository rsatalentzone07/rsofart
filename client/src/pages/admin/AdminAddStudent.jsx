import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  age: z.coerce.number().min(4).max(80),
  class: z.string().min(1, 'Class required'),
  courseType: z.enum(['art', 'dance']),
  subCourse: z.string().optional(),
  guardianName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  admissionDate: z.string().optional(),
});

const ART_CLASSES = ['Adhya','Madhya','Purna','Prarambhik 1','Prarambhik 2','1st Year','2nd Year','3rd Year','4th Year','5th Year','6th Year','7th Year'];
const DANCE_CLASSES = ['Junior Diploma','Senior Diploma'];
const ART_SUB = ['Sub Junior Diploma','Junior Diploma','Senior Diploma','Master Diploma'];
const DANCE_SUB = ['Junior Diploma','Senior Diploma'];

const AdminAddStudent = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [courseType, setCourseType] = useState('art');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { courseType: 'art', admissionDate: new Date().toISOString().split('T')[0] },
  });

  const watchedCourseType = watch('courseType');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') formData.append(k, v); });
      if (photo) formData.append('photo', photo);
      const res = await api.post('/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Student added successfully!');
      navigate(`/admin/students/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    }
  };

  const Field = ({ label, error, children, required, className = '' }) => (
    <div className={className}>
      <label className="label">{label}{required && ' *'}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 font-body">{error}</p>}
    </div>
  );

  return (
    <AdminLayout title="Add Student">
      <div className="max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-body text-sm mb-6 hover:underline">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-xl shadow-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" error={errors.name?.message} required className="sm:col-span-2">
                <input {...register('name')} className="input-field" placeholder="Student's full name" />
              </Field>
              <Field label="Age" error={errors.age?.message} required>
                <input {...register('age')} type="number" className="input-field" placeholder="Age" />
              </Field>
              <Field label="Admission Date" error={errors.admissionDate?.message}>
                <input {...register('admissionDate')} type="date" className="input-field" />
              </Field>
              <Field label="Course Type" error={errors.courseType?.message} required>
                <select {...register('courseType')} onChange={e => { setValue('courseType', e.target.value); setValue('class', ''); setValue('subCourse', ''); }} className="input-field">
                  <option value="art">Art</option>
                  <option value="dance">Dance</option>
                </select>
              </Field>
              <Field label="Sub Course" error={errors.subCourse?.message}>
                <select {...register('subCourse')} className="input-field">
                  <option value="">Select sub-course</option>
                  {(watchedCourseType === 'art' ? ART_SUB : DANCE_SUB).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Class" error={errors.class?.message} required className="sm:col-span-2">
                <select {...register('class')} className="input-field">
                  <option value="">Select class</option>
                  {(watchedCourseType === 'art' ? ART_CLASSES : DANCE_CLASSES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Guardian & Contact */}
            <div className="border-t border-gray-100 pt-6 grid sm:grid-cols-2 gap-5">
              <Field label="Guardian Name" error={errors.guardianName?.message}>
                <input {...register('guardianName')} className="input-field" placeholder="Parent/Guardian name" />
              </Field>
              <Field label="Phone Number" error={errors.phone?.message}>
                <input {...register('phone')} className="input-field" placeholder="Contact number" />
              </Field>
              <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
                <input {...register('email')} type="email" className="input-field" placeholder="Email address (optional)" />
              </Field>
            </div>

            {/* Photo */}
            <div className="border-t border-gray-100 pt-6">
              <label className="label">Student Photo</label>
              <div className="flex items-center gap-6 mt-1">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-accent overflow-hidden">
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center font-body">Photo</span>
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
                {isSubmitting ? 'Saving...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddStudent;
