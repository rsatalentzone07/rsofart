import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import logo from '../assets/logo.webp';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/teachers', label: 'Teachers' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Top bar */}
      <div className="bg-primary text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="font-body hidden sm:block">Affiliated with Pracheen Kala Kendra, Chandigarh (Regd. No. 5071)</span>
          <div className="flex items-center gap-4 ml-auto">
            <a href="tel:7903495153" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone size={13} />
              <span>7903495153</span>
            </a>
            <a href="tel:8797288121" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone size={13} />
              <span>8797288121</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
  src={logo}
  alt="Rabindra School of Art Logo"
  className="w-14 h-14 object-contain"
/>
            <div>
              <h1 className="font-display text-primary font-bold text-base leading-tight">Rabindra School of Art</h1>
              <p className="font-body text-gray-500 text-xs">Est. 2002</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
                    isActive ? 'text-primary bg-accent' : 'text-gray-700 hover:text-primary hover:bg-accent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/admission" className="ml-2 btn-primary text-sm py-2 px-5">
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-body font-medium transition-all ${
                  isActive ? 'text-primary bg-accent' : 'text-gray-700 hover:text-primary hover:bg-accent'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/admission" className="block btn-primary text-center mt-2">
            Apply Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
