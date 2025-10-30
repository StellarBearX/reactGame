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
  flour: {
    id: 'flour',
    name: 'แป้ง',
    emoji: '🌾',
    description: 'แป้งข้าวสาลีคุณภาพดี',
    basePrice: 25,
    category: 'processed',
    station: 'mill'
  },
  
  cornmeal: {
    id: 'cornmeal',
    name: 'แป้งข้าวโพด',
    emoji: '🌽',
    description: 'แป้งข้าวโพดสำหรับทำขนม',
    basePrice: 30,
    category: 'processed',
    station: 'mill'
  },
  
  // ผลิตภัณฑ์จากครัว
  tomato_sauce: {
    id: 'tomato_sauce',
    name: 'ซอสมะเขือเทศ',
    emoji: '🍅',
    description: 'ซอสมะเขือเทศทำเอง',
    basePrice: 80,
    category: 'processed',
    station: 'kitchen'
  },
  
  carrot_juice: {
    id: 'carrot_juice',
    name: 'น้ำแครอท',
    emoji: '🥕',
    description: 'น้ำแครอทสด 100%',
    basePrice: 60,
    category: 'processed',
    station: 'kitchen'
  },
  
  pumpkin_pie: {
    id: 'pumpkin_pie',
    name: 'พายฟักทอง',
    emoji: '🥧',
    description: 'พายฟักทองอบสด',
    basePrice: 200,
    category: 'processed',
    station: 'kitchen'
  },
  
  corn_bread: {
    id: 'corn_bread',
    name: 'ขนมปังข้าวโพด',
    emoji: '🍞',
    description: 'ขนมปังข้าวโพดนุ่ม',
    basePrice: 120,
    category: 'processed',
    station: 'kitchen'
  },
  
  mixed_salad: {
    id: 'mixed_salad',
    name: 'สลัดผักรวม',
    emoji: '🥗',
    description: 'สลัดผักสดหลากชนิด',
    basePrice: 150,
    category: 'processed',
    station: 'kitchen'
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

// คำนวณต้นทุนการผลิต
export function calculateCraftingCost(recipeId, marketPrices) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return 0;
  
  let totalCost = 0;
  for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
    const itemPrice = marketPrices[itemId] || 0;
    totalCost += itemPrice * requiredAmount;
  }
  
  return totalCost;
}

// คำนวณกำไรจากการขายผลิตภัณฑ์
export function calculateCraftingProfit(recipeId, marketPrices) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return 0;
  
  const cost = calculateCraftingCost(recipeId, marketPrices);
  
  let revenue = 0;
  for (const [itemId, producedAmount] of Object.entries(recipe.outputs)) {
    const itemPrice = marketPrices[itemId] || PROCESSED_ITEMS[itemId]?.basePrice || 0;
    revenue += itemPrice * producedAmount;
  }
  
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
