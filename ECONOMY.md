# 🌾 Sprint 2 - Economy System

## 🎯 Overview
Sprint 2 ได้เพิ่มระบบเศรษฐกิจที่ซับซ้อนให้กับเกมฟาร์ม โดยมี 3 ระบบหลัก:

### 1. 🏪 Dynamic Market System
**Concept**: ตลาดที่มีราคาเปลี่ยนแปลงตามฤดูกาลและเหตุการณ์สุ่ม

**Features**:
- **ราคาเปลี่ยนแปลงทุกวัน** - ราคาจะอัพเดททุก 60 วินาที (1 วันในเกม)
- **ฤดูกาล 4 ฤดู** - Spring, Summer, Autumn, Winter แต่ละฤดูมีผลต่อราคาแตกต่างกัน
- **เหตุการณ์สุ่ม** - เช่น ขาดแคลนมะเขือเทศ, เทศกาลฟักทอง, เทรนด์สุขภาพ
- **เทรนด์ราคา** - แสดงการเปลี่ยนแปลงราคาเปรียบเทียบกับวันก่อน
- **Market Board UI** - แสดงราคา, เทรนด์, และเหตุการณ์ปัจจุบัน

**Player Impact**: 
- ต้องคิดก่อนขายสินค้า
- เก็บผลผลิตไว้ขายเมื่อราคาสูง
- ติดตามเหตุการณ์พิเศษ

### 2. 📋 Trade Contracts System
**Concept**: ระบบงานที่ให้ผู้เล่นรับสัญญาส่งสินค้า

**Features**:
- **สัญญาสุ่ม** - สร้างสัญญาใหม่ทุก 5 นาที (สูงสุด 3 สัญญา)
- **ความยาก 3 ระดับ** - Easy, Medium, Hard
- **ความคืบหน้าตามเวลาจริง** - ติดตามความคืบหน้าอัตโนมัติ
- **รางวัลหลากหลาย** - เงิน, XP, เมล็ดพันธุ์พิเศษ
- **ระบบหมดอายุ** - สัญญาหมดอายุตามเวลาที่กำหนด
- **Contracts Panel UI** - แสดงสัญญา, ความคืบหน้า, และรางวัล

**Player Impact**:
- ให้เป้าหมายระยะสั้น
- สร้างแรงจูงใจในการปลูกพืชหลากชนิด
- รายได้ที่แน่นอนนอกจากการขายในตลาด

### 3. 🏭 Processing & Crafting System
**Concept**: ระบบแปรรูปสินค้าเพื่อเพิ่มมูลค่า

**Features**:
- **3 สถานีผลิต**:
  - 🏭 **โรงสี** (เลเวล 3) - แปรรูปเมล็ดธัญพืช
  - 🍳 **ครัว** (เลเวล 5) - ทำอาหารและเครื่องดื่ม
  - 🔨 **โรงงาน** (เลเวล 8) - สร้างเครื่องมือและอุปกรณ์
- **สูตรการผลิต** - 7 สูตรเริ่มต้นพร้อมระบบปลดล็อก
- **ระบบคิว** - สามารถผลิตหลายอย่างพร้อมกัน
- **การคำนวณกำไร** - แสดงกำไรที่คาดหวังก่อนผลิต
- **Crafting Station UI** - จัดการการผลิตและขายสินค้าแปรรูป

**Player Impact**:
- เพิ่มมูลค่าสินค้า
- สร้างห่วงโซ่การผลิต
- ให้ทางเลือกในการสร้างรายได้

## 🛠️ Technical Implementation

### ไฟล์ใหม่ที่เพิ่ม:
- `src/data/market.js` - ระบบตลาดและราคา
- `src/data/contracts.js` - ระบบสัญญาและงาน
- `src/data/recipes.js` - ระบบสูตรการผลิต
- `src/components/MarketBoard.js` - UI ตลาด
- `src/components/ContractsPanel.js` - UI สัญญา
- `src/components/CraftingStation.js` - UI โรงงาน

### การอัพเดท Redux Store:
- เพิ่ม `market` state สำหรับระบบตลาด
- เพิ่ม `contracts` state สำหรับระบบสัญญา
- เพิ่ม `crafting` state สำหรับระบบผลิต
- เพิ่ม `skills` state สำหรับระบบทักษะ (เตรียมไว้สำหรับ Sprint 3)

### Actions ใหม่:
- Market: `updateMarketPrices`, `addMarketEvent`, `removeMarketEvent`
- Contracts: `addContract`, `updateContractProgress`, `completeContract`, `expireContract`
- Crafting: `unlockStation`, `startCrafting`, `completeCrafting`, `sellProcessedItem`
- Skills: `addSkillXP`

## 🎮 Gameplay Changes

### เมนูใหม่:
- 📊 **ตลาด** - ดูราคาและเทรนด์
- 📋 **สัญญา** - รับงานและส่งมอบสินค้า
- 🏭 **โรงงาน** - แปรรูปสินค้าและทำอาหาร

### การเล่นใหม่:
1. **ตรวจสอบตลาด** ก่อนขายสินค้า
2. **รับสัญญา** เพื่อรายได้ที่แน่นอน
3. **แปรรูปสินค้า** เพื่อเพิ่มมูลค่า
4. **วางแผนการผลิต** ตามราคาตลาด

## 🔮 Connection to Sprint 3

ระบบ Economy ใน Sprint 2 จะเชื่อมต่อกับ Sprint 3 ดังนี้:

- **Contracts & Crafting** → **Skills XP** (Trading & Cooking skills)
- **Market Profits** → **Trading Skill XP**
- **Contract Completion** → **Quest Progress**
- **Crafting Items** → **Achievement Progress**

## 🚀 Next Steps

Sprint 3 จะเพิ่ม:
1. **Skills & Perks System** - ระบบทักษะและความสามารถพิเศษ
2. **Quests System** - ระบบเควสต์และภารกิจ
3. **Achievements** - ระบบความสำเร็จและรางวัล

---

**Sprint 2 เสร็จสมบูรณ์!** 🎉
ระบบเศรษฐกิจที่ซับซ้อนและน่าสนใจพร้อมใช้งานแล้ว
