
import React from 'react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user?: any | null;
  onLoginToggle: () => void;
  statusText?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, user, onLoginToggle, statusText }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative border-x border-slate-100">
      <header className="px-6 py-5 bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">FitTrack</h1>
          <div className="flex items-center gap-1.5 transition-all">
            <div className={`w-1.5 h-1.5 rounded-full ${statusText?.includes('同步') ? 'bg-green-500' : statusText?.includes('儲存') ? 'bg-yellow-500' : 'bg-slate-300'}`}></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {statusText || '就緒'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onLoginToggle}
          className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all active:scale-95 ${user ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-slate-900 border-slate-900 text-white shadow-lg'}`}
        >
          {user && user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full ring-2 ring-white" />
          ) : (
            <span className="text-sm">☁️</span>
          )}
          <span className="text-xs font-bold">{user ? '登出' : '登入備份'}</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar bg-slate-50/50">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t flex justify-around items-center py-3 px-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-30">
        <button onClick={() => onViewChange('dashboard')} className={`flex flex-col items-center gap-1 flex-1 transition-colors ${activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold">主頁</span>
        </button>
        <button onClick={() => onViewChange('trends')} className={`flex flex-col items-center gap-1 flex-1 transition-colors ${activeView === 'trends' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px] font-bold">趨勢</span>
        </button>
        <button onClick={() => onViewChange('add')} className="flex flex-col items-center -mt-8 group">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 border-4 border-white group-active:scale-90 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-[10px] font-bold text-blue-600 mt-1">紀錄</span>
        </button>
        <button onClick={() => onViewChange('calendar')} className={`flex flex-col items-center gap-1 flex-1 transition-colors ${activeView === 'calendar' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-bold">日曆</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
