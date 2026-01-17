import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/signin');
  };

  const activeRoute = location.pathname;

  const isActive = (route) => activeRoute.includes(route);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#12110e] text-[#e8dcc6] relative font-sans">

      {/* Sidebar - Mobile: Fixed full width or standard width with overlay */}
      <div className={`w-[280px] bg-[#1a1612] border-r border-[#393528]/30 flex flex-col fixed h-screen left-0 top-0 z-[1000] transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-[30px_20px] border-b border-[#393528]/30 bg-[#12110e]/50 backdrop-blur-md text-center flex flex-col items-center gap-4 relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffd700] to-[#b8860b] rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt blur"></div>
            <img
              src="/logo.jpg"
              alt="CHOX Kitchen"
              className="relative w-[80px] h-[80px] rounded-full border-2 border-[#12110e] object-cover shadow-xl"
            />
          </div>
          <div>
            <h2 className="m-0 text-xl font-bold tracking-[2px] uppercase bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#ffd700] bg-clip-text text-transparent">CHOX Admin</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#8b7a63] mt-1">Management Portal</p>
          </div>

          <button
            className="absolute top-4 right-4 md:hidden text-[#ffd700] text-2xl hover:rotate-90 transition-transform"
            onClick={toggleMobileMenu}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-[30px] px-[15px] overflow-y-auto space-y-2">
          <button
            className={`w-full p-[14px_20px] text-left cursor-pointer transition-all duration-300 text-[15px] rounded-[10px] font-medium flex items-center gap-4 group ${isActive('sales')
              ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700]'
              : 'text-[#8b7a63] hover:bg-[#ffd700]/5 hover:text-[#e8dcc6] hover:translate-x-1'
              }`}
            onClick={() => handleNavClick('/admin/reports/sales')}
          >
            <span className={`text-xl ${isActive('sales') ? 'text-[#ffd700]' : 'text-[#8b7a63] group-hover:text-[#ffd700]'}`}>📊</span>
            Sales Report
          </button>

          <button
            className={`w-full p-[14px_20px] text-left cursor-pointer transition-all duration-300 text-[15px] rounded-[10px] font-medium flex items-center gap-4 group ${isActive('orders')
              ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700]'
              : 'text-[#8b7a63] hover:bg-[#ffd700]/5 hover:text-[#e8dcc6] hover:translate-x-1'
              }`}
            onClick={() => handleNavClick('/admin/reports/orders')}
          >
            <span className={`text-xl ${isActive('orders') ? 'text-[#ffd700]' : 'text-[#8b7a63] group-hover:text-[#ffd700]'}`}>📦</span>
            Order Management
          </button>

          <button
            className={`w-full p-[14px_20px] text-left cursor-pointer transition-all duration-300 text-[15px] rounded-[10px] font-medium flex items-center gap-4 group ${isActive('inventory')
              ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700]'
              : 'text-[#8b7a63] hover:bg-[#ffd700]/5 hover:text-[#e8dcc6] hover:translate-x-1'
              }`}
            onClick={() => handleNavClick('/admin/reports/inventory')}
          >
            <span className={`text-xl ${isActive('inventory') ? 'text-[#ffd700]' : 'text-[#8b7a63] group-hover:text-[#ffd700]'}`}>📋</span>
            Inventory & Logs
          </button>

          <button
            className={`w-full p-[14px_20px] text-left cursor-pointer transition-all duration-300 text-[15px] rounded-[10px] font-medium flex items-center gap-4 group ${isActive('menu')
              ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700]'
              : 'text-[#8b7a63] hover:bg-[#ffd700]/5 hover:text-[#e8dcc6] hover:translate-x-1'
              }`}
            onClick={() => handleNavClick('/admin/reports/menu')}
          >
            <span className={`text-xl ${isActive('menu') ? 'text-[#ffd700]' : 'text-[#8b7a63] group-hover:text-[#ffd700]'}`}>🍽️</span>
            Menu Management
          </button>

          <button
            className={`w-full p-[14px_20px] text-left cursor-pointer transition-all duration-300 text-[15px] rounded-[10px] font-medium flex items-center gap-4 group ${isActive('settings')
              ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700]'
              : 'text-[#8b7a63] hover:bg-[#ffd700]/5 hover:text-[#e8dcc6] hover:translate-x-1'
              }`}
            onClick={() => handleNavClick('/admin/reports/settings')}
          >
            <span className={`text-xl ${isActive('settings') ? 'text-[#ffd700]' : 'text-[#8b7a63] group-hover:text-[#ffd700]'}`}>⚙️</span>
            Account Settings
          </button>
        </nav>

        <div className="p-5 border-t border-[#393528]/30">
          <button
            className="w-full p-[14px] bg-gradient-to-r from-[#2a2214] to-[#1a1612] text-[#e8dcc6] border border-[#393528] rounded-[10px] cursor-pointer text-[14px] font-semibold transition-all duration-300 hover:border-[#e74c3c] hover:text-[#e74c3c] hover:shadow-[0_0_15px_rgba(231,76,60,0.1)] flex items-center justify-center gap-2 group"
            onClick={handleLogout}
          >
            <span className="group-hover:text-[#e74c3c] transition-colors">🚪</span> Sign Out
          </button>
          <p className="text-center text-[10px] text-[#8b7a63] mt-4 opacity-50">© 2025 Chox Kitchen</p>
        </div>
      </div>

      {/* Mobile Header - Visible only on mobile/tablet */}
      <div className="md:hidden flex items-center justify-between p-[15px_20px] bg-[#1a1612] border-b border-[#393528]/30 fixed top-0 left-0 right-0 z-[999]">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-[#ffd700]" />
          <span className="text-[#ffd700] font-bold tracking-widest text-sm">ADMIN PANEL</span>
        </div>
        <button
          className="text-[#ffd700] text-2xl"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 md:ml-[280px] p-[20px] md:p-[40px] pt-[80px] md:pt-[40px] min-h-screen transition-all duration-300">
        <Outlet />
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[900] md:block hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
