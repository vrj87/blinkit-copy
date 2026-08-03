import type { DemoBasket } from "./demo-orders";

/** Order date N days before today (used at seed time for realistic MVP history). */
export function daysAgo(days: number, hours = 18, minutes = 30): Date {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMilliseconds(0);
  d.setHours(hours, minutes, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

export interface DemoOrderSeed {
  items: string[];
  categories: string[];
  totalAmount: number;
  createdAt: Date;
}

export interface DemoUserProfile {
  id: string;
  name: string;
  email: string;
  personaLabel: string;
  addressTitle: string;
  addressSub: string;
  deliveryMins?: number;
  segmentTags: string[];
  categoriesPurchased: string[];
  orders: DemoOrderSeed[];
  baskets: DemoBasket[];
}

const ATHARV_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 487,
    createdAt: daysAgo(0, 19, 15),
  },
  {
    items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 312,
    createdAt: daysAgo(1, 18, 45),
  },
  {
    items: ["Milk 1L", "Eggs 12pc", "Atta 5kg", "Potatoes 1kg", "Cooking Oil 1L"],
    categories: ["Groceries"],
    totalAmount: 528,
    createdAt: daysAgo(2, 18, 20),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 492,
    createdAt: daysAgo(3, 19, 0),
  },
  {
    items: ["Paneer 200g", "Capsicum 500g", "Ginger 100g", "Milk 1L", "Bread"],
    categories: ["Groceries"],
    totalAmount: 356,
    createdAt: daysAgo(4, 17, 30),
  },
  {
    items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 318,
    createdAt: daysAgo(5, 18, 10),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 478,
    createdAt: daysAgo(6, 19, 30),
  },
  {
    items: ["Milk 1L", "Eggs 12pc", "Atta 5kg", "Potatoes 1kg", "Cooking Oil 1L"],
    categories: ["Groceries"],
    totalAmount: 535,
    createdAt: daysAgo(7, 18, 0),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 485,
    createdAt: daysAgo(8, 19, 20),
  },
  {
    items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 305,
    createdAt: daysAgo(9, 17, 50),
  },
  {
    items: ["Paneer 200g", "Capsicum 500g", "Ginger 100g", "Milk 1L", "Bread"],
    categories: ["Groceries"],
    totalAmount: 362,
    createdAt: daysAgo(10, 18, 15),
  },
];

const RAJU_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Idli Dosa Batter 1kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 398,
    createdAt: daysAgo(0, 9, 15),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Green Chillies"],
    categories: ["Groceries"],
    totalAmount: 612,
    createdAt: daysAgo(1, 9, 0),
  },
  {
    items: ["Idli Dosa Batter 1kg", "Milk 1L", "Bread", "Eggs 12pc", "Filter Coffee 200g"],
    categories: ["Groceries"],
    totalAmount: 445,
    createdAt: daysAgo(3, 8, 45),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 589,
    createdAt: daysAgo(5, 9, 30),
  },
  {
    items: ["Idli Dosa Batter 1kg", "Milk 1L", "Bread", "Potatoes 1kg", "Coriander Bunch"],
    categories: ["Groceries"],
    totalAmount: 367,
    createdAt: daysAgo(6, 8, 20),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Filter Coffee 200g"],
    categories: ["Groceries"],
    totalAmount: 601,
    createdAt: daysAgo(8, 9, 10),
  },
  {
    items: ["Idli Dosa Batter 1kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 405,
    createdAt: daysAgo(9, 8, 30),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Green Chillies"],
    categories: ["Groceries"],
    totalAmount: 618,
    createdAt: daysAgo(10, 9, 0),
  },
];

