# FitTrack 運動日常

自用嘅健身紀錄 app（PWA）。

- **主程式**：成個 app 喺 `index.html` 一個檔案。`sw.js` 負責離線，`manifest.json` + `icon-*.png` 係安裝到主畫面用。
- **後端**：Firebase Auth + Firestore（project `fittracker-chunlam252`）。紀錄、體重、課表喺 `users/{uid}`，相片喺 `users/{uid}/photos`。
- **AI 教練**：用自己嘅 Gemini API Key，喺 app 嘅「設定」入面貼上，只存喺手機本機。**唔好將 key 寫入 code 或者放上 repo。**
- **本機預覽**：行「啟動本地預覽.command」，開 `localhost:8080`。
- `.tsx`、`components/`、`services/`、`package.json`、`vite.config.ts` 係 Google AI Studio 留低嘅，唔係主程式。
