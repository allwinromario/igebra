'use client';

import { useState, useEffect } from 'react';
import { FiBook, FiChevronLeft, FiChevronRight, FiSettings, FiSun, FiMoon, FiDroplet, FiLayout } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedSubject?: string;
  onSubjectSelect: (subject: string) => void;
}

const subjects = [
  { id: 'mathematics', name: 'Mathematics', icon: '∑' },
  { id: 'physics', name: 'Physics', icon: '⚛' },
  { id: 'chemistry', name: 'Chemistry', icon: '⚗' },
  { id: 'biology', name: 'Biology', icon: '🧬' },
  { id: 'computer-science', name: 'Computer Science', icon: '💻' },
  { id: 'english', name: 'English', icon: '📚' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'geography', name: 'Geography', icon: '🌍' },
];

const colorThemes = [
  { id: 'blue', name: 'Blue', class: 'from-blue-600 to-purple-600' },
  { id: 'green', name: 'Green', class: 'from-green-600 to-teal-600' },
  { id: 'red', name: 'Red', class: 'from-red-600 to-pink-600' },
  { id: 'orange', name: 'Orange', class: 'from-orange-600 to-red-600' },
];

const sidebarThemes = [
  { 
    id: 'default', 
    name: 'Default', 
    bgClass: 'bg-white dark:bg-gray-800',
    previewClass: 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900'
  },
  { 
    id: 'blue', 
    name: 'Blue', 
    bgClass: 'bg-blue-50 dark:bg-blue-900/90',
    previewClass: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
  },
  { 
    id: 'purple', 
    name: 'Purple', 
    bgClass: 'bg-purple-50 dark:bg-purple-900/90',
    previewClass: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
  },
  { 
    id: 'green', 
    name: 'Green', 
    bgClass: 'bg-green-50 dark:bg-green-900/90',
    previewClass: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
  },
  { 
    id: 'teal', 
    name: 'Teal', 
    bgClass: 'bg-teal-50 dark:bg-teal-900/90',
    previewClass: 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800'
  },
  { 
    id: 'rose', 
    name: 'Rose', 
    bgClass: 'bg-rose-50 dark:bg-rose-900/90',
    previewClass: 'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-800'
  },
  { 
    id: 'amber', 
    name: 'Amber', 
    bgClass: 'bg-amber-50 dark:bg-amber-900/90',
    previewClass: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800'
  },
  { 
    id: 'indigo', 
    name: 'Indigo', 
    bgClass: 'bg-indigo-50 dark:bg-indigo-900/90',
    previewClass: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800'
  },
];

export default function Sidebar({ isOpen, onToggle, selectedSubject, onSubjectSelect }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSidebarTheme, setSelectedSidebarTheme] = useState('default');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedColor = localStorage.getItem('selectedColor');
    const savedSidebarTheme = localStorage.getItem('sidebarTheme');
    if (savedColor) setSelectedColor(savedColor);
    if (savedSidebarTheme) setSelectedSidebarTheme(savedSidebarTheme);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('selectedColor', selectedColor);
    localStorage.setItem('sidebarTheme', selectedSidebarTheme);
  }, [selectedColor, selectedSidebarTheme]);

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggle]);

  const currentSidebarTheme = sidebarThemes.find(t => t.id === selectedSidebarTheme) || sidebarThemes[0];

  return (
    <div
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 ${
        isOpen ? 'w-72' : 'w-20'
      } ${currentSidebarTheme.bgClass} backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-200"
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <FiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar Header */}
      <div className="p-4">
        <div className="flex items-center mb-8">
          <FiBook className="w-6 h-6 text-blue-600" />
          {isOpen && (
            <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
              Subjects
            </h2>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSubjectSelect(subject.name)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                selectedSubject === subject.name
                  ? `bg-gradient-to-r ${colorThemes.find(c => c.id === selectedColor)?.class || colorThemes[0].class} text-white shadow-lg`
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={subject.name}
            >
              <span className={`${isOpen ? 'w-6 text-lg' : 'w-full text-2xl'} text-center transition-all duration-300`}>
                {subject.icon}
              </span>
              {isOpen && (
                <span className="ml-3 truncate">{subject.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <FiMoon className="w-6 h-6" />
            ) : (
              <FiSun className="w-6 h-6" />
            )}
            {isOpen && (
              <span className="ml-3">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            )}
          </button>

          {/* Color Picker Toggle */}
          {isOpen && (
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FiDroplet className="w-6 h-6" />
              <span className="ml-3">Customize Colors</span>
            </button>
          )}

          {/* Color Picker Panel */}
          {isOpen && showColorPicker && (
            <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Sidebar Colors */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FiLayout className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-800 dark:text-white">Sidebar Color</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sidebarThemes.map((sTheme) => (
                    <button
                      key={sTheme.id}
                      onClick={() => setSelectedSidebarTheme(sTheme.id)}
                      className={`relative h-12 rounded-lg transition-all duration-200 ${sTheme.previewClass} ${
                        selectedSidebarTheme === sTheme.id
                          ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-95'
                          : 'hover:scale-95'
                      }`}
                      title={sTheme.name}
                    >
                      {selectedSidebarTheme === sTheme.id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Colors */}
              <div>
                <div className="flex items-center mb-2">
                  <FiDroplet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-800 dark:text-white">Accent Color</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {colorThemes.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedColor === color.id
                          ? `bg-gradient-to-r ${color.class} text-white shadow-md`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Button */}
          <button
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Settings"
          >
            <FiSettings className="w-6 h-6" />
            {isOpen && <span className="ml-3">Settings</span>}
          </button>
        </div>
      </div>
    </div>
  );
}