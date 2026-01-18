
import React, { useState } from 'react';
import { ExerciseLog } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface CalendarViewProps {
  logs: ExerciseLog[];
  onEdit: (log: ExerciseLog) => void;
  onDelete: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ logs, onEdit, onDelete }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));

  const getLogsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return logs.filter(l => l.date.split('T')[0] === dateStr);
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const selectedDateLogs = selectedDate ? logs.filter(l => l.date.split('T')[0] === selectedDate) : [];

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const dateStr = day.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const dayLogs = getLogsForDate(day);
            const hasLogs = dayLogs.length > 0;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200
                  ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-slate-50 text-slate-700'}
                  ${isToday && !isSelected ? 'border border-blue-200' : ''}
                `}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-slate-700'} ${hasLogs ? '-mt-1' : ''}`}>
                  {day.getDate()}
                </span>
                {hasLogs && (
                  <div className="flex gap-0.5 mt-0.5 justify-center">
                    {dayLogs.slice(0, 2).map((l, i) => {
                      const config = CATEGORIES.find(c => c.value === l.category);
                      return (
                        <span key={l.id + i} className="text-[10px] leading-none">{config?.icon}</span>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
          {selectedDate === new Date().toISOString().split('T')[0] ? '今天' : selectedDate} 運動詳情
        </h3>
        <div className="space-y-4">
          {selectedDateLogs.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm font-medium italic">這天沒有運動紀錄 💤</p>
            </div>
          ) : (
            selectedDateLogs.map(log => {
              const catConfig = CATEGORIES.find(c => c.value === log.category);
              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${catConfig?.color} flex items-center justify-center text-xl shadow-inner text-white flex-shrink-0`}>
                      {catConfig?.icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-slate-800 truncate">{log.subcategory}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{log.category} • {log.durationMinutes / 60} 小時</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={() => onEdit(log)} 
                        className="p-2 text-slate-300 hover:text-blue-600 transition-all active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => onDelete(log.id)} 
                        className="p-2 text-slate-300 hover:text-red-600 transition-all active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* 詳細狀態展示區 */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-2xl">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-400 uppercase">強度</span>
                      <span className="text-xs font-black text-blue-600">{log.effort || '--'}</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-200">
                      <span className="text-[8px] font-black text-slate-400 uppercase">表現</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <span key={i} className={`text-[10px] ${i <= (log.performance || 0) ? "grayscale-0" : "grayscale opacity-20"}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-400 uppercase">心情</span>
                      <span className="text-sm">{log.mood || '😐'}</span>
                    </div>
                  </div>
                  
                  {log.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
