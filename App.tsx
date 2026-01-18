
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ExerciseForm from './components/ExerciseForm';
import TrendsView from './components/TrendsView';
import { ExerciseLog, ViewMode } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [editingLog, setEditingLog] = useState<ExerciseLog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [statusText, setStatusText] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 初始化
  useEffect(() => {
    storageService.init((firebaseUser) => {
      setUser(firebaseUser);
      setIsInitialLoading(false);
    });
  }, []);

  // 數據同步邏輯
  useEffect(() => {
    let unsubscribe: any = null;

    const syncData = async () => {
      if (user) {
        setStatusText('連線中...');
        // 1. 登入狀態：開啟實時監聽 (Real-time Listener)
        // 這是為了從 firebase/firestore 動態導入 onSnapshot
        const { getFirestore, doc, onSnapshot } = await import('firebase/firestore');
        const { getApp } = await import('firebase/app');
        const db = getFirestore(getApp());
        
        unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.logs) {
              setLogs(data.logs);
              setStatusText('已同步');
              // 悄悄更新本地備份
              localStorage.setItem('fittrack_logs_v1', JSON.stringify(data.logs));
            }
          } else {
            // 雲端是空的，可能是新用戶，嘗試讀取本地舊數據並上傳
            const local = storageService.getLocalLogs();
            if (local.length > 0) {
              storageService.saveLogs(local, user.uid);
              setLogs(local);
            } else {
              setLogs([]);
            }
            setStatusText('就緒');
          }
        }, (error) => {
          console.error("Sync error", error);
          setStatusText('離線');
        });

      } else {
        // 2. 未登入：只讀本地
        const localLogs = storageService.getLocalLogs();
        setLogs(localLogs);
        setStatusText('本地模式');
      }
    };

    if (!isInitialLoading) {
      syncData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, isInitialLoading]);

  // 通用保存函數
  const saveAndSync = async (newLogs: ExerciseLog[]) => {
    // 樂觀更新 (Optimistic UI)：先改畫面，再後台 Upload
    setLogs(newLogs);
    setStatusText('儲存中...');
    
    // 自動上傳
    await storageService.saveLogs(newLogs, user?.uid);
    
    setTimeout(() => {
      setStatusText(user ? '已同步' : '已儲存 (本地)');
    }, 800);
  };

  const handleAddLog = (newLog: ExerciseLog) => {
    const updated = [newLog, ...logs];
    saveAndSync(updated);
    setView('dashboard');
  };

  const handleUpdateLog = (updatedLog: ExerciseLog) => {
    const updated = logs.map(log => log.id === updatedLog.id ? updatedLog : log);
    saveAndSync(updated);
    setEditingLog(null);
    setView('dashboard');
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = logs.filter(log => log.id !== deleteId);
      saveAndSync(updated);
      setDeleteId(null);
    }
  };

  const handleLoginToggle = () => {
    if (user) {
      storageService.logout();
    } else {
      storageService.login();
    }
  };

  const renderView = () => {
    if (isInitialLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold text-sm tracking-widest">啟動中...</p>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard logs={logs} onEdit={setEditingLog} onDelete={setDeleteId} onViewChange={setView} />;
      case 'trends':
        return <TrendsView logs={logs} />;
      case 'calendar':
        return <CalendarView logs={logs} onEdit={setEditingLog} onDelete={setDeleteId} />;
      case 'add':
        return (
          <ExerciseForm 
            onSave={editingLog ? handleUpdateLog : handleAddLog}
            onCancel={() => { setEditingLog(null); setView('dashboard'); }}
            initialData={editingLog || undefined}
          />
        );
      default:
        return <Dashboard logs={logs} onEdit={setEditingLog} onDelete={setDeleteId} onViewChange={setView} />;
    }
  };

  return (
    <Layout 
      activeView={view} 
      onViewChange={setView}
      user={user}
      onLoginToggle={handleLoginToggle}
      statusText={statusText}
    >
      {renderView()}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-bounce-in">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-6">確認刪除紀錄？</h3>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200">刪除</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
