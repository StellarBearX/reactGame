// src/data/recipes.js
// ระบบ Processing & Crafting - สูตรอาหารและของแปรรูป

export const CRAFTING_STATIONS = {
  mill: {
    id: 'mill',
    name: 'โรงสี',
    emoji: '🏭',
    description: 'แปรรูปเมล็ดธัญพืชเป็นแป้ง',
    unlockLevel: 3,
    color: '#8b5cf6'
  },
  
  kitchen: {
    id: 'kitchen',
    name: 'ครัว',
    emoji: '🍳',
    description: 'ทำอาหารและเครื่องดื่ม',
    unlockLevel: 5,
    color: '#f59e0b'
  },
  
  workshop: {
    id: 'workshop',
    name: 'โรงงาน',
    emoji: '🔨',
    description: 'สร้างเครื่องมือและอุปกรณ์',
    unlockLevel: 8,
    color: '#6b7280'
  }
};

export const PROCESSED_ITEMS = {
  // ผลิตภัณฑ์จากโรงสี
  // Profit = Revenue - Cost (using base prices: wheat=10, corn=150)
  // Target: 10-12% profit margin for simple processing (modest but worthwhile)
  flour: {
    id: 'flour',
    name: 'แป้ง',
    emoji: '🌾',
    description: 'แป้งข้าวสาลีคุณภาพดี',
    // Cost: 3x wheat = 30, Target 10% margin → 30 * 1.10 = 33
    basePrice: 33,
    category: 'processed',
    station: 'mill'
  },
  
  cornmeal: {
    id: 'cornmeal',
    name: 'แป้งข้าวโพด',
    emoji: '🌽',
    description: 'แป้งข้าวโพดสำหรับทำขนม',
    // Cost: 2x corn = 300, Target 12% margin → 300 * 1.12 = 336 → 335
    basePrice: 335,
    category: 'processed',
    station: 'mill'
  },
  
  // ผลิตภัณฑ์จากครัว
  // Profit calculations: tomato=150, carrot=45, corn=150, pumpkin=450, flour=33
  // Target: 12-15% profit margin for food items (reasonable for time investment)
  tomato_sauce: {
    id: 'tomato_sauce',
    name: 'ซอสมะเขือเทศ',
    emoji: '🍅',
    description: 'ซอสมะเขือเทศทำเอง',
    // Cost: 4x tomato = 600, Target 13% margin → 600 * 1.13 = 678 → 680
    basePrice: 680,
    category: 'processed',
    station: 'kitchen'
  },
  
  carrot_juice: {
    id: 'carrot_juice',
    name: 'น้ำแครอท',
    emoji: '🥕',
    description: 'น้ำแครอทสด 100%',
    // Cost: 3x carrot = 135, Target 13% margin → 135 * 1.13 = 152.55 → 150
    basePrice: 150,
    category: 'processed',
    station: 'kitchen'
  },
  
  pumpkin_pie: {
    id: 'pumpkin_pie',
    name: 'พายฟักทอง',
    emoji: '🥧',
    description: 'พายฟักทองอบสด',
    // Cost: 1x pumpkin + 2x flour = 450 + 66 = 516, Target 15% margin → 516 * 1.15 = 593.4 → 595
    basePrice: 595,
    category: 'processed',
    station: 'kitchen'
  },
  
  corn_bread: {
    id: 'corn_bread',
    name: 'ขนมปังข้าวโพด',
    emoji: '🍞',
    description: 'ขนมปังข้าวโพดนุ่ม',
    // Cost: 2x cornmeal + 1x flour = 670 + 33 = 703, Target 12% margin → 703 * 1.12 = 787.36 → 785
    basePrice: 785,
    category: 'processed',
    station: 'kitchen'
  },
  
  mixed_salad: {
    id: 'mixed_salad',
    name: 'สลัดผักรวม',
    emoji: '🥗',
    description: 'สลัดผักสดหลากชนิด',
    // Cost: 2x tomato + 2x carrot + 1x corn = 300 + 90 + 150 = 540, Target 13% margin → 540 * 1.13 = 610.2 → 610
    basePrice: 610,
    category: 'processed',
    station: 'kitchen'
  },
  
  // ผลิตภัณฑ์จากโรงงาน
  // Cost: 5x wheat + 5x carrot + 3x corn = 50 + 225 + 450 = 725
  // Target: 15% profit margin for special tools (slightly higher for complexity)
  fertilizer: {
    id: 'fertilizer',
    name: 'ปุ๋ย',
    emoji: '🌱',
    description: 'ปุ๋ยคุณภาพดีสำหรับเพิ่มผลผลิต',
    // Cost: 725, Target 15% margin → 725 * 1.15 = 833.75 → 835
    basePrice: 835,
    category: 'tool',
    station: 'workshop'
  }
};

