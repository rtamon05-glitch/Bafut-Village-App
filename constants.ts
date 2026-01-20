import { NjangiGroup, Product, Project, Hospital, NewsItem, Activity, DiasporaGroup, CulturalItem, DiasporaMember, Course, Transaction } from './types';
import { 
  Home, Info, Newspaper, Languages, BookOpen, Users, 
  Heart, ShoppingBag, Sprout, Stethoscope, 
  Hammer, UserPlus, PersonStanding, Radio, Trophy, 
  Globe, AlertTriangle, Phone 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'HOME', label: 'Home', icon: Home },
  { id: 'ABOUT', label: 'About Bafut', icon: Info },
  { id: 'NEWS', label: 'News & Events', icon: Newspaper },
  { id: 'LANGUAGE', label: 'Language & Learning', icon: Languages },
  { id: 'CULTURE', label: 'Culture & Heritage', icon: BookOpen },
  { id: 'MEDIA', label: 'TV & Radio', icon: Radio },
  { id: 'NJANGI', label: 'Digital Njangi', icon: Users },
  { id: 'PROJECTS', label: 'Development Projects', icon: Hammer },
  { id: 'MARKETPLACE', label: 'Marketplace', icon: ShoppingBag },
  { id: 'CROP_DOCTOR', label: 'Crop Doctor (AI)', icon: Sprout },
  { id: 'HEALTH', label: 'Health & Hospitals', icon: Stethoscope },
  { id: 'DONATIONS', label: 'Donations (Unics)', icon: Heart },
  { id: 'YOUTH', label: 'Youth & Tech', icon: UserPlus },
  { id: 'WOMEN', label: 'Women & Families', icon: PersonStanding },
  { id: 'ACTIVITIES', label: 'Activities', icon: Trophy },
  { id: 'DIASPORA', label: 'Diaspora', icon: Globe },
  { id: 'EMERGENCY', label: 'Emergency', icon: AlertTriangle },
  { id: 'CONTACT', label: 'Contact', icon: Phone },
] as const;

