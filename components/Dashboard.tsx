
import React, { useState } from 'react';
import { ExerciseLog, SportCategory } from '../types';
import { CATEGORIES } from '../constants';

interface DashboardProps {
  logs: ExerciseLog[];
  onEdit: (log: ExerciseLog) => void;
  onDelete: (id: string) => void;
  onViewChange: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, onEdit, onDelete, onViewChange }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getDaysSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const lastWorkout = sortedLogs[0];
  const daysSinceLast = lastWorkout ? getDaysSince(lastWorkout.date) : null;
  const uniqueDaysThisYear = new Set(logs.filter(log => new Date(log.date).getFullYear() === currentYear).map(log => log.date.split('T')[0])).size;

  const importantCategories: SportCategory[] = ['Gym', '羽毛球', '排球'];

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Hero Section - 狀態總覽 */}
      <section className="bg-slate-900 rounded-[2rem] p-6 shadow-lg text-white relative">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">對上一次運動</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{daysSinceLast === null ? '--' : daysSinceLast}</span>
              <span className="text-xs font-bold text-slate-500">DAYS</span>
            </div>
          </div>
          <div className="border-l border-white/10 pl-6">
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">今年運動天數</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-blue-400">{uniqueDaysThisYear}</span>
              <span className="text-xs font-bold text-slate-500">DAYS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Alarms */}
      <section>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">運動警報</h3>
        <div className="grid grid-cols-3 gap-3">
          {importantCategories.map(cat => {
            const config = CATEGORIES.find(c => c.value === cat);
            const last = sortedLogs.find(l => l.category === cat);
            const days = last ? getDaysSince(last.date) : -1;
            return (
              <div key={cat} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">{config?.icon}</span>
                <span className="text-[9px] font-bold text-slate-400">{cat}</span>
                <span className={`text-[10px] font-black ${days === 0 ? 'text-green-500' : days > 3 ? 'text-red-500' : 'text-slate-700'}`}>
                  {days === -1 ? '未有紀錄' : days === 0 ? '今天已做' : `${days}天前`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">最近紀錄</h3>
        <div className="space-y-4">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm font-medium">仲未有紀錄喎，快啲加返個！</p>
            </div>
          ) : (
            sortedLogs.slice(0, 5).map(log => {
              const catConfig = CATEGORIES.find(c => c.value === log.category);
              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${catConfig?.color} flex items-center justify-center text-xl text-white flex-shrink-0 shadow-inner`}>
                    {catConfig?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate text-sm">{log.subcategory}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(log.date).toLocaleDateString('zh-HK')} • {log.durationMinutes / 60}h
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(log)} className="p-2 text-slate-300 hover:text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {sortedLogs.length > 5 && (
          <button 
            onClick={() => onViewChange('calendar')}
            className="w-full py-3 mt-4 text-xs font-bold text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            查看全部紀錄
          </button>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
