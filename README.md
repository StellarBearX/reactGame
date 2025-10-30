# React Farm Life Cycle

## 🧑‍🌾 Concept
React Farm Life Cycle  
เกมจำลองการทำฟาร์มแบบเบาสบาย เน้น UX ที่เรียบง่าย ใช้ React + Redux Toolkit
เน้นความเรียบง่าย ใช้ React จัดการ state ของฟาร์มและการเติบโตของพืช  
ผู้เล่นสามารถ:
- ปลูกพืชหลากหลายชนิด  
- เก็บเกี่ยวผลผลิตและขายเพื่อรับเงิน  
- ซื้อเมล็ดพันธุ์ใหม่จากร้านค้า  
- บันทึกและโหลดข้อมูลฟาร์มได้  

---

## Tech Stack
- React (CRA)
- Redux Toolkit (`react-farm/src/state`)
- Styled Components (บางส่วนใน `App.js`)
- lucide-react (ชุดไอคอน)

---

## 🏗️ Project Structure (สำคัญ)

รันแอปอยู่ในโฟลเดอร์ `react-farm/`

```
react-farm/
├─ public/
│  ├─ index.html
│  ├─ ConcernedApe-Stardew-Valley-OST.mp3 # เพลงประกอบ
│  └─ sound/
│     ├─ pick.mp3
│     ├─ success.mp3
│     └─ harvest.mp3
└─ src/
   ├─ App.js
   ├─ index.js
   ├─ components/
   │  ├─ StatusBar.js        # แถบบน: เงิน/วัน/เวลา + ปุ่มต่าง ๆ
   │  ├─ Menu.js             # เมนูหลัก (นำทางหน้า)
   │  ├─ FarmGrid.js         # กริดแปลงปลูก
   │  ├─ Plot.js             # แปลงปลูกเดี่ยว
   │  ├─ Shop.js             # ร้านค้า
   │  ├─ Inventory.js        # กระเป๋า
   │  ├─ MarketBoard.js      # ตลาด
   │  ├─ ContractsPanel.js   # สัญญา
   │  ├─ CraftingStation.js  # โรงงานแปรรูป
   │  ├─ HelpPanel.js        # หน้าช่วยเหลือ
   │  └─ WelcomeScreen.js    # หน้าต้อนรับ/สอนเล่น
   ├─ data/
   │  ├─ crops.js
   │  ├─ market.js
   │  ├─ recipes.js
   │  └─ contracts.js
   ├─ state/
   │  ├─ store.js
   │  └─ farmSlice.js        # Redux slice หลักของเกม
   └─ utils/
      ├─ time.js             # ฟังก์ชันจัดการเวลาในเกม
      └─ sound.js            # เล่นไฟล์เสียงจาก public/sound
```

---

## 🧩 Core Features 

| ฟีเจอร์ | รายละเอียด |
|---|---|
| ปลูกพืช | คลิกแปลงว่างเพื่อปลูกเมล็ดจาก `Inventory` |
| เติบโตอัตโนมัติ | คำนวณความคืบหน้าและเวลาที่เหลือด้วย `utils/time.js` |
| เก็บเกี่ยว | คลิกพืชที่โตเต็มที่เพื่อเก็บเกี่ยว (มีเสียง `harvest.mp3`) |
| ร้านค้า | ซื้อเมล็ดและไอเท็มอื่น ๆ |
| ตลาด | ราคาผันผวนตามวัน/เหตุการณ์ |
| สัญญา | รับเควสส่งมอบเพื่อรางวัล |
| โรงงานแปรรูป | แปรรูปเป็นสินค้ามูลค่าสูง |
| เพลงประกอบ | ปุ่ม “ดนตรี” ใน `StatusBar` เปิด/ปิดเพลง OST (วนซ้ำ) |
| เอฟเฟกต์เสียง | ใช้ไฟล์ใน `public/sound/` (pick/success/harvest) |
| ปุ่มลอยกลับฟาร์ม/ร้านค้า | ปุ่มลอยมุมซ้ายล่าง: ถ้าอยู่นอกฟาร์มแสดง "กลับฟาร์ม" ถ้าอยู่ฟาร์มแสดง "ร้านค้า" |
| ไอคอน Lucide | แทนที่อีโมจิด้วยไอคอนชุด lucide-react หลายส่วนของ UI |

---

## 🔊 Media & Audio
- เพลงหลัก: `public/ConcernedApe-Stardew-Valley-OST.mp3` (เล่นผ่านปุ่มดนตรีใน `StatusBar`)
- เอฟเฟกต์เสียง: `public/sound/{pick,success,harvest}.mp3` (เรียกผ่าน `utils/sound.js`)
- หมายเหตุ: เบราว์เซอร์ส่วนใหญ่บล็อก autoplay จำเป็นต้องมีการคลิกก่อนเสียง/เพลงจะเล่นได้

---



```
npm install
npm start
```

เปิดที่ `http://localhost:3000`

---

## 📝 Notes
- โปรเจกต์นี้ใช้ Redux Toolkit 
- ไอคอนใช้ `lucide-react`
