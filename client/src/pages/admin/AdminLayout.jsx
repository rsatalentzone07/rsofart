import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Users, Image, Layout,
  BookOpen, ClipboardList, MessageSquare, LogOut, GraduationCap, Menu,
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.webp';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/students', label: 'Students', icon: <Users size={18} /> },
  { to: '/admin/teachers', label: 'Teachers', icon: <GraduationCap size={18} /> },
  { to: '/admin/courses', label: 'Courses', icon: <BookOpen size={18} /> },
  { to: '/admin/admissions', label: 'Admissions', icon: <ClipboardList size={18} /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <Image size={18} /> },
  { to: '/admin/banners', label: 'Banners', icon: <Layout size={18} /> },
  { to: '/admin/contacts', label: 'Contacts', icon: <MessageSquare size={18} /> },
];

const AdminLayout = ({ children, title }) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700/60">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Rabindra Art"
            className="w-10 h-10 rounded-xl object-contain bg-white/10 p-0.5"
          />
          <div>
            <h2 className="font-display text-white font-bold text-sm leading-tight">Rabindra Art</h2>
            <p className="text-gray-400 text-[11px] font-body">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="font-body text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-gray-700/60">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold font-display uppercase">
              {(admin?.name || admin?.email || 'A').charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 font-body">Logged in as</p>
            <p className="text-xs text-gray-300 font-body truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-900/50 hover:text-red-300 transition-all w-full font-body text-sm"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-gray-900 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg font-bold text-dark">{title}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xs font-bold font-display uppercase">
                {(admin?.name || admin?.email || 'A').charAt(0)}
              </span>
            </div>
            <span className="text-sm font-body text-gray-400 hidden sm:block">
              {admin?.name || 'Admin'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;