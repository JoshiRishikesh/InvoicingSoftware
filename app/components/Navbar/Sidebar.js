'use client';
import Link from 'next/link'; // At the top of your file

import { useTheme } from '../../context/ThemeContext';
import {
  BsSpeedometer2,
  BsFilePlus,
  BsCalendar3,
  BsTruck,
  BsFileEarmarkText,
  BsPersonPlus,
  BsUnlock,
  BsPeople,
} from 'react-icons/bs';

export default function Sidebar({ isOpen }) {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const linkTextColor = isDark ? 'text-white' : 'text-dark';
  const borderClass = isDark ? 'border-secondary' : 'border-light-subtle';
  const hoverClass = isDark ? 'hover-dark' : 'hover-light';

  return (
    <div
      className={`position-fixed top-0 start-0 h-100 shadow-sm border-end ${borderClass}`}
      style={{
        width: isOpen ? '250px' : '0',
        overflowX: 'hidden',
        transition: 'width 0.3s ease',
        zIndex: 999,
        backgroundColor: isDark ? '#121212' : '#eaf1f1', // soft professional background
        color: isDark ? '#fff' : '#2c3e50',
      }}
    >
      {isOpen && (
        <div className="p-4 d-flex flex-column gap-4 h-100">
          {/* Sidebar Title */}
          <h5 className="fw-bold mb-3 fs-5 border-bottom pb-2" style={{ letterSpacing: '0.05em' }}>
            📋 Invoice Dashboard
          </h5>

          {/* Navigation Links */}

            <ul className="nav flex-column gap-2">
              {[
                { icon: BsSpeedometer2, label: 'Dashboard', href: '/' },
                { icon: BsFilePlus, label: 'Create New Invoice', href: '/pages/newInvoice' },
                { icon: BsCalendar3, label: 'Calendar', href: '/pages/calendar' },
                { icon: BsFileEarmarkText, label: 'All Invoices', href: '/pages/allInvoices' },
                { icon: BsTruck, label: 'Delivery Status', href: '/pages/deliveryStatus' },
                { icon: BsPeople, label: 'All Members', href: '/pages/allMembers' },
                { icon: BsPersonPlus, label: 'Add Member', href: '/pages/addMember' },
                { icon: BsUnlock, label: 'Update Access', href: '/pages/updateAccess' },
              ].map(({ icon: Icon, label, href }) => (
                <li className="nav-item" key={label}>
                  <Link
                    href={href}
                    className={`nav-link d-flex align-items-center gap-3 rounded px-3 py-2 fw-medium ${linkTextColor} ${hoverClass}`}
                    style={{
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px',
                    }}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>


          {/* Footer Spacer */}
          <div className="mt-auto small opacity-75 px-2 text-center">
            &copy; {new Date().getFullYear()} Accessly
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-light:hover {
          background-color: #d6eaf8; /* Soft sky blue */
          color: #1a252f !important;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        .hover-dark:hover {
          background-color: #343a40;
          color: #fff !important;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
        }
        .nav-link {
          user-select: none;
        }
      `}</style>
    </div>
  );
}