// สูตรการแปรรูป
export const RECIPES = {
  // สูตรโรงสี
  flour_recipe: {
    id: 'flour_recipe',
    name: 'ทำแป้งข้าวสาลี',
    station: 'mill',
    inputs: {
      wheat: 3
    },
    outputs: {
      flour: 1
    },
    craftingTime: 30000, // 30 วินาที
    xpReward: 50,
    unlockLevel: 3,
    emoji: '🌾'
  },
  
  cornmeal_recipe: {
    id: 'cornmeal_recipe',
    name: 'ทำแป้งข้าวโพด',
    station: 'mill',
    inputs: {
      corn: 2
    },
    outputs: {
      cornmeal: 1
    },
    craftingTime: 25000, // 25 วินาที
    xpReward: 40,
    unlockLevel: 3,
    emoji: '🌽'
  },
  
  // สูตรครัว
  tomato_sauce_recipe: {
    id: 'tomato_sauce_recipe',
    name: 'ทำซอสมะเขือเทศ',
    station: 'kitchen',
    inputs: {
      tomato: 4
    },
    outputs: {
      tomato_sauce: 1
    },
    craftingTime: 45000, // 45 วินาที
    xpReward: 80,
    unlockLevel: 5,
    emoji: '🍅'
  },
  
  carrot_juice_recipe: {
    id: 'carrot_juice_recipe',
    name: 'ทำน้ำแครอท',
    station: 'kitchen',
    inputs: {
      carrot: 3
    },
    outputs: {
      carrot_juice: 1
    },
    craftingTime: 20000, // 20 วินาที
    xpReward: 60,
    unlockLevel: 5,
    emoji: '🥕'
  },
  
  pumpkin_pie_recipe: {
    id: 'pumpkin_pie_recipe',
    name: 'ทำพายฟักทอง',
    station: 'kitchen',
    inputs: {
      pumpkin: 1,
      flour: 2
    },
    outputs: {
      pumpkin_pie: 1
    },
    craftingTime: 60000, // 60 วินาที
    xpReward: 150,
    unlockLevel: 6,
    emoji: '🥧'
  },
  
  corn_bread_recipe: {
    id: 'corn_bread_recipe',
    name: 'ทำขนมปังข้าวโพด',
    station: 'kitchen',
    inputs: {
      cornmeal: 2,
      flour: 1
    },
    outputs: {
      corn_bread: 1
    },
    craftingTime: 50000, // 50 วินาที
    xpReward: 120,
    unlockLevel: 6,
    emoji: '🍞'
  },
  
  mixed_salad_recipe: {
    id: 'mixed_salad_recipe',
    name: 'ทำสลัดผักรวม',
    station: 'kitchen',
    inputs: {
      tomato: 2,
      carrot: 2,
      corn: 1
    },
    outputs: {
      mixed_salad: 1
    },
    craftingTime: 30000, // 30 วินาที
    xpReward: 100,
    unlockLevel: 7,
    emoji: '🥗'
  },
  
  // สูตรโรงงาน
  fertilizer_recipe: {
    id: 'fertilizer_recipe',
    name: 'ทำปุ๋ย',
    station: 'workshop',
    inputs: {
      wheat: 5,
      carrot: 5,
      corn: 3
    },
    outputs: {
      fertilizer: 1
    },
    craftingTime: 75000, // 75 วินาที
    xpReward: 180,
    unlockLevel: 8,
    emoji: '🌱'
  }
};

