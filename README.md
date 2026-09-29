# 🌊 臺灣高中生每日水足跡計算器 (Daily Water Footprint Calculator)

> 專為臺灣高中生設計的單頁互動式水足跡計算與環境教育網站 (108課綱地理與社會環境議題)

![License](https://img.shields.io/badge/license-MIT-emerald.svg)
![Taiwan High School](https://img.shields.io/badge/Taiwan%20High%20School-108%20Curriculum-ocean.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

---

## 📌 簡介 (Overview)

「臺灣高中生每日水足跡計算器」是一款響應式單頁網頁應用程式 (SPA)。透過貼近臺灣高中生日常校園與家庭情境的問答介面（如早餐蛋餅、午餐牛肉便當/排骨便當、珍珠奶茶手搖飲、刷牙習慣、考卷講義張數等），引導學生計算個人每日的**直接水足跡**與食物、消費品的**隱形虛擬水足跡 (Virtual Water)**。

本專案旨在提升學生對水資源永續發展 (SDG 6) 的議題覺知，為 108 課綱地理與社會環境議題課程提供互動教學工具。

---

## ✨ 核心特色 (Key Features)

1. **極致視覺與流暢微動畫**：
   - 採用氣泡動態背景、玻璃擬物化 (Glassmorphism) 與色彩繽紛的科技質感介面。
   - 支援深色模式 (Dark Mode) 與淺色模式 (Light Mode) 一鍵切換。

2. **實時動態水足跡預估**：
   - 填寫問答時，右上方實時顯示目前預估水足跡公升數。
   - 支援單選卡片、多選複選框以及滑桿 (Number Slider) 互動控制項。

3. **豐富視覺化診斷儀表板**：
   - **成就勳章分級**：🏆 **節水省長** (0-1500L)、🌊 **標準水星人** (1501-2500L)、👾 **隱形吃水怪獸** (2501L+)。
   - **生活化量化換算**：自動將總水足跡換算為「600ml 寶特瓶數量」與「180L 家庭浴缸數量」。
   - **Chart.js 雙圖表**：
     - 環狀圖 (Doughnut Chart)：解析直接衛浴、飲食虛擬水與消費虛擬水之比例結構。
     - 橫向條形圖 (Bar Chart)：將個人水足跡與全台高中生平均值及永續目標值進行對比。
   - **生活細項排序**：依據水足跡影響度自動排序每項生活選擇。
   - **省水達人特攻計畫**：根據學生的具體選擇，產生專屬的減水行動建議。

4. **一鍵匯出診斷證書**：
   - 支援將診斷報告卡片導出為圖片，方便學生分享至社群媒體或繳交作業報告。

5. **知識小講堂 Modal**：
   - 介紹水足跡 (Water Footprint) 與隱形虛擬水 (Virtual Water) 的概念與冷知識。

---

## 📊 資料與計算邏輯 (Data Schema & Coefficients)

系統使用結構化 JSON 進行水足跡係數計算：

- **個人衛浴與清潔 (直接用水)**：
  - 淋浴 / 泡澡 (泡澡 +180L)
  - 淋浴時間 (每分鐘 +10L)
  - 刷牙習慣 (一直開水龍頭 +12L vs 漱口杯蓄水 +1L)
  - 洗衣服頻率 (每天 +60L, 2~3天 +30L, 家人分攤 +20L)

- **飲食與飲料 (飲食虛擬水)**：
  - 便當主菜 (牛肉麵/便當 +2000L, 排骨便當 +900L, 雞腿便當 +650L, 魚排麵 +400L, 蔬食素食 +250L)
  - 手搖飲料 (珍珠奶茶 +500L, 鮮奶茶 +450L, 無糖純茶 +150L, 美式咖啡 +140L, 汽水/運動飲料 +100L)
  - 早餐雞蛋 (+200L / +400L)

- **學習與日常消費 (消費虛擬水)**：
  - 考卷/講義/筆記本用紙 (每張 +10L)
  - 購衣頻率 (+30L ~ +400L)

---

## 🛠️ 技術棧 (Tech Stack)

- **HTML5 & Semantic Markup**
- **Tailwind CSS (via CDN)**
- **Vanilla JavaScript (ES6+)**
- **Lucide Icons**
- **Chart.js**
- **Canvas-Confetti**
- **html2canvas**

---

## 🚀 部署與開源 (Deployment & Open Source)

本網站建置為純前端 SPA，完全相容於 **GitHub Pages** 靜態頁面服務。

---

## 📄 授權條款 (License)

MIT License © 2026 臺灣高中生水足跡計算器開發團隊
