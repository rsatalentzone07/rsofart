import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  applicantName: z.string().min(2, 'Applicant name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.coerce.number().min(4, 'Age must be at least 4').max(80, 'Age must be realistic'),
  sex: z.enum(['male', 'female'], { required_error: 'Please select gender' }),
  category: z.enum(['SC', 'ST', 'BPL', 'OBC', 'GEN', 'Any other'], { required_error: 'Please select category' }),
  nationality: z.string().default('Indian'),
  school: z.string().optional(),
  studyingInClass: z.string().optional(),
  courseType: z.enum(['art', 'dance'], { required_error: 'Please select course type' }),
  subCourse: z.string().optional(),
  applyingForClass: z.string().min(1, 'Applying for class is required'),
  academicQualification: z.string().optional(),
  residentialAddress: z.string().min(5, 'Address is required'),
  occupation: z.string().optional(),
  phoneNo: z.string().min(10, 'Valid phone number required'),
});

const ART_SUB = ['Sub Junior Diploma', 'Junior Diploma', 'Senior Diploma', 'Master Diploma'];
const DANCE_SUB = ['Junior Diploma', 'Senior Diploma'];

const CLASS_OPTIONS = {
  'Sub Junior Diploma': ['Adhya', 'Madhya', 'Purna'],
  'Junior Diploma': ['Prarambhik 1', 'Prarambhik 2'],
  'Senior Diploma': ['1st Year', '2nd Year', '3rd Year','4th Year', '5th Year'],
  'Master Diploma': [ '6th Year', '7th Year'],
};

const AdmissionForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nationality: 'Indian', courseType: 'art' },
  });

  const watchedCourseType = watch('courseType');
  const watchedSubCourse = watch('subCourse');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '') formData.append(k, v);
      });

      if (photoFile) formData.append('photo', photoFile);

      await api.post('/admissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitted(true);
      reset();
      setPhotoFile(null);

    } catch {
      toast.error('Failed to submit form. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-md w-full text-center">
          <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />

          <h2 className="font-display text-2xl font-bold text-dark mb-3">
            Application Submitted!
          </h2>

          <p className="font-body text-gray-500 mb-6">
            Your admission form has been received. We will review your application and contact you shortly.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  const Field = ({ label, error, children, required }) => (
    <div>
      <label className="label">
        {label}
        {required && ' *'}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs mt-1 font-body">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-accent">

      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Admission Form
          </h1>

          <p className="font-body text-gray-300 text-lg">
            Rabindra School of Art — Session Enrollment
          </p>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">

          <div className="bg-primary/10 border-b border-primary/20 px-8 py-5">
            <p className="font-body text-sm text-gray-600">
              <strong className="text-primary">Affiliated:</strong>
              {' '}Pracheen Kala Kendra, Chandigarh (Regd. No. 5071)
              &nbsp;|&nbsp;
              <strong className="text-primary">Est.</strong> 2002
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 space-y-8"
          >

            {/* Personal Information */}
            <section>

              <h2 className="font-display text-xl font-bold text-primary border-b border-primary/20 pb-3 mb-5">
                Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                <Field
                  label="Applicant's Full Name"
                  error={errors.applicantName?.message}
                  required
                >
                  <input
                    {...register('applicantName')}
                    className="input-field"
                    placeholder="Full name as per records"
                  />
                </Field>

                <Field
                  label="Father's Name"
                  error={errors.fatherName?.message}
                  required
                >
                  <input
                    {...register('fatherName')}
                    className="input-field"
                    placeholder="Father's full name"
                  />
                </Field>

                <Field
                  label="Mother's Name"
                  error={errors.motherName?.message}
                >
                  <input
                    {...register('motherName')}
                    className="input-field"
                    placeholder="Mother's full name"
                  />
                </Field>

                <Field
                  label="Date of Birth"
                  error={errors.dateOfBirth?.message}
                  required
                >
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    className="input-field"
                  />
                </Field>

                <Field
                  label="Age"
                  error={errors.age?.message}
                  required
                >
                  <input
                    {...register('age')}
                    type="number"
                    className="input-field"
                    placeholder="Age in years"
                  />
                </Field>

                <Field
                  label="Sex"
                  error={errors.sex?.message}
                  required
                >
                  <select
                    {...register('sex')}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>

                <Field
                  label="Category"
                  error={errors.category?.message}
                  required
                >
                  <select
                    {...register('category')}
                    className="input-field"
                  >
                    <option value="">Select category</option>

                    {['GEN', 'OBC', 'SC', 'ST', 'BPL', 'Any other'].map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Nationality"
                  error={errors.nationality?.message}
                >
                  <input
                    {...register('nationality')}
                    className="input-field"
                    defaultValue="Indian"
                  />
                </Field>

              </div>
            </section>

            {/* Academic Information */}
            <section>

              <h2 className="font-display text-xl font-bold text-primary border-b border-primary/20 pb-3 mb-5">
                Academic Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                <Field
                  label="School / College Attending"
                  error={errors.school?.message}
                >
                  <input
                    {...register('school')}
                    className="input-field"
                    placeholder="Name of school or college"
                  />
                </Field>

                <Field
                  label="Currently Studying in Class"
                  error={errors.studyingInClass?.message}
                >
                  <input
                    {...register('studyingInClass')}
                    className="input-field"
                    placeholder="e.g. Class 8, B.A. 2nd Year"
                  />
                </Field>

                <Field
                  label="Course Type"
                  error={errors.courseType?.message}
                  required
                >
                  <select
                    {...register('courseType')}
                    onChange={e => {
                      setValue('courseType', e.target.value);
                      setValue('applyingForClass', '');
                      setValue('subCourse', '');
                    }}
                    className="input-field"
                  >
                    <option value="art">Art</option>
                    <option value="dance">Dance</option>
                  </select>
                </Field>

                <Field
                  label="Sub Course"
                  error={errors.subCourse?.message}
                >
                  <select
                    {...register('subCourse')}
                    className="input-field"
                    onChange={e => {
                      setValue('subCourse', e.target.value);
                      setValue('applyingForClass', '');
                    }}
                  >
                    <option value="">
                      Select sub-course (optional)
                    </option>

                    {(watchedCourseType === 'dance'
                      ? DANCE_SUB
                      : ART_SUB
                    ).map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Applying for Class"
                  error={errors.applyingForClass?.message}
                  required
                >
                  <select
                    {...register('applyingForClass')}
                    className="input-field"
                  >
                    <option value="">Select class</option>

                    {(CLASS_OPTIONS[watchedSubCourse] || []).map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Academic Qualification"
                  error={errors.academicQualification?.message}
                >
                  <input
                    {...register('academicQualification')}
                    className="input-field"
                    placeholder="Highest academic qualification"
                  />
                </Field>

              </div>
            </section>

            {/* Contact Information */}
            <section>

              <h2 className="font-display text-xl font-bold text-primary border-b border-primary/20 pb-3 mb-5">
                Contact Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                <div className="sm:col-span-2">
                  <Field
                    label="Residential Address"
                    error={errors.residentialAddress?.message}
                    required
                  >
                    <textarea
                      {...register('residentialAddress')}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Full residential address"
                    />
                  </Field>
                </div>

                <Field
                  label="Occupation"
                  error={errors.occupation?.message}
                >
                  <input
                    {...register('occupation')}
                    className="input-field"
                    placeholder="Your or guardian's occupation"
                  />
                </Field>

                <Field
                  label="Phone Number"
                  error={errors.phoneNo?.message}
                  required
                >
                  <input
                    {...register('phoneNo')}
                    className="input-field"
                    placeholder="Contact phone number"
                  />
                </Field>

              </div>
            </section>

            {/* Photo */}
            <section>

              <h2 className="font-display text-xl font-bold text-primary border-b border-primary/20 pb-3 mb-5">
                Passport Photo
              </h2>

              <div className="flex items-center gap-6">

                <div className="w-28 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-accent overflow-hidden">

                  {photoFile ? (
                    <img
                      src={URL.createObjectURL(photoFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center font-body px-2">
                      Photo Preview
                    </span>
                  )}

                </div>

                <div>

                  <label className="label">
                    Upload Passport-size Photo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setPhotoFile(e.target.files[0])}
                    className="block text-sm font-body text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20 cursor-pointer"
                  />

                  <p className="text-xs text-gray-400 mt-1 font-body">
                    Max 5MB, JPG/PNG format
                  </p>

                </div>
              </div>
            </section>

            {/* Declaration */}
            <div className="bg-accent rounded-xl p-5 text-sm font-body text-gray-600 leading-relaxed">

              <strong className="text-primary">
                Declaration:
              </strong>

              {' '}
              I hereby declare that all the information provided above is true and correct to the best of my knowledge. I agree to abide by all the rules and regulations of Rabindra School of Art.

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Admission Form
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;