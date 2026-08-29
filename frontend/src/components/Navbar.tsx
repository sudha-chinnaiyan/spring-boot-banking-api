import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Shield, LogOut, User } from 'lucide-react';

interface NavbarProps {
  customerName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ customerName }) => {
  const { username, logout } = useAuth();

  return (
    <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-100">
            Nexus Bank
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-950/60 border border-slate-850 rounded-xl max-w-xs">
            <div className="bg-indigo-600/10 p-1.5 rounded-lg text-indigo-400 border border-indigo-500/15">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {username}
              </p>
              {customerName && (
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate max-w-[120px]">
                  {customerName}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-800 transition-colors flex items-center space-x-2 text-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