export const MOCK_NJANGI_GROUPS: NjangiGroup[] = [
  { id: '1', name: 'Mambu Unity Sisters', contributionAmount: 10000, frequency: 'Monthly', memberCount: 15, nextMeeting: '2023-11-15', totalPool: 150000, unicsAccountNumber: 'UNI-23-8849-01' },
  { id: '2', name: 'Bafut Youth Innovators', contributionAmount: 5000, frequency: 'Weekly', memberCount: 20, nextMeeting: '2023-11-10', totalPool: 100000, unicsAccountNumber: 'UNI-23-9921-05' },
  { id: '3', name: 'Farmers Alliance Agyati', contributionAmount: 25000, frequency: 'Monthly', memberCount: 10, nextMeeting: '2023-11-20', totalPool: 250000, unicsAccountNumber: 'UNI-23-7732-02' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Red Palm Oil', price: 2500, seller: 'Mama Regina', category: 'Food', image: 'https://picsum.photos/300/300?random=1', rating: 4.8, isCoop: false, trustBadge: 'Top Seller' },
  { id: '2', name: 'Handwoven Bamenda Basket', price: 15000, seller: 'Pa Thomas Crafts', category: 'Crafts', image: 'https://picsum.photos/300/300?random=2', rating: 5.0, isCoop: false, trustBadge: 'Verified' },
  { id: '3', name: 'Fresh Huckleberry (Njama Njama)', price: 1000, seller: 'Aweh Farms Coop', category: 'Farm', image: 'https://picsum.photos/300/300?random=3', rating: 4.5, isCoop: true, trustBadge: 'Verified' },
  { id: '4', name: 'Traditional Toghu Fabric', price: 45000, seller: 'Bafut Textiles', category: 'Cultural', image: 'https://picsum.photos/300/300?random=4', rating: 4.9, isCoop: true, trustBadge: 'Top Seller' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Nsem Community Water Project', budget: 5000000, raised: 3200000, status: 'In Progress', description: 'Providing clean pipe-borne water to Nsem quarter.', image: 'https://picsum.photos/800/400?random=10', unicsAccountNumber: 'UNI-PRJ-001' },
  { id: '2', name: 'Bafut Digital Library', budget: 15000000, raised: 1000000, status: 'Planning', description: 'A solar-powered computer lab for students.', image: 'https://picsum.photos/800/400?random=11', unicsAccountNumber: 'UNI-PRJ-004' },
];

export const HOSPITALS: Hospital[] = [
  { id: '1', name: 'Bafut District Hospital', location: 'Njinteh', services: ['General Medicine', 'Maternity', 'Surgery', 'Emergency'], phone: '+237 677 000 000', type: 'Public', unicsAccountNumber: 'UNI-HLT-999' },
  { id: '2', name: 'Sadem Medical Center', location: 'Mambu', services: ['Pediatrics', 'Lab Services', 'Pharmacy'], phone: '+237 675 111 222', type: 'Private', unicsAccountNumber: 'UNI-HLT-888' },
  { id: '3', name: 'Mambu Health Centre', location: 'Mambu', services: ['Maternity', 'Child Welfare'], phone: '+237 677 555 444', type: 'Mission', unicsAccountNumber: 'UNI-HLT-777' },
];

export const MARKET_DAYS = [
  { name: 'Bafut Main Market (Muta)', day: 'Every 8 Days', location: 'Central Palace Road' },
  { name: 'Nsoh Market', day: 'Weekly (Saturdays)', location: 'Nsoh Quarter' },
  { name: 'Njinteh Market', day: 'Weekly (Wednesdays)', location: 'Njinteh' },
];

export const NEWS_ITEMS: NewsItem[] = [
  { id: '1', title: 'The Annual Abin Festival Dates Announced', date: 'Oct 20, 2023', category: 'Culture', image: 'https://picsum.photos/800/600?random=20', summary: 'The palace has officially released the schedule for the 2023 Abin masquerade dance.' },
  { id: '2', title: 'New Solar Panels for District Hospital', date: 'Oct 18, 2023', category: 'Development', image: 'https://picsum.photos/800/600?random=21', summary: 'Diaspora donations have funded a new 24/7 power system for the maternity ward.' },
  { id: '3', title: 'Bafut Rangers Win Regional League', date: 'Oct 15, 2023', category: 'Sports', image: 'https://picsum.photos/800/600?random=22', summary: 'Our local football heroes have secured a spot in the national playoffs.' },
];

export const DIASPORA_GROUPS: DiasporaGroup[] = [
  { id: '1', country: 'United States', region: 'Texas', chapterName: 'Bafut Manjong USA', president: 'Dr. Chi Lucas', members: 450, upcomingEvent: 'Annual Convention - Dallas', njangiPool: 25000, projectContribution: 15000, unicsAccountNumber: 'UNI-INT-001' },
  { id: '2', country: 'United Kingdom', region: 'London', chapterName: 'Bafut Union UK', president: 'Mrs. Lum Clara', members: 200, upcomingEvent: 'Cultural Gala Night - London', njangiPool: 12000, projectContribution: 8000, unicsAccountNumber: 'UNI-INT-002' },
  { id: '3', country: 'Germany', region: 'Berlin', chapterName: 'Bafut Family Deutschland', president: 'Mr. Ngwa Peter', members: 150, upcomingEvent: 'End of Year BBQ - Berlin', njangiPool: 10000, projectContribution: 5000, unicsAccountNumber: 'UNI-INT-003' },
];

export const MOCK_DIASPORA_MEMBERS: DiasporaMember[] = [
  { id: '1', name: 'Dr. Chi Lucas', role: 'President', joined: '2015', image: 'https://picsum.photos/100/100?random=50' },
  { id: '2', name: 'Ma Bih Theresa', role: 'Treasurer', joined: '2016', image: 'https://picsum.photos/100/100?random=51' },
  { id: '3', name: 'Ntumfor Paul', role: 'Member', joined: '2020', image: 'https://picsum.photos/100/100?random=52' },
];

export const ACTIVITIES: Activity[] = [
  { id: '1', title: 'Inter-Quarter Football Tournament', date: 'Dec 10, 2023', location: 'Municipal Stadium', type: 'Village', organizer: 'Youth Council' },
  { id: '2', title: 'Bafut Convention 2024', date: 'July 15, 2024', location: 'Houston, TX', type: 'International', organizer: 'Bafut Manjong USA' },
  { id: '3', title: 'National Cultural Festival', date: 'May 20, 2024', location: 'Yaounde', type: 'National', organizer: 'Min of Culture' },
];

export const CULTURAL_ITEMS: CulturalItem[] = [
  { id: '1', title: 'Abin Festival', description: 'The most significant annual festival, featuring the appearance of the Fon and the masquerades. It marks the end of the traditional year.', type: 'Festival', image: 'https://picsum.photos/id/1040/400/300' },
  { id: '2', title: 'Toghu', description: 'The traditional regalia made of black velvet with intricate hand-stitched embroidery in red, yellow, and white.', type: 'Attire', image: 'https://picsum.photos/id/103/400/300' },
  { id: '3', title: 'The Talking Drum', description: 'Used to communicate messages across the hills of Bafut, especially from the Palace.', type: 'Artifact', image: 'https://picsum.photos/id/145/400/300' },
  { id: '4', title: 'The Achum', description: 'The sacred shrine in the Palace, built with traditional materials. It is the spiritual center of the Fondom.', type: 'Artifact', image: 'https://picsum.photos/id/204/400/300' },
  { id: '5', title: 'Nguu Dance', description: 'A spirited dance performed by youth and warriors, often seen at celebrations and death ceremonies of notables.', type: 'Festival', image: 'https://picsum.photos/id/206/400/300' },
];

export const PROVERBS = [
  { text: "A child who washes his hands clean dines with elders.", meaning: "Respect and good character bring opportunities." },
  { text: "One hand cannot tie a bundle.", meaning: "Unity is strength." },
  { text: "The river that forgets its source will dry up.", meaning: "Never forget your roots." },
];

export const COURSES: Course[] = [
  { id: '1', title: 'Bafut Basics: Greetings & Etiquette', level: 'Beginner', duration: '4 Weeks', enrolled: 120, image: 'https://picsum.photos/id/1/400/300', description: 'Master the essential greetings for elders, peers, and royals.', modules: 8, price: 5000 },
  { id: '2', title: 'Market Day Mastery', level: 'Beginner', duration: '2 Weeks', enrolled: 85, image: 'https://picsum.photos/id/2/400/300', description: 'Learn numbers, bargaining, and trade vocabulary.', modules: 4, price: 2500 },
  { id: '3', title: 'Royal History & Traditions', level: 'Intermediate', duration: '6 Weeks', enrolled: 45, image: 'https://picsum.photos/id/3/400/300', description: 'Deep dive into the Fondom\'s history and cultural rites.', modules: 12, price: 7500 },
  { id: '4', title: 'Bafut Proverbs & Wisdom', level: 'Advanced', duration: 'Self-paced', enrolled: 30, image: 'https://picsum.photos/id/4/400/300', description: 'Understand the deeper meanings behind traditional proverbs.', modules: 6, price: 6000 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX0', type: 'DEPOSIT', amount: 500, date: '2023-01-01', description: 'Welcome Bonus - Palace Gift', status: 'COMPLETED', reference: 'GIFT-001', unicsReference: 'UNI-GIFT-001' },
  { id: 'TX1', type: 'CONTRIBUTION', amount: 10000, date: '2023-10-25', description: 'Mambu Unity Sisters - Oct Contribution', status: 'COMPLETED', reference: 'UNI-29384', unicsReference: 'UNI-TRX-001' },
  { id: 'TX2', type: 'DEPOSIT', amount: 50000, date: '2023-10-20', description: 'Mobile Money Deposit', status: 'COMPLETED', reference: 'MOMO-88374', unicsReference: 'UNI-TRX-002' },
  { id: 'TX3', type: 'WITHDRAWAL', amount: 5000, date: '2023-10-15', description: 'ATM Withdrawal - Bamenda', status: 'COMPLETED', reference: 'ATM-99283', unicsReference: 'UNI-TRX-003' },
  { id: 'TX4', type: 'SAVINGS_INTEREST', amount: 450, date: '2023-10-01', description: 'Unics Monthly Savings Interest', status: 'COMPLETED', reference: 'UNI-INT-01', unicsReference: 'UNI-TRX-004' },
];