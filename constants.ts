
import { Professional, UserRole, SessionNote, Appointment, Medication, Transaction, MedicalReport } from "./types";

export const APP_NAME = "LESLEYCARE™";
export const TAGLINE = "Your Mind. Your Health. Your Care.";
export const CEO_NAME = "Rev. Lesley Mbuagbor";

export const DR_LESLIE_SYSTEM_INSTRUCTION = `
You are Dr. Leslie, the AI Care Guide for LESLEYCARE™. 
Your role is to function as a compassionate, first-point-of-contact for mental health and general medical guidance.

CORE RULES:
1. WELCOME: Be warm, empathetic, and professional.
2. NO DIAGNOSIS: You must NEVER diagnose medical or psychological conditions or prescribe medication.
3. INTAKE: Conduct short intake conversations to understand the user's needs.
4. REDIRECT: Suggest booking a session with a licensed Human Psychologist or General Doctor on the platform for clinical needs.
5. SUPPORT: Provide CBT-style coping tools, emotional validation, and general wellness advice.
6. SAFETY: If you detect crisis language (suicide, self-harm, violence), provide immediate emergency resources and strictly advise them to call local emergency services.
7. ANTI-CONTACT: You must strictly enforce platform policy. If a user tries to share phone numbers, emails, or social media handles, GENTLY STOP THEM. Explain that for their safety and privacy, all communication must stay on LESLEYCARE™.

Tone: Professional, Warm, Global, Trustworthy.
`;

export const TERMS_AND_CONDITIONS_TEXT = `
By registering as a professional on LESLEYCARE™, you agree to the following strictly enforced terms:
1. **Free Registration:** Listing your profile is free of charge.
2. **Platform Fee:** LESLEYCARE™ retains a **20% commission** on all completed sessions.
3. **Global Pricing Strategy:** Minimum consultation fee is set to **$20.00**.
4. **Strict No-Contact Policy:** All communication and payments must occur within the platform.
`;

export const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=2070"
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Dr. Sarah Mbeki',
    email: 'sarah@lesleycare.com',
    companyName: 'Mbeki Mind Wellness',
    bio: 'Specializing in CBT and trauma recovery with a focus on resilient mental architecture.',
    role: UserRole.PROFESSIONAL,
    title: 'Clinical Psychologist',
    specialty: ['Anxiety', 'Depression', 'Trauma'],
    hourlyRate: 50,
    packages: [],
    rating: 4.9,
    isOnline: true,
    languages: ['English', 'Swahili'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'p2',
    name: 'Marcus Thorne',
    email: 'marcus@lesleycare.com',
    companyName: 'SoulBridge Companionship',
    bio: 'Dedicated to fighting the global epidemic of loneliness. Marcus provides active listening and companionship for those needing a present, empathetic human connection.',
    role: UserRole.PROFESSIONAL,
    title: 'Companionship Specialist',
    specialty: ['Loneliness', 'Active Listening', 'Social Connection'],
    hourlyRate: 25,
    packages: [],
    rating: 5.0,
    isOnline: true,
    languages: ['English'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus'
  },
  {
    id: 'p3',
    name: 'Dr. James Chen',
    email: 'james@lesleycare.com',
    companyName: 'Global Health Partners',
    bio: 'Board-certified GP focused on preventive family medicine and remote triage.',
    role: UserRole.PROFESSIONAL,
    title: 'General Practitioner',
    specialty: ['Family Medicine', 'Triage'],
    hourlyRate: 35,
    packages: [],
    rating: 4.8,
    isOnline: false,
    languages: ['English', 'Mandarin'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=james'
  },
  {
    id: 'p4',
    name: 'Elena Rodriguez',
    email: 'elena@lesleycare.com',
    companyName: 'Peak Performance Mind',
    bio: 'Mental health coach helping high-performers manage stress and achieve peak cognitive flow while maintaining emotional balance.',
    role: UserRole.PROFESSIONAL,
    title: 'Mental Health Coach',
    specialty: ['Stress Management', 'Peak Performance', 'Burnout'],
    hourlyRate: 45,
    packages: [],
    rating: 4.7,
    isOnline: true,
    languages: ['English', 'Spanish'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=elena'
  },
  {
    id: 'p5',
    name: 'Dr. Kofi Asante',
    email: 'kofi@lesleycare.com',
    companyName: 'Asante Psychiatric Care',
    bio: 'Psychiatrist specializing in mood disorders and neuro-psychiatric evaluations via telehealth.',
    role: UserRole.PROFESSIONAL,
    title: 'Psychiatrist',
    specialty: ['Bipolar Disorder', 'ADHD', 'Clinical Depression'],
    hourlyRate: 120,
    packages: [],
    rating: 4.9,
    isOnline: false,
    languages: ['English', 'Twi'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=kofi'
  },
  {
    id: 'p6',
    name: 'Dr. Amani Okafor',
    email: 'amani@lesleycare.com',
    companyName: 'Roots & Leaves',
    bio: 'Holistic Phytotherapy expert merging traditional African herbal wisdom with modern pharmacology.',
    role: UserRole.PROFESSIONAL,
    title: 'Phytotherapy Specialist',
    specialty: ['Natural Medicine', 'Herbal Remedies'],
    hourlyRate: 40,
    packages: [],
    rating: 4.9,
    isOnline: true,
    languages: ['English', 'Igbo'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=amani'
  },
  {
    id: 'p7',
    name: 'Maya Srinivasan',
    email: 'maya@lesleycare.com',
    companyName: 'Quiet Space Therapy',
    bio: 'Specialist in treating social isolation and chronic loneliness through behavioral activation and community-reintegration coaching.',
    role: UserRole.PROFESSIONAL,
    title: 'Loneliness & Recovery Coach',
    specialty: ['Social Anxiety', 'Isolation', 'Grief'],
    hourlyRate: 30,
    packages: [],
    rating: 4.8,
    isOnline: true,
    languages: ['English', 'Hindi'],
    verified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=maya'
  }
];

export const MOCK_SESSION_NOTES: SessionNote[] = [
  {
    id: 'sn1',
    professionalName: 'Dr. Sarah Mbeki',
    date: new Date('2024-05-10'),
    summary: 'Patient discussed anxiety regarding work transition.',
    keyTakeaways: ['Practice 4-7-8 breathing', 'Schedule 15min worry time']
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'apt1',
        professionalName: 'Dr. Sarah Mbeki',
        professionalAvatar: 'https://i.pravatar.cc/150?u=sarah',
        date: new Date(Date.now() + 86400000),
        type: 'Video',
        status: 'Upcoming'
    }
];

export const MOCK_MEDICATIONS: Medication[] = [
    { id: 'm1', name: 'Vitamin D3', dosage: '2000 IU', time: '08:00 AM', taken: true },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: new Date(), amount: 60.00, type: 'Credit', description: 'Session with Dr. Sarah Mbeki', status: 'Completed', method: 'PayPal' },
];

export const MOCK_REPORTS: MedicalReport[] = [
  { id: 'r1', name: 'Blood_Test_Results_May2024.pdf', date: new Date(Date.now() - 432000000), size: '2.4 MB', type: 'PDF', status: 'Reviewed' },
];

export const WORLD_LANGUAGES = [
  "English", "Spanish", "French", "Swahili", "Mandarin", "Hindi", "Arabic", "Portuguese", "German", "Japanese", "Igbo", "Twi"
].sort();
