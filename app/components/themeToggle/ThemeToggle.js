'use client';

import { useTheme } from './ThemeContext'; // adjust path as needed

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
