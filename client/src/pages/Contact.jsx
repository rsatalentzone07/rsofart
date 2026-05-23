import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Award, Users, BookOpen, MapPin, ArrowRight, Star, Phone } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required').or(z.literal('')).optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/contacts', data);
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="font-body text-gray-300 text-lg">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Get In Touch</h2>
            <p className="font-body text-gray-600 mb-8 leading-relaxed">
              Have questions about admissions, courses, or schedules? Reach out to us and our team will be happy to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-dark mb-1">Phone Numbers</h3>
                  <a href="tel:7903495153" className="block font-body text-gray-600 hover:text-primary transition-colors">7903495153</a>
                  <a href="tel:8797288121" className="block font-body text-gray-600 hover:text-primary transition-colors">8797288121</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-dark mb-1">Our Branches</h3>
                  <p className="font-body text-gray-600">Main Branch — Jamshedpur, Jharkhand</p>
                  <p className="font-body text-gray-600">Branch 2 — Jamshedpur, Jharkhand</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-dark mb-1">Affiliation</h3>
                  <p className="font-body text-gray-600">Pracheen Kala Kendra, Chandigarh</p>
                  <p className="font-body text-gray-500 text-sm">Regd. No. 5071</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-primary/10 border border-primary/20 rounded-xl p-6">
              <h3 className="font-display font-semibold text-primary mb-2">Office Hours</h3>
              <div className="font-body text-gray-600 space-y-1 text-sm">
                <div className="flex justify-between"><span>Monday – Saturday</span><span className="font-semibold">9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="font-semibold">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label">Full Name *</label>
                <input {...register('name')} className="input-field" placeholder="Your full name" />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-body">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Email Address</label>
                <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Phone Number *</label>
                <input {...register('phone')} className="input-field" placeholder="Your phone number" />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-body">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea {...register('message')} rows={5} className="input-field resize-none" placeholder="Your message..." />
                {errors.message && <p className="text-red-500 text-xs mt-1 font-body">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
