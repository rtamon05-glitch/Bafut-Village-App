import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../constants';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card bg-white/90 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Area */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleNavClick('HOME')}
            >
              <div className="w-10 h-10 bg-[#6A0F1A] rounded-lg flex items-center justify-center text-white mr-3 shadow-md">
                <Globe size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0B2D6B] tracking-tight leading-none">
                  BAFUT VILLAGE AI
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Heritage & Intelligence
                </p>
              </div>
            </div>

            {/* Desktop Nav (Partial) */}
            <div className="hidden md:flex space-x-1">
               {/* Quick links for Desktop */}
               <button onClick={() => handleNavClick('HOME')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'HOME' ? 'text-[#6A0F1A] bg-red-50' : 'text-gray-600 hover:text-[#0B2D6B]'}`}>Home</button>
               <button onClick={() => handleNavClick('NJANGI')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'NJANGI' ? 'text-[#6A0F1A] bg-red-50' : 'text-gray-600 hover:text-[#0B2D6B]'}`}>Njangi</button>
               <button onClick={() => handleNavClick('MARKETPLACE')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'MARKETPLACE' ? 'text-[#6A0F1A] bg-red-50' : 'text-gray-600 hover:text-[#0B2D6B]'}`}>Market</button>
               <button onClick={() => handleNavClick('CROP_DOCTOR')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'CROP_DOCTOR' ? 'text-[#6A0F1A] bg-red-50' : 'text-gray-600 hover:text-[#0B2D6B]'}`}>Crop Doctor</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-[#0B2D6B] hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Drawer Navigation Overlay */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-6 pt-24 pb-20">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Menu</h2>
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${currentView === item.id ? 'bg-[#6A0F1A] text-white shadow-lg' : 'hover:bg-gray-100 text-[#0B2D6B]'}`}
                >
                  <item.icon size={20} className="mr-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mt-6 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card mt-auto py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#0B2D6B] font-semibold text-sm">Bafut Village & Culture Intelligence AI</p>
          <p className="text-gray-500 text-xs mt-1">Preserving Heritage. Empowering People.</p>
          <p className="text-[10px] text-gray-400 mt-4">Designed by EGS ©</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
