
import React from 'react';
import { ExerciseLog } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface TrendsViewProps {
  logs: ExerciseLog[];
}

const TrendsView: React.FC<TrendsViewProps> = ({ logs }) => {
  const today = new Date();
  
  // 1. 最近 7 天每天的運動總時長 (小時)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = logs.filter(l => l.date.split('T')[0] === dateStr);
    const totalMinutes = dayLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    return {
      day: d.toLocaleDateString('zh-HK', { weekday: 'short' }),
      hours: totalMinutes / 60,
      date: dateStr
    };
  });

  const maxHours = Math.max(...last7Days.map(d => d.hours), 1);

  // 2. 運動類別分佈 (過去 30 天)
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);
  const recentLogs = logs.filter(l => new Date(l.date) >= last30Days);
  
  const categoryStats = CATEGORIES.map(cat => {
    const count = recentLogs.filter(l => l.category === cat.value).length;
    return { ...cat, count };
  }).sort((a, b) => b.count - a.count);

  const totalLogs = recentLogs.length || 1;

  // 3. 平均強度與表現 (最近 10 次)
  const last10Logs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  const avgEffort = last10Logs.length ? (last10Logs.reduce((acc, curr) => acc + (curr.effort || 0), 0) / last10Logs.length).toFixed(1) : '0.0';
  const avgPerf = last10Logs.length ? (last10Logs.reduce((acc, curr) => acc + (curr.performance || 0), 0) / last10Logs.length).toFixed(1) : '0.0';

  return (
    <div className="p-6 space-y-8 pb-32">
      <section>
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          每週活動量 <span className="text-blue-500">📊</span>
        </h3>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-end justify-between h-48 gap-2">
            {last7Days.map((data, i) => {
              const heightPercentage = (data.hours / maxHours) * 100;
              const isToday = i === 6;
              return (
                <div key={data.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <div 
                      style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                      className={`w-full max-w-[20px] rounded-full transition-all duration-500 ease-out ${isToday ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                    />
                    {data.hours > 0 && (
                      <span className="absolute -top-6 text-[10px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.hours}h
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">週總時數</p>
               <p className="text-xl font-black text-slate-800">
                 {last7Days.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)} <span className="text-xs text-slate-400">Hours</span>
               </p>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">日平均</p>
               <p className="text-xl font-black text-slate-800">
                 {(last7Days.reduce((acc, curr) => acc + curr.hours, 0) / 7).toFixed(1)} <span className="text-xs text-slate-400">Hours</span>
               </p>
             </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black text-slate-800 mb-4">近 30 天類別分佈</h3>
        <div className="space-y-3">
          {categoryStats.filter(c => c.count > 0).map(cat => (
            <div key={cat.value} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-bold text-slate-700">{cat.value}</span>
                </div>
                <span className="text-xs font-black text-slate-400">{cat.count} 次</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${(cat.count / totalLogs) * 100}%` }}
                  className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                />
              </div>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm font-medium">近 30 天沒有運動紀錄</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-xl shadow-blue-100">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">平均強度</p>
          <p className="text-3xl font-black">{avgEffort}</p>
          <div className="mt-2 text-[10px] font-bold opacity-80">最近 10 次紀錄</div>
        </div>
        <div className="bg-yellow-400 rounded-3xl p-5 text-slate-900 shadow-xl shadow-yellow-100">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">平均表現</p>
          <p className="text-3xl font-black">{avgPerf} <span className="text-sm">⭐</span></p>
          <div className="mt-2 text-[10px] font-bold opacity-80">最近 10 次紀錄</div>
        </div>
      </section>
    </div>
  );
};

export default TrendsView;
