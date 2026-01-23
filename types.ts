export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isAnonymous?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatarUrl?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Professional extends User {
  title: string;
  companyName?: string;
  bio?: string;
  specialty: string[];
  hourlyRate: number;
  packages: ServicePackage[];
  rating: number;
  isOnline: boolean;
  languages: string[];
  verified: boolean;
}

export interface SessionNote {
  id: string;
  professionalName: string;
  date: Date;
  summary: string;
  keyTakeaways: string[];
}

export interface WellnessEntry {
  date: string;
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Angry';
  sleepHours: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface Appointment {
  id: string;
  professionalName: string;
  professionalAvatar: string;
  date: Date;
  type: 'Video' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'Credit' | 'Debit';
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
  method?: string;
}

export interface MedicalReport {
  id: string;
  name: string;
  date: Date;
  size: string;
  type: string;
  status: 'Uploaded' | 'Reviewed';
}

export enum MessageSender {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  isError?: boolean;
}

export interface LiveConnectionState {
  isConnected: boolean;
  isTalking: boolean;
  volume: number;
}

export interface AnalyticsData {
  name: string;
  value: number;
}