const SANDY_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Quaker Oats 1kg", "Amul Butter 100g", "Brown Bread", "Bananas 6pc", "Honey 500g"],
    categories: ["Groceries"],
    totalAmount: 524,
    createdAt: daysAgo(0, 7, 30),
  },
  {
    items: ["Greek Yogurt 400g", "Granola 500g", "Blueberries 125g", "Almond Milk 1L", "Peanut Butter"],
    categories: ["Groceries"],
    totalAmount: 698,
    createdAt: daysAgo(2, 7, 45),
  },
  {
    items: ["Quaker Oats 1kg", "Eggs 12pc", "Avocado 2pc", "Spinach 250g", "Whole Wheat Bread"],
    categories: ["Groceries"],
    totalAmount: 556,
    createdAt: daysAgo(4, 8, 0),
  },
  {
    items: ["Greek Yogurt 400g", "Granola 500g", "Bananas 6pc", "Honey 500g", "Almond Milk 1L"],
    categories: ["Groceries"],
    totalAmount: 672,
    createdAt: daysAgo(6, 7, 20),
  },
  {
    items: ["Quaker Oats 1kg", "Amul Butter 100g", "Brown Bread", "Blueberries 125g", "Peanut Butter"],
    categories: ["Groceries"],
    totalAmount: 589,
    createdAt: daysAgo(7, 8, 15),
  },
  {
    items: ["Greek Yogurt 400g", "Granola 500g", "Eggs 12pc", "Spinach 250g", "Whole Wheat Bread"],
    categories: ["Groceries"],
    totalAmount: 612,
    createdAt: daysAgo(9, 7, 50),
  },
  {
    items: ["Quaker Oats 1kg", "Amul Butter 100g", "Brown Bread", "Bananas 6pc", "Honey 500g"],
    categories: ["Groceries"],
    totalAmount: 531,
    createdAt: daysAgo(10, 7, 30),
  },
];

export const DEMO_USER_PROFILES: DemoUserProfile[] = [
  {
    id: "user-atharv",
    name: "Atharv Sharma",
    email: "atharv@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "HOME",
    addressSub: "Koramangala, Bengaluru",
    deliveryMins: 10,
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: ATHARV_ORDERS,
    baskets: [
      {
        label: "Weekly staples",
        items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
        categories: ["Groceries"],
        totalAmount: 487,
      },
      {
        label: "Dal & dairy refill",
        items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
        categories: ["Groceries"],
        totalAmount: 312,
      },
    ],
  },
  {
    id: "user-raju",
    name: "Raju Kumar",
    email: "raju@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "HOME",
    addressSub: "Indiranagar, Bengaluru",
    deliveryMins: 11,
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: RAJU_ORDERS,
    baskets: [
      {
        label: "South Indian breakfast",
        items: ["Idli Dosa Batter 1kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Filter Coffee 200g"],
        categories: ["Groceries"],
        totalAmount: 445,
      },
      {
        label: "Rice & dal refill",
        items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Bananas 6pc"],
        categories: ["Groceries"],
        totalAmount: 612,
      },
    ],
  },
  {
    id: "user-sandy",
    name: "Sandy Nair",
    email: "sandy@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "HOME",
    addressSub: "HSR Layout, Bengaluru",
    deliveryMins: 9,
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: SANDY_ORDERS,
    baskets: [
      {
        label: "Breakfast bowl kit",
        items: ["Quaker Oats 1kg", "Greek Yogurt 400g", "Granola 500g", "Honey 500g", "Almond Milk 1L"],
        categories: ["Groceries"],
        totalAmount: 672,
      },
      {
        label: "Morning essentials",
        items: ["Brown Bread", "Amul Butter 100g", "Eggs 12pc", "Bananas 6pc", "Blueberries 125g"],
        categories: ["Groceries"],
        totalAmount: 556,
      },
    ],
  },
];

export const PRIMARY_DEMO_USER_IDS = DEMO_USER_PROFILES.map((u) => u.id);

export function getDemoProfile(userId: string): DemoUserProfile | undefined {
  return DEMO_USER_PROFILES.find((u) => u.id === userId);
}

export function nextUserBasket(userId: string, orderIndex: number): DemoBasket {
  const profile = getDemoProfile(userId);
  const baskets = profile?.baskets ?? [];
  if (baskets.length === 0) {
    return {
      label: "Weekly groceries",
      items: ["Milk 1L", "Bread", "Eggs 12pc"],
      categories: ["Groceries"],
      totalAmount: 299,
    };
  }
  return baskets[orderIndex % baskets.length];
}
