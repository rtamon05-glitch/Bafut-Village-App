export type ViewState = 
  | 'HOME' 
  | 'ABOUT' 
  | 'NEWS' 
  | 'LANGUAGE' 
  | 'CULTURE' 
  | 'NJANGI' 
  | 'DONATIONS' 
  | 'MARKETPLACE' 
  | 'CROP_DOCTOR' 
  | 'HEALTH' 
  | 'PROJECTS' 
  | 'YOUTH' 
  | 'WOMEN' 
  | 'MEDIA' 
  | 'ACTIVITIES' 
  | 'DIASPORA' 
  | 'EMERGENCY' 
  | 'CONTACT'
  | 'SERVICES'; // Monetization Hub

export interface NjangiGroup {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: string;
  memberCount: number;
  nextMeeting: string;
  totalPool: number;
  unicsAccountNumber: string; // Linked Unics Bank Account
}

export interface NjangiMember {
  id: string;
  name: string;
  quarter: string;
  contributions: number;
  trustScore: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  category: 'Farm' | 'Crafts' | 'Livestock' | 'Food' | 'Cultural';
  image: string;
  rating: number;
  isCoop: boolean;
  trustBadge: 'New' | 'Verified' | 'Top Seller';
  isBoosted?: boolean; // Monetization feature
}

export interface Project {
  id: string;
  name: string;
  budget: number;
  raised: number;
  status: 'Planning' | 'In Progress' | 'Completed';
  image: string;
  description: string;
  unicsAccountNumber: string; // Linked Unics Bank Account for Donations
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  services: string[];
  phone: string;
  type: 'Public' | 'Private' | 'Mission';
  unicsAccountNumber?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Village' | 'National' | 'International';
  organizer: string;
}

export interface DiasporaGroup {
  id: string;
  country: string;
  region: string;
  chapterName: string;
  president: string;
  members: number;
  upcomingEvent: string;
  njangiPool: number;
  projectContribution: number;
  unicsAccountNumber: string; // Linked Unics Bank Account
}

export interface DiasporaMember {
  id: string;
  name: string;
  role: string;
  joined: string;
  image: string;
}

export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'Festival' | 'Attire' | 'Artifact' | 'Proverb';
}

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  enrolled: number;
  image: string;
  description: string;
  modules: number;
  price: number; // Monetization
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'CONTRIBUTION' | 'LOAN_DISBURSEMENT' | 'LOAN_REPAYMENT' | 'SAVINGS_INTEREST' | 'DONATION' | 'TRANSFER' | 'SERVICE_FEE';
  amount: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
  unicsReference?: string; // Internal Unics transaction ID
  fee?: number;
}