import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Heart } from 'lucide-react';
import logo from '../assets/logo.webp';
const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
  src={logo}
  alt="Rabindra School of Art Logo"
  className="w-14 h-14 object-contain"
/>
              <div>
                <h3 className="font-display text-white font-bold text-lg">Rabindra School of Art</h3>
                <p className="text-gray-400 text-xs">Established 2002</p>
              </div>
            </div>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-4">
              Nurturing artistic excellence since 2002, Rabindra School of Art offers comprehensive courses in Art and Dance. Affiliated with Pracheen Kala Kendra, Chandigarh (Regd. No. 5071).
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:7903495153" className="flex items-center gap-2 text-sm hover:text-secondary transition-colors">
                <Phone size={14} className="text-secondary" />
                7903495153
              </a>
              <a href="tel:8797288121" className="flex items-center gap-2 text-sm hover:text-secondary transition-colors">
                <Phone size={14} className="text-secondary" />
                8797288121
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/courses', label: 'Courses' },
                { to: '/teachers', label: 'Our Teachers' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/admission', label: 'Admission Form' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-secondary transition-colors flex items-center gap-2">
                    <span className="text-secondary">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-display text-white font-semibold text-lg mb-4">Our Branches</h4>
            <div className="space-y-4 font-body text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Main Branch</p>
                  <p className="text-gray-400">Jamshedpur, Jharkhand</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Branch 2</p>
                  <p className="text-gray-400">Jamshedpur, Jharkhand</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-body text-white text-sm font-semibold mb-2">Courses Offered</h5>
              <div className="flex flex-wrap gap-2">
                {['Art', 'Dance'].map(c => (
                  <span key={c} className="text-xs bg-primary/30 text-secondary border border-primary/30 px-2 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-gray-500 text-sm">
            © {new Date().getFullYear()} Rabindra School of Art. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-body text-gray-500 text-sm">
              Affiliated with Pracheen Kala Kendra, Chandigarh
            </p>
            <Link
              to="/admin/login"
              className="font-body text-gray-600 text-xs hover:text-secondary transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