// ตรวจสอบว่าสามารถทำสูตรได้หรือไม่
export function canCraftRecipe(recipeId, inventory) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return false;
  
  // ตรวจสอบว่ามีวัตถุดิบครบหรือไม่
  for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
    const availableAmount = inventory[itemId] || 0;
    if (availableAmount < requiredAmount) {
      return false;
    }
  }
  
  return true;
}

// คำนวณต้นทุนการผลิต (ราคาของวัตถุดิบถ้าขายตรงๆ ในตลาด ตามราคาตลาดแบบ dynamic)
export function calculateCraftingCost(recipeId, marketPrices) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return 0;
  
  let totalCost = 0;
  for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
    // ใช้ราคาตลาด (สำหรับพืชผล) หรือ basePrice (สำหรับของแปรรูป) ถ้าไม่มีราคาตลาด
    const itemPrice = marketPrices[itemId] || 
                      PROCESSED_ITEMS[itemId]?.basePrice || 
                      0;
    totalCost += itemPrice * requiredAmount;
  }
  
  return totalCost;
}

// คำนวณกำไรจากการขายผลิตภัณฑ์
// กำไร = (มูลค่าสินค้าที่ผลิตได้ถ้าขายในตลาด) - (มูลค่าวัตถุดิบถ้าขายตรงๆ ในตลาด)
export function calculateCraftingProfit(recipeId, marketPrices) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return 0;
  
  // ต้นทุน = ราคาของวัตถุดิบถ้าขายตรงๆ ในตลาด (ตามราคา dynamic)
  const cost = calculateCraftingCost(recipeId, marketPrices);
  
  // รายได้ = ราคาของสินค้าที่ผลิตได้ถ้าขายในตลาด (ตามราคา dynamic)
  let revenue = 0;
  for (const [itemId, producedAmount] of Object.entries(recipe.outputs)) {
    const itemPrice = marketPrices[itemId] || PROCESSED_ITEMS[itemId]?.basePrice || 0;
    revenue += itemPrice * producedAmount;
  }
  
  // กำไร = รายได้ - ต้นทุน (อาจเป็นลบถ้าขายวัตถุดิบดีกว่า)
  return revenue - cost;
}

// ดึงสูตรที่สามารถทำได้ตามระดับและวัตถุดิบที่มี
export function getAvailableRecipes(playerLevel, inventory, marketPrices) {
  const availableRecipes = [];
  
  Object.values(RECIPES).forEach(recipe => {
    if (recipe.unlockLevel <= playerLevel && canCraftRecipe(recipe.id, inventory)) {
      const profit = calculateCraftingProfit(recipe.id, marketPrices);
      availableRecipes.push({
        ...recipe,
        profit,
        canCraft: true
      });
    }
  });
  
  // เรียงตามกำไร (จากมากไปน้อย)
  return availableRecipes.sort((a, b) => b.profit - a.profit);
}

// ดึงสูตรที่ยังไม่สามารถทำได้
export function getLockedRecipes(playerLevel, inventory) {
  const lockedRecipes = [];
  
  Object.values(RECIPES).forEach(recipe => {
    if (recipe.unlockLevel > playerLevel || !canCraftRecipe(recipe.id, inventory)) {
      lockedRecipes.push({
        ...recipe,
        canCraft: false,
        reason: recipe.unlockLevel > playerLevel ? 'level' : 'materials'
      });
    }
  });
  
  return lockedRecipes;
}

// คำนวณเวลาที่เหลือในการผลิต
export function getCraftingTimeRemaining(startTime, craftingTime) {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, craftingTime - elapsed);
  return remaining;
}

// ตรวจสอบว่าการผลิตเสร็จสิ้นหรือไม่
export function isCraftingComplete(startTime, craftingTime) {
  return Date.now() - startTime >= craftingTime;
}
