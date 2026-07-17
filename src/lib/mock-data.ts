export type Membership = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface Plan {
  name: Membership;
  price: number;
  surveyLimit: string;
  multiplier: string;
  priority: string;
  benefits: string[];
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Bronze",
    price: 0,
    surveyLimit: "10 / day",
    multiplier: "1.0x",
    priority: "Standard queue",
    benefits: [
      "Access to standard surveys",
      "Weekly withdrawals",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    name: "Silver",
    price: 12,
    surveyLimit: "30 / day",
    multiplier: "1.4x",
    priority: "Priority queue",
    benefits: [
      "All Bronze benefits",
      "Higher paying surveys",
      "Bi-weekly bonuses",
      "Faster reward crediting",
    ],
  },
  {
    name: "Gold",
    price: 29,
    surveyLimit: "80 / day",
    multiplier: "1.8x",
    priority: "Fast lane",
    benefits: [
      "All Silver benefits",
      "Exclusive brand studies",
      "Instant withdrawals",
      "Dedicated support",
    ],
    featured: true,
  },
  {
    name: "Platinum",
    price: 59,
    surveyLimit: "Unlimited",
    multiplier: "2.5x",
    priority: "White-glove",
    benefits: [
      "All Gold benefits",
      "VIP research panels",
      "2.5x reward multiplier",
      "Personal account manager",
    ],
  },
];

export interface Survey {
  id: string;
  name: string;
  reward: number;
  time: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  membership: Membership;
}

export const surveys: Survey[] = [
  { id: "s1", name: "Consumer habits in streaming", reward: 3.5, time: 8, difficulty: "Easy", category: "Media", membership: "Bronze" },
  { id: "s2", name: "Remote work productivity tools", reward: 5.0, time: 12, difficulty: "Medium", category: "Technology", membership: "Silver" },
  { id: "s3", name: "Health and wellness routines", reward: 4.25, time: 10, difficulty: "Easy", category: "Health", membership: "Bronze" },
  { id: "s4", name: "Financial planning preferences", reward: 8.75, time: 18, difficulty: "Medium", category: "Finance", membership: "Gold" },
  { id: "s5", name: "Travel booking behavior", reward: 6.5, time: 14, difficulty: "Medium", category: "Travel", membership: "Silver" },
  { id: "s6", name: "AI adoption in the workplace", reward: 12.0, time: 22, difficulty: "Hard", category: "Technology", membership: "Gold" },
  { id: "s7", name: "Grocery shopping trends", reward: 2.75, time: 6, difficulty: "Easy", category: "Retail", membership: "Bronze" },
  { id: "s8", name: "Sustainability in fashion", reward: 15.0, time: 25, difficulty: "Hard", category: "Fashion", membership: "Platinum" },
  { id: "s9", name: "Smart home device usage", reward: 5.5, time: 12, difficulty: "Medium", category: "Technology", membership: "Silver" },
];

export const surveyQuestions = [
  {
    id: "q1",
    text: "How often do you use streaming services in a typical week?",
    options: ["Rarely", "1–3 days", "4–6 days", "Every day"],
  },
  {
    id: "q2",
    text: "Which platform do you use most frequently?",
    options: ["Netflix", "Prime Video", "Disney+", "Other"],
  },
  {
    id: "q3",
    text: "What matters most when choosing a service?",
    options: ["Content library", "Price", "Original productions", "Interface"],
  },
  {
    id: "q4",
    text: "Would you recommend your primary service to others?",
    options: ["Definitely", "Probably", "Unsure", "No"],
  },
  {
    id: "q5",
    text: "How much do you spend on streaming per month?",
    options: ["Under $10", "$10–$25", "$25–$50", "Over $50"],
  },
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "earn" | "withdraw" | "bonus" | "referral";
  amount: number;
  status: "Completed" | "Pending" | "Processing";
}

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-07-14", description: "Consumer habits in streaming", type: "earn", amount: 3.5, status: "Completed" },
  { id: "t2", date: "2026-07-13", description: "Referral bonus — Anya K.", type: "referral", amount: 5.0, status: "Completed" },
  { id: "t3", date: "2026-07-12", description: "Withdrawal to PayPal", type: "withdraw", amount: -45.0, status: "Processing" },
  { id: "t4", date: "2026-07-10", description: "AI adoption in the workplace", type: "earn", amount: 12.0, status: "Completed" },
  { id: "t5", date: "2026-07-08", description: "Weekly membership bonus", type: "bonus", amount: 4.0, status: "Completed" },
  { id: "t6", date: "2026-07-05", description: "Travel booking behavior", type: "earn", amount: 6.5, status: "Pending" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
}

export const achievements: Achievement[] = [
  { id: "a1", name: "First Step", description: "Complete your first survey", progress: 1, target: 1 },
  { id: "a2", name: "Consistent Voice", description: "Complete 25 surveys", progress: 18, target: 25 },
  { id: "a3", name: "Century Club", description: "Complete 100 surveys", progress: 42, target: 100 },
  { id: "a4", name: "Ambassador", description: "Invite 10 friends", progress: 4, target: 10 },
  { id: "a5", name: "High Earner", description: "Earn $500 in rewards", progress: 217, target: 500 },
  { id: "a6", name: "Globetrotter", description: "Complete surveys from 5 categories", progress: 5, target: 5 },
];

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const notifications: AppNotification[] = [
  { id: "n1", title: "Reward credited", body: "$12.00 has been added to your wallet for completing AI adoption in the workplace.", time: "2h ago", read: false },
  { id: "n2", title: "New survey available", body: "A high-paying study in your category is now open.", time: "5h ago", read: false },
  { id: "n3", title: "Withdrawal processing", body: "Your $45 withdrawal to PayPal is being processed.", time: "1d ago", read: false },
  { id: "n4", title: "Referral joined", body: "Anya K. joined using your referral link.", time: "2d ago", read: true },
  { id: "n5", title: "Membership tip", body: "Upgrade to Gold to unlock instant withdrawals.", time: "4d ago", read: true },
];

export const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "Spain", "Italy", "Brazil", "Mexico", "Japan", "Singapore", "India",
];
