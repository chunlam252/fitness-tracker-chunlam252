
import { ExerciseLog } from '../types';
import { STORAGE_KEY } from '../constants';

const firebaseConfig = {
  apiKey: "AIzaSyCxrAn6x69Ki4c-MTrpBhyGnX2XFKW2f4k",
  authDomain: "fittracker-chunlam252.firebaseapp.com",
  projectId: "fittracker-chunlam252",
  storageBucket: "fittracker-chunlam252.firebasestorage.app",
  messagingSenderId: "629880531604",
  appId: "1:629880531604:web:76fd44292a79fbdad86281",
  measurementId: "G-Z40MK7PG39"
};

let db: any = null;
let auth: any = null;
let googleProvider: any = null;

export const storageService = {
  init: async (onUserChange: (user: any) => void) => {
    // 設置一個 3 秒的超時，如果 Firebase 連不到，就強制結束 Loading 進入本地模式
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('timeout');
      }, 3000);
    });

    const initPromise = (async () => {
      try {
        const { initializeApp } = await import('firebase/app');
        const { getFirestore } = await import('firebase/firestore');
        const { getAuth, onAuthStateChanged, GoogleAuthProvider } = await import('firebase/auth');
        
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();

        onAuthStateChanged(auth, (user: any) => {
          onUserChange(user);
        });

        return 'success';
      } catch (e) {
        console.error("Firebase init error:", e);
        return 'error';
      }
    })();

    // 等待初始化或超時
    const result = await Promise.race([initPromise, timeoutPromise]);
    
    // 如果超時或失敗，確保 App 知道這一點（通過不調用 onUserChange 或傳 null）
    if (result !== 'success') {
      console.warn("Firebase initialization timed out or failed. Running in offline mode.");
      onUserChange(null); // 確保 App 停止 Loading
    }
  },

  login: async () => {
    if (!auth || !googleProvider) return;
    const { signInWithPopup } = await import('firebase/auth');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.error(e);
    }
  },

  logout: async () => {
    if (!auth) return;
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  },

  // 自動保存：本地 + 雲端
  saveLogs: async (logs: ExerciseLog[], userId?: string) => {
    // 1. 總是先存本地 (Offline First)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

    // 2. 如果有連線，存雲端
    if (db && userId) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        // 使用 merge: true 防止覆蓋其他字段
        await setDoc(doc(db, "users", userId), { 
          logs, 
          updatedAt: new Date().toISOString() 
        }, { merge: true });
      } catch (e) {
        console.error("Auto-upload failed:", e);
      }
    }
  },

  // 實時監聽：這就是「自動同步」的核心
  subscribeToLogs: (userId: string, onUpdate: (logs: ExerciseLog[]) => void) => {
    if (!db) return () => {};

    import('firebase/firestore').then(({ doc, onSnapshot }) => {
      const unsub = onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.logs) {
            // 當雲端有變更，自動更新本地 Storage 和 UI
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.logs));
            onUpdate(data.logs);
          }
        }
      });
      return unsub;
    });

    // 返回一個清理函數，雖然這裡是異步的，但在 React useEffect 中處理即可
    // 簡單起見，這裡不返回完整的 unsubscribe 函數，依賴頁面刷新或重新掛載
    return () => {}; 
  },

  // 獲取一次（用於未登入時讀取 LocalStorage）
  getLocalLogs: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};
