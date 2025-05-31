'use client';

import { useTheme } from '../../context/ThemeContext';
import BootstrapClient from '../BootstrapClient'; // Adjust path
import { BsSun, BsMoon, BsList, BsX, BsBell } from 'react-icons/bs';
import Image from 'next/image';

export default function TopNavbar({ isSidebarOpen, toggleSidebar, isDesktop }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const buttonStyle = isDark ? 'btn-outline-light' : 'btn-outline-secondary';
  const dropdownMenu = isDark
    ? 'dropdown-menu dropdown-menu-end bg-dark text-light border border-secondary'
    : 'dropdown-menu dropdown-menu-end bg-white text-dark shadow-sm border border-light-subtle';

  return (
    <nav
      className={`navbar sticky-top border-bottom px-2 py-2 ${isDark ? 'bg-dark text-light' : 'text-dark'}`}
      style={{
        zIndex: 1040,
        backgroundColor: isDark ? '#121212' : '#eaf1f1',
        boxShadow: isDark
          ? '0 1px 3px rgba(255, 255, 255, 0.05)'
          : '0 1px 6px rgba(0, 0, 0, 0.1)',
        transition: 'margin-left 0.3s ease',
        marginLeft: isSidebarOpen && isDesktop ? '250px' : '0',
        marginBottom: '16px',
        height: 'auto',
      }}
    >
      <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
        
        {/* Left: Sidebar Toggle */}
        <div className="d-flex align-items-center">
          <button
            className={`btn ${buttonStyle} d-flex align-items-center gap-2 px-3 py-1 rounded-3`}
            onClick={toggleSidebar}
            style={{ fontSize: '0.9rem' }}
          >
            {isSidebarOpen ? <BsX size={20} /> : <BsList size={20} />}
            <span className="d-none d-sm-inline">{isSidebarOpen ? 'Hide' : 'Menu'}</span>
          </button>
        </div>

        {/* Center: Page Title */}
        <div className="flex-grow-1 text-center">
          <h6 className="m-0 fw-semibold text-truncate" style={{ letterSpacing: '0.03em' }}>
            📊 Invoice Dashboard
          </h6>
        </div>

        {/* Right: Buttons */}
        <div className="d-flex align-items-center gap-2">
          {/* Theme Toggle */}
          <button
            className={`btn ${buttonStyle} d-flex align-items-center gap-2 px-2 py-1 rounded-3`}
            onClick={toggleTheme}
            style={{ fontSize: '0.9rem' }}
          >
            {isDark ? <BsSun size={18} /> : <BsMoon size={18} />}
            <span className="d-none d-md-inline">{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>

          {/* Notification Dropdown */}
          <div className="dropdown">
            <button
              className={`btn ${buttonStyle} dropdown-toggle px-2 py-1 rounded-3`}
              type="button"
              id="notificationDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <BsBell size={18} />
            </button>
            <ul className={dropdownMenu} aria-labelledby="notificationDropdown">
              <li><span className="dropdown-item-text">🔔 No new notifications</span></li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className={`btn ${buttonStyle} dropdown-toggle d-flex align-items-center gap-2 px-2 py-1 rounded-3`}
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: '0.9rem' }}
            >
              <Image
                src="/logo.png"
                alt="User Avatar"
                width={28}
                height={28}
                className="rounded-circle border border-light-subtle bg-light"
              />
              <span className="d-none d-md-inline">Fahad</span>
            </button>
            <ul className={dropdownMenu} aria-labelledby="profileDropdown">
              <li><a className="dropdown-item" href="#">👤 Profile</a></li>
              <li><a className="dropdown-item" href="#">⚙️ Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">🚪 Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
