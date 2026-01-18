
import React, { useState, useEffect } from 'react';
import { ExerciseLog, SportCategory } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface ExerciseFormProps {
  onSave: (log: ExerciseLog) => void;
  onCancel: () => void;
  initialData?: ExerciseLog;
}

const MOODS = ['🤩', '😊', '😐', '😫', '😡'];

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSave, onCancel, initialData }) => {
  const [category, setCategory] = useState<SportCategory>(initialData?.category || CATEGORIES[0].value);
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || '');
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(initialData?.durationMinutes || 60);
  const [effort, setEffort] = useState<number>(initialData?.effort || 5);
  const [performance, setPerformance] = useState<number>(initialData?.performance || 3);
  const [mood, setMood] = useState<string>(initialData?.mood || '😊');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const currentCategoryConfig = CATEGORIES.find(c => c.value === category);

  useEffect(() => {
    if (currentCategoryConfig && !currentCategoryConfig.subcategories.includes(subcategory)) {
      setSubcategory(currentCategoryConfig.subcategories[0]);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: ExerciseLog = {
      id: initialData?.id || Date.now().toString(),
      category,
      subcategory,
      date: new Date(date).toISOString(),
      durationMinutes: Number(duration),
      effort: Number(effort),
      performance: Number(performance),
      mood,
      notes
    };
    onSave(log);
  };

  const durationOptions = [];
  for (let i = 0.5; i <= 6; i += 0.5) {
    durationOptions.push({
      label: `${i} 小時`,
      value: i * 60
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800">{initialData ? '修改運動' : '新增運動紀錄'}</h2>
        <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">主類別</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${category === cat.value ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-white'}`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className={`text-[10px] font-bold mt-1 ${category === cat.value ? 'text-blue-600' : 'text-slate-400'}`}>{cat.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">子類別</label>
          <select 
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
          >
            {currentCategoryConfig?.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">日期</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">時長 (小時)</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
            >
              {durationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6 bg-slate-50 p-5 rounded-3xl border border-slate-100">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">運動強度 (Effort)</label>
              <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{effort}/10</span>
            </div>
            <input 
              type="range" 
              min="1" max="10" 
              value={effort} 
              onChange={(e) => setEffort(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>輕鬆</span>
              <span>極限</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">表現評分 (Performance)</label>
            <div className="flex justify-between gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPerformance(star)}
                  className={`flex-1 py-3 rounded-xl text-2xl transition-all border-2 ${performance >= star ? 'border-yellow-400 bg-yellow-50 scale-105' : 'border-transparent bg-white opacity-40 grayscale'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">運動後心情 (Mood)</label>
            <div className="flex justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              {MOODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all ${mood === m ? 'bg-blue-600 text-white shadow-lg scale-110' : 'hover:bg-slate-50 grayscale opacity-50'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">備註 (可選)</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="今天感覺如何？"
            className="w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px]"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          {initialData ? '保存修改' : '確認新增'}
        </button>
      </form>
    </div>
  );
};

export default ExerciseForm;
