import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { ViewState, NjangiGroup, Product, Project, NewsItem, Activity, DiasporaGroup, Hospital, CulturalItem, DiasporaMember, Course, Transaction } from './types';
import { MOCK_NJANGI_GROUPS, MOCK_PRODUCTS, MOCK_PROJECTS, MARKET_DAYS, HOSPITALS, NEWS_ITEMS, DIASPORA_GROUPS, ACTIVITIES, CULTURAL_ITEMS, PROVERBS, MOCK_DIASPORA_MEMBERS, COURSES, MOCK_TRANSACTIONS } from './constants';
import { analyzeCropImage, chatWithVillageAi, translateToBafut } from './services/geminiService';
import { 
  Leaf, Search, Upload, AlertCircle, Heart, User, 
  MapPin, Play, Mic, ShoppingCart, ArrowRight,
  Languages, Hammer, Calendar, Globe, Plus, Phone,
  ChevronRight, Users, BookOpen, Star, ShieldCheck,
  TrendingUp, Volume2, HelpCircle, GraduationCap, CheckCircle, Mail, Map, ShieldAlert,
  Flame, Siren, Send, Sprout, Landmark, CreditCard, ArrowDownLeft, ArrowUpRight, History, Wallet, X,
  Building, BadgeCheck, Stethoscope, Radio, Video, Music, Info, Share2, Clock, 
  MessageCircle, Bot, Zap, Baby, Laptop, Lightbulb, QrCode, Crown, Smartphone, ArrowRightLeft, Gem,
  CreditCard as CreditCardIcon, Trophy
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  // State for Features
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropAnalysis, setCropAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Chat / AI Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'ai', text: string}[]>([
    { sender: 'ai', text: 'Mankeru! I am the Bafut Village Intelligence. Ask me about our history, translate a phrase, or ask for farming advice.' }
  ]);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [translationInput, setTranslationInput] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // New States
  const [marketFilter, setMarketFilter] = useState('All');
  const [diasporaTab, setDiasporaTab] = useState<'ALL' | 'CREATE' | 'MY_GROUP'>('ALL');
  
  // Njangi & Wallet States
  const [walletBalance, setWalletBalance] = useState(450500); // Initial balance with welcome bonus included
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [njangiModal, setNjangiModal] = useState<{
    isOpen: boolean;
    type: 'DEPOSIT' | 'WITHDRAW' | 'CONTRIBUTE' | 'LOAN' | 'CREATE_ACCOUNT' | 'SAVINGS' | 'DONATION' | 'TRANSFER';
    group?: NjangiGroup;
    targetName?: string;
    targetAccount?: string;
  }>({ isOpen: false, type: 'DEPOSIT' });
  const [amountInput, setAmountInput] = useState('');
  const [recipientInput, setRecipientInput] = useState(''); // For transfers
  const [paymentProvider, setPaymentProvider] = useState<'MOMO' | 'CARD'>('MOMO'); // New state for provider
  
  // Trust Score State
  const [trustScore, setTrustScore] = useState(785);

  // Digital ID State
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);

  // Language Course States
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  // Emergency State
  const [sosActive, setSosActive] = useState(false);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  // --- FEATURE HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setCropImage(base64String);
        setCropAnalysis('');
        setIsAnalyzing(true);
        const base64Data = base64String.split(',')[1]; 
        const result = await analyzeCropImage(base64Data);
        setCropAnalysis(result);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');
    setIsChatting(true);
    
    const result = await chatWithVillageAi(userMsg);
    setChatHistory(prev => [...prev, { sender: 'ai', text: result }]);
    setIsChatting(false);
  };

  const handleTranslate = async (textOverride?: string) => {
    const text = textOverride || translationInput;
    if (!text.trim()) return;
    
    setTranslationInput(text); // Update UI if override used
    setIsTranslating(true);
    const result = await translateToBafut(text);
    setTranslationResult(result);
    setIsTranslating(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleEnrollment = (courseId: string) => {
    setEnrolledCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const handleNjangiTransaction = () => {
    const amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) return;

    // Fees Configuration (Revenue Stream)
    const WITHDRAWAL_FEE_PERCENT = 0.02; // 2% fee
    const TRANSFER_FEE_FIXED = 100; // 100 XAF fixed fee

    let newTx: Transaction = {
      id: `TX${Date.now()}`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
      description: '',
      type: 'DEPOSIT', // default
      unicsReference: `UNI-${Math.floor(Math.random() * 1000000)}`
    };

    if (njangiModal.type === 'DEPOSIT') {
      newTx.type = 'DEPOSIT';
      newTx.description = paymentProvider === 'MOMO' 
         ? `Deposit via Mobile Money (${recipientInput})` 
         : `Deposit via Card (**** ${recipientInput.slice(-4)})`;
      setWalletBalance(prev => prev + amount);
      // Gamification: Increase trust score slightly on deposit
      setTrustScore(prev => Math.min(850, prev + 5));
    } 
    else if (njangiModal.type === 'WITHDRAW') {
      const fee = amount * WITHDRAWAL_FEE_PERCENT;
      const totalDeduction = amount + fee;
      
      if (totalDeduction > walletBalance) {
        alert(`Insufficient funds. You need ${totalDeduction.toLocaleString()} XAF (incl. fees)`);
        return;
      }
      newTx.type = 'WITHDRAWAL';
      newTx.description = 'Mobile Money Withdrawal (via Unics)';
      newTx.fee = fee;
      setWalletBalance(prev => prev - totalDeduction);
      alert(`Withdrawal initiated to ${recipientInput || 'your number'}. Fee: ${fee} XAF.`);
    } 
    else if (njangiModal.type === 'TRANSFER') {
      const totalDeduction = amount + TRANSFER_FEE_FIXED;
      
      if (totalDeduction > walletBalance) {
        alert(`Insufficient funds. Transfer cost: ${totalDeduction.toLocaleString()} XAF`);
        return;
      }
      newTx.type = 'TRANSFER';
      newTx.description = `Transfer to ${recipientInput}`;
      newTx.fee = TRANSFER_FEE_FIXED;
      setWalletBalance(prev => prev - totalDeduction);
    }
    else if (njangiModal.type === 'CONTRIBUTE' && njangiModal.group) {
      if (amount > walletBalance) {
        alert("Insufficient funds in wallet");
        return;
      }
      newTx.type = 'CONTRIBUTION';
      newTx.description = `Contribution: ${njangiModal.group.name}`;
      setWalletBalance(prev => prev - amount);
      // Gamification: Increase trust score on payment
      setTrustScore(prev => Math.min(850, prev + 10));
    } else if (njangiModal.type === 'LOAN' && njangiModal.group) {
       newTx.type = 'LOAN_DISBURSEMENT';
       newTx.description = `Loan from ${njangiModal.group.name}`;
       setWalletBalance(prev => prev + amount);
    } else if (njangiModal.type === 'SAVINGS') {
       if (amount > walletBalance) {
         alert("Insufficient funds");
         return;
       }
       newTx.type = 'DEPOSIT'; 
       newTx.description = 'Transfer to High-Yield Savings';
       setWalletBalance(prev => prev - amount);
    } else if (njangiModal.type === 'DONATION') {
       if (amount > walletBalance) {
         alert("Insufficient funds in wallet");
         return;
       }
       newTx.type = 'DONATION';
       newTx.description = `Donation to ${njangiModal.targetName}`;
       newTx.reference = `TO: ${njangiModal.targetAccount}`;
       setWalletBalance(prev => prev - amount);
    }

    setTransactions(prev => [newTx, ...prev]);
    setNjangiModal({ ...njangiModal, isOpen: false });
    setAmountInput('');
    setRecipientInput('');
  };

  const activateSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
      alert("Emergency Signal Sent! Village Vigilante and Medical teams have been notified of your location.");
    }, 3000);
  };

  // --- RENDER FUNCTIONS ---

  const renderHome = () => (
    <div className="space-y-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center text-center px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-pulse-slow"
          style={{ backgroundImage: 'url("https://picsum.photos/id/1015/1200/800")', filter: 'brightness(0.6)' }} 
        ></div>
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Bafut</h1>
          <p className="text-xl opacity-90 mb-8 drop-shadow-md">
            The Digital Heart of the Fondom. Preserving Heritage. Building the Future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentView('NJANGI')}
              className="bg-[#6A0F1A] hover:bg-[#8B1522] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg transform hover:-translate-y-1"
            >
              My Njangi
            </button>
            <button 
              onClick={() => setIsIdModalOpen(true)}
              className="bg-white hover:bg-gray-100 text-[#0B2D6B] px-8 py-3 rounded-full font-semibold transition-all shadow-lg transform hover:-translate-y-1 flex items-center"
            >
               <QrCode size={18} className="mr-2"/> Digital ID
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setCurrentView('LANGUAGE')} className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all border-l-4 border-[#0B2D6B]">
          <Languages className="text-[#6A0F1A] mb-4" size={32} />
          <h3 className="text-lg font-bold text-[#0B2D6B]">Language AI</h3>
          <p className="text-sm text-gray-500 mt-2">Learn to read, write & speak Bafut.</p>
        </div>
        <div onClick={() => setCurrentView('SERVICES')} className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all border-l-4 border-[#0B2D6B]">
          <Gem className="text-[#6A0F1A] mb-4" size={32} />
          <h3 className="text-lg font-bold text-[#0B2D6B]">Premium Services</h3>
          <p className="text-sm text-gray-500 mt-2">Verified status, boosts & certificates.</p>
        </div>
        <div onClick={() => setCurrentView('MEDIA')} className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all border-l-4 border-[#0B2D6B]">
          <Play className="text-[#6A0F1A] mb-4" size={32} />
          <h3 className="text-lg font-bold text-[#0B2D6B]">TV & Radio</h3>
          <p className="text-sm text-gray-500 mt-2">Live culture, news & music.</p>
        </div>
        <div onClick={() => setCurrentView('NJANGI')} className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all border-l-4 border-[#0B2D6B]">
          <Landmark className="text-[#6A0F1A] mb-4" size={32} />
          <h3 className="text-lg font-bold text-[#0B2D6B]">Digital Njangi</h3>
          <p className="text-sm text-gray-500 mt-2">Manage groups & savings.</p>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[#0B2D6B] mb-4">About Bafut</h2>
      <div className="glass-card p-6 rounded-2xl">
        <p className="text-gray-700 leading-relaxed">
          Bafut is one of the two largest Fondoms (Kingdoms) in the North West Region of Cameroon.
          Rich in culture and tradition, it is known for the Bafut Palace, a UNESCO World Heritage tentative site,
          and the annual Abin Festival.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
           <img src="https://picsum.photos/id/1040/400/300" alt="Bafut Palace" className="rounded-xl w-full h-40 object-cover" />
           <img src="https://picsum.photos/id/103/400/300" alt="Culture" className="rounded-xl w-full h-40 object-cover" />
           <img src="https://picsum.photos/id/145/400/300" alt="Tradition" className="rounded-xl w-full h-40 object-cover" />
        </div>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold text-[#0B2D6B]">News & Events</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS_ITEMS.map(item => (
             <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/>
                <div className="p-6">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#6A0F1A] uppercase">{item.category}</span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                   </div>
                   <h3 className="font-bold text-lg text-[#0B2D6B] mb-2">{item.title}</h3>
                   <p className="text-sm text-gray-600">{item.summary}</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderCulture = () => (
    <div className="space-y-8 animate-fade-in">
       <h2 className="text-2xl font-bold text-[#0B2D6B]">Culture & Heritage</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CULTURAL_ITEMS.map(item => (
             <div key={item.id} className="glass-card p-6 rounded-2xl flex gap-4 hover:shadow-lg transition-all">
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0"/>
                <div>
                   <span className="text-xs font-bold text-[#6A0F1A] uppercase">{item.type}</span>
                   <h3 className="font-bold text-lg text-[#0B2D6B] mb-1">{item.title}</h3>
                   <p className="text-sm text-gray-600">{item.description}</p>
                </div>
             </div>
          ))}
       </div>
       
       <div className="bg-[#0B2D6B] rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center"><BookOpen className="mr-2"/> Wise Proverbs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {PROVERBS.map((p, idx) => (
                <div key={idx} className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                   <p className="text-lg font-serif italic mb-4">"{p.text}"</p>
                   <p className="text-sm text-blue-200 uppercase font-bold tracking-wider">Meaning</p>
                   <p className="text-sm text-white/90">{p.meaning}</p>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold text-[#0B2D6B]">Bafut Community Radio & TV</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Radio size={40}/>
             </div>
             <h3 className="text-2xl font-bold text-[#0B2D6B]">Radio Bafut</h3>
             <p className="text-gray-500 mb-6">FM 105.4 - The Voice of the Palace</p>
             <button className="px-8 py-3 bg-[#6A0F1A] text-white rounded-full font-bold shadow-lg flex items-center">
                <Play size={20} className="mr-2"/> Listen Live
             </button>
             <div className="mt-8 w-full">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Now Playing</p>
                <div className="bg-gray-100 p-3 rounded-xl flex items-center">
                   <Music size={18} className="text-gray-500 mr-3"/>
                   <span className="text-sm font-medium text-gray-700">Traditional Bottle Dance - Nguu Group</span>
                </div>
             </div>
          </div>

          <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Video size={40}/>
             </div>
             <h3 className="text-2xl font-bold text-[#0B2D6B]">Bafut TV</h3>
             <p className="text-gray-500 mb-6">Culture, News & Development Updates</p>
             <button className="px-8 py-3 bg-[#0B2D6B] text-white rounded-full font-bold shadow-lg flex items-center">
                <Play size={20} className="mr-2"/> Watch Stream
             </button>
             <div className="mt-8 w-full text-left">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">Upcoming Programs</p>
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex justify-between"><span>Palace News</span> <span className="font-bold">18:00</span></li>
                    <li className="flex justify-between"><span>Learn Bafut</span> <span className="font-bold">19:30</span></li>
                 </ul>
             </div>
          </div>
       </div>
    </div>
  );

  const renderServices = () => (
     <div className="space-y-8 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto">
           <h2 className="text-3xl font-bold text-[#0B2D6B] mb-2">Premium Village Services</h2>
           <p className="text-gray-500">Upgrade your experience, build trust, and grow your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Verification */}
           <div className="glass-card p-8 rounded-3xl border-2 border-transparent hover:border-[#0B2D6B] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#0B2D6B] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <BadgeCheck size={48} className="text-[#0B2D6B] mb-4"/>
              <h3 className="text-xl font-bold text-gray-800">Verified Citizen</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">Get the blue tick on your profile. Increases trust for Njangi loans and Marketplace sales.</p>
              <div className="text-2xl font-bold text-[#0B2D6B] mb-6">2,500 XAF<span className="text-sm font-normal text-gray-400">/year</span></div>
              <button className="w-full py-3 bg-[#0B2D6B] text-white rounded-xl font-bold shadow-lg group-hover:bg-[#1a3b7d]">Get Verified</button>
           </div>

           {/* Market Boost */}
           <div className="glass-card p-8 rounded-3xl border-2 border-transparent hover:border-[#6A0F1A] transition-all group">
              <TrendingUp size={48} className="text-[#6A0F1A] mb-4"/>
              <h3 className="text-xl font-bold text-gray-800">Market Boost</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">Promote your farm produce or crafts to the top of the Marketplace for 7 days.</p>
              <div className="text-2xl font-bold text-[#6A0F1A] mb-6">1,000 XAF<span className="text-sm font-normal text-gray-400">/week</span></div>
              <button className="w-full py-3 bg-[#6A0F1A] text-white rounded-xl font-bold shadow-lg group-hover:bg-[#8B1522]">Boost Product</button>
           </div>

           {/* Certificates */}
           <div className="glass-card p-8 rounded-3xl border-2 border-transparent hover:border-yellow-500 transition-all group">
              <GraduationCap size={48} className="text-yellow-600 mb-4"/>
              <h3 className="text-xl font-bold text-gray-800">Official Certificates</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">Get a Council-stamped digital certificate upon completing Language or Tech courses.</p>
              <div className="text-2xl font-bold text-yellow-600 mb-6">5,000 XAF<span className="text-sm font-normal text-gray-400">/course</span></div>
              <button className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold shadow-lg group-hover:bg-yellow-600">Claim Certificate</button>
           </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-700"><Landmark size={24}/></div>
              <div>
                 <h4 className="font-bold text-[#0B2D6B] text-lg">Transaction Fees</h4>
                 <p className="text-sm text-gray-500">Transparent pricing for financial sustainability.</p>
              </div>
           </div>
           <div className="flex gap-8 text-sm text-gray-600">
              <div>
                 <span className="block font-bold text-gray-800">Transfers</span>
                 100 XAF Fixed
              </div>
              <div>
                 <span className="block font-bold text-gray-800">Withdrawals</span>
                 2% (via Unics)
              </div>
              <div>
                 <span className="block font-bold text-gray-800">Sales Commission</span>
                 3% (Marketplace)
              </div>
           </div>
        </div>
     </div>
  );

  const renderNjangi = () => (
    <div className="space-y-6 animate-fade-in">
       {/* Wallet Card */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-gradient-to-r from-[#0B2D6B] to-[#1a3b7d] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
               <Landmark size={200} />
            </div>
            <div className="relative z-10">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-blue-200 text-sm font-medium mb-1">Total Balance</p>
                     <h2 className="text-4xl font-bold mb-6">{walletBalance.toLocaleString()} XAF</h2>
                  </div>
                  <div onClick={() => setIsIdModalOpen(true)} className="cursor-pointer bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                     <QrCode size={24} />
                  </div>
               </div>
               
               <div className="flex gap-4 flex-wrap">
                  <button 
                    onClick={() => setNjangiModal({ isOpen: true, type: 'DEPOSIT' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-3 rounded-xl shadow-lg transition-all font-bold"
                  >
                     <ArrowDownLeft size={18}/> Deposit
                  </button>
                  <button 
                    onClick={() => setNjangiModal({ isOpen: true, type: 'TRANSFER' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl backdrop-blur-sm transition-all font-bold"
                  >
                     <ArrowRightLeft size={18}/> Send
                  </button>
                  <button 
                    onClick={() => setNjangiModal({ isOpen: true, type: 'WITHDRAW' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl backdrop-blur-sm transition-all font-bold"
                  >
                     <ArrowUpRight size={18}/> Withdraw
                  </button>
               </div>
            </div>
         </div>

         {/* Trust Score Card */}
         <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Financial Trust Score</h3>
               <div className="flex items-end gap-2">
                  <span className={`text-4xl font-bold ${trustScore > 700 ? 'text-green-600' : 'text-yellow-600'}`}>{trustScore}</span>
                  <span className="text-gray-400 text-sm mb-1">/ 850</span>
               </div>
               <p className="text-xs text-gray-500 mt-2">Excellent standing. Eligible for loans.</p>
            </div>
            <div className="mt-4">
               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(trustScore/850)*100}%` }}></div>
               </div>
               <p className="text-[10px] text-gray-400">Based on Njangi contributions & savings history.</p>
            </div>
         </div>
       </div>

       {/* Actions Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setNjangiModal({ isOpen: true, type: 'SAVINGS' })} className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all">
             <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Wallet size={20}/></div>
             <span className="text-sm font-bold text-gray-700">Savings</span>
          </button>
          <button className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all">
             <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><History size={20}/></div>
             <span className="text-sm font-bold text-gray-700">History</span>
          </button>
          <button className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all">
             <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Users size={20}/></div>
             <span className="text-sm font-bold text-gray-700">Groups</span>
          </button>
          <button className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all">
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Landmark size={20}/></div>
             <span className="text-sm font-bold text-gray-700">Unics</span>
          </button>
       </div>

       {/* Njangi Groups */}
       <div>
          <h3 className="font-bold text-[#0B2D6B] text-lg mb-4">My Njangi Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {MOCK_NJANGI_GROUPS.map(group => (
                <div key={group.id} className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all border-l-4 border-[#0B2D6B]">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0B2D6B] font-bold">
                         {group.name.substring(0,2).toUpperCase()}
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Active</span>
                   </div>
                   <h4 className="font-bold text-lg text-[#0B2D6B] mb-1">{group.name}</h4>
                   <p className="text-sm text-gray-500 mb-4">{group.memberCount} Members • {group.frequency}</p>
                   
                   <div className="space-y-2 mb-6 bg-gray-50 p-3 rounded-xl">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Contribution</span>
                         <span className="font-bold text-gray-800">{group.contributionAmount.toLocaleString()} XAF</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                         <span className="text-[#0B2D6B] font-bold">Total Group Pool</span>
                         <span className="font-bold text-green-600">{group.totalPool.toLocaleString()} XAF</span>
                      </div>
                   </div>

                   <button 
                      onClick={() => setNjangiModal({ isOpen: true, type: 'CONTRIBUTE', group })}
                      className="w-full py-3 bg-[#0B2D6B] text-white rounded-xl font-bold text-sm hover:bg-[#1a3b7d] transition-colors flex items-center justify-center"
                   >
                      Pay Njangi Dues
                   </button>
                </div>
             ))}
          </div>
       </div>

       {/* Recent Transactions */}
       <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0B2D6B] text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
             {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:pb-0 last:border-0">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                         tx.type === 'DEPOSIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'SAVINGS_INTEREST' 
                           ? 'bg-green-100 text-green-600' 
                           : tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                         {tx.type === 'DEPOSIT' || tx.type === 'SAVINGS_INTEREST' ? <ArrowDownLeft size={20}/> : 
                          tx.type === 'TRANSFER' ? <ArrowRightLeft size={20}/> : <ArrowUpRight size={20}/>}
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm">{tx.description}</p>
                         <p className="text-xs text-gray-500">{tx.date} • {tx.status} {tx.fee ? `• Fee: ${tx.fee}` : ''}</p>
                      </div>
                   </div>
                   <span className={`font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'SAVINGS_INTEREST'
                         ? 'text-green-600' 
                         : 'text-gray-800'
                   }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'SAVINGS_INTEREST' ? '+' : '-'} {tx.amount.toLocaleString()}
                   </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold text-[#0B2D6B]">Community Activities</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIVITIES.map((activity) => (
             <div key={activity.id} className="glass-card p-6 rounded-2xl border-t-4 border-[#6A0F1A] hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-red-50 text-[#6A0F1A] p-2 rounded-lg">
                      <Trophy size={24} />
                   </div>
                   <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{activity.type}</span>
                </div>
                <h3 className="font-bold text-lg text-[#0B2D6B] mb-2">{activity.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                   <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/> {activity.date}</div>
                   <div className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400"/> {activity.location}</div>
                   <div className="flex items-center"><Users size={16} className="mr-2 text-gray-400"/> {activity.organizer}</div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="text-center max-w-2xl mx-auto">
          <Heart size={48} className="text-[#6A0F1A] mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-3xl font-bold text-[#0B2D6B] mb-2">Support Bafut Development</h2>
          <p className="text-gray-500">Your contributions directly fund water projects, schools, and health centers. All donations are processed securely via Unics.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-[#6A0F1A] to-[#8B1522] text-white">
             <h3 className="text-2xl font-bold mb-4">General Development Fund</h3>
             <p className="mb-8 opacity-90">Funds are allocated by the Palace Development Council to the most urgent needs.</p>
             <div className="bg-white/10 p-4 rounded-xl mb-6 backdrop-blur-sm">
                <div className="text-sm opacity-70 mb-1">Target for 2024</div>
                <div className="text-3xl font-bold">50,000,000 XAF</div>
                <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
                   <div className="bg-white h-full w-[45%]"></div>
                </div>
                <div className="text-xs mt-2 text-right">45% Raised</div>
             </div>
             <button 
                onClick={() => setNjangiModal({ isOpen: true, type: 'DONATION', targetName: 'Bafut Dev Fund', targetAccount: 'UNI-DEV-001' })}
                className="w-full bg-white text-[#6A0F1A] py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
             >
                Donate Now
             </button>
          </div>

          <div className="glass-card p-8 rounded-3xl">
             <h3 className="text-xl font-bold text-[#0B2D6B] mb-6">Specific Causes</h3>
             <div className="space-y-4">
                {MOCK_PROJECTS.map(project => (
                   <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div>
                         <h4 className="font-bold text-gray-800">{project.name}</h4>
                         <p className="text-xs text-gray-500">{project.status}</p>
                      </div>
                      <button 
                         onClick={() => setNjangiModal({ isOpen: true, type: 'DONATION', targetName: project.name, targetAccount: project.unicsAccountNumber })}
                         className="px-4 py-2 bg-[#0B2D6B] text-white text-sm rounded-lg font-medium"
                      >
                         Give
                      </button>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderMarketplace = () => (
     <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <h2 className="text-2xl font-bold text-[#0B2D6B]">Bafut Digital Market</h2>
           <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {['All', 'Farm', 'Crafts', 'Food', 'Cultural'].map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setMarketFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${marketFilter === cat ? 'bg-[#6A0F1A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4 mb-6">
           <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Calendar size={20}/></div>
           <div className="flex-1">
              <h4 className="font-bold text-orange-800 text-sm">Next Market Days</h4>
              <div className="flex gap-4 text-xs text-orange-700 mt-1">
                 {MARKET_DAYS.slice(0, 2).map((m, i) => (
                    <span key={i}><strong>{m.name}:</strong> {m.day}</span>
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {MOCK_PRODUCTS.filter(p => marketFilter === 'All' || p.category === marketFilter).map(product => (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                 <div className="relative h-48">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    {product.trustBadge && (
                       <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${product.trustBadge === 'Verified' ? 'bg-blue-500 text-white' : product.trustBadge === 'Top Seller' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                          {product.trustBadge}
                       </span>
                    )}
                 </div>
                 <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                       <div className="flex items-center text-xs text-yellow-500 font-bold">
                          <Star size={12} className="fill-current mr-1"/> {product.rating}
                       </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 flex items-center">
                       <User size={12} className="mr-1"/> {product.seller}
                       {product.isCoop && <span className="ml-2 bg-green-100 text-green-700 px-1 rounded text-[8px] font-bold">COOP</span>}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                       <span className="text-lg font-bold text-[#6A0F1A]">{product.price.toLocaleString()} XAF</span>
                       <button 
                          onClick={() => setNjangiModal({ isOpen: true, type: 'TRANSFER', recipientInput: product.seller })}
                          className="p-2 bg-[#0B2D6B] text-white rounded-lg hover:bg-[#1a3b7d] transition-colors"
                       >
                          <ShoppingCart size={18} />
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderCropDoctor = () => (
     <div className="space-y-8 animate-fade-in">
        <div className="glass-card p-8 rounded-3xl bg-green-50 border-green-100 text-center max-w-3xl mx-auto">
           <Sprout size={48} className="text-green-600 mx-auto mb-4" />
           <h2 className="text-3xl font-bold text-[#0B2D6B] mb-4">AI Crop Doctor</h2>
           <p className="text-gray-600 mb-8">Take a photo of your crop (Cassava, Maize, Coffee, etc.). Our AI will identify pests or diseases and recommend treatments available in Bamenda.</p>
           
           <div className="flex justify-center mb-8">
              <label className="cursor-pointer bg-[#0B2D6B] hover:bg-[#1a3b7d] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-3">
                 <Upload size={24} />
                 <span>Upload Photo</span>
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
           </div>

           {cropImage && (
              <div className="bg-white p-4 rounded-xl shadow-sm inline-block max-w-full">
                 <img src={cropImage} alt="Crop Analysis" className="max-h-64 rounded-lg mx-auto" />
              </div>
           )}

           {isAnalyzing && (
              <div className="mt-8 flex flex-col items-center">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B2D6B] mb-4"></div>
                 <p className="text-gray-500 font-medium">Analyzing plant health...</p>
              </div>
           )}

           {cropAnalysis && !isAnalyzing && (
              <div className="mt-8 text-left bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500 animate-fade-in-up">
                 <h3 className="font-bold text-xl text-green-700 mb-4 flex items-center"><CheckCircle className="mr-2"/> Diagnosis Complete</h3>
                 <div className="prose text-gray-700 whitespace-pre-line">
                    {cropAnalysis}
                 </div>
              </div>
           )}
        </div>
     </div>
  );

  const renderHealth = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#0B2D6B]">Health & Medical Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {HOSPITALS.map(hospital => (
              <div key={hospital.id} className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                       <Stethoscope size={24} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${hospital.type === 'Public' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                       {hospital.type}
                    </span>
                 </div>
                 <h3 className="font-bold text-lg text-[#0B2D6B] mb-2">{hospital.name}</h3>
                 <p className="text-sm text-gray-500 mb-4 flex items-center"><MapPin size={14} className="mr-1"/> {hospital.location}</p>
                 
                 <div className="flex flex-wrap gap-2 mb-6">
                    {hospital.services.map((s, i) => (
                       <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{s}</span>
                    ))}
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-[#0B2D6B] text-[#0B2D6B] py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                       Call
                    </button>
                    {hospital.unicsAccountNumber && (
                       <button 
                          onClick={() => setNjangiModal({ isOpen: true, type: 'DONATION', targetName: hospital.name, targetAccount: hospital.unicsAccountNumber })}
                          className="flex-1 bg-[#0B2D6B] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#1a3b7d] transition-colors"
                       >
                          Donate
                       </button>
                    )}
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderProjects = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#0B2D6B]">Development Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {MOCK_PROJECTS.map(project => {
              const percentage = Math.min(100, (project.raised / project.budget) * 100);
              return (
                 <div key={project.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                    <img src={project.image} alt={project.name} className="w-full h-48 object-cover"/>
                    <div className="p-6">
                       <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {project.status}
                          </span>
                       </div>
                       <h3 className="font-bold text-xl text-[#0B2D6B] mb-2">{project.name}</h3>
                       <p className="text-sm text-gray-600 mb-6">{project.description}</p>
                       
                       <div className="mb-2 flex justify-between text-sm font-medium text-gray-700">
                          <span>Raised: {project.raised.toLocaleString()} XAF</span>
                          <span>Goal: {project.budget.toLocaleString()} XAF</span>
                       </div>
                       <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-6">
                          <div className="bg-[#6A0F1A] h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                       </div>

                       <button 
                          onClick={() => setNjangiModal({ isOpen: true, type: 'DONATION', targetName: project.name, targetAccount: project.unicsAccountNumber })}
                          className="w-full py-3 bg-[#0B2D6B] text-white rounded-xl font-bold shadow-lg hover:bg-[#1a3b7d] transition-colors flex items-center justify-center"
                       >
                          <Heart size={18} className="mr-2"/> Support this Project
                       </button>
                    </div>
                 </div>
              );
           })}
        </div>
     </div>
  );

  const renderLanguage = () => (
     <div className="space-y-8 animate-fade-in">
        <div className="bg-[#0B2D6B] rounded-3xl p-8 text-white relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10"><Languages size={200}/></div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Learn Bafut (Fut)</h2>
              <p className="text-blue-100 mb-8">Master the language of the palace. Get real-time translations and take interactive courses.</p>
              
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                 <label className="block text-sm font-bold text-blue-200 mb-2">Quick Translator (English to Bafut)</label>
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={translationInput}
                       onChange={(e) => setTranslationInput(e.target.value)}
                       placeholder="Enter text to translate..."
                       className="flex-1 bg-white/90 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button 
                       onClick={() => handleTranslate()} 
                       disabled={isTranslating}
                       className="bg-[#6A0F1A] hover:bg-[#8B1522] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                       {isTranslating ? '...' : 'Translate'}
                    </button>
                 </div>
                 {translationResult && (
                    <div className="mt-4 bg-[#0B2D6B]/50 p-4 rounded-xl border border-blue-400/30">
                       <pre className="whitespace-pre-wrap font-sans text-sm">{translationResult}</pre>
                       <button onClick={() => speakText(translationResult)} className="mt-2 text-xs flex items-center gap-1 hover:text-blue-200"><Volume2 size={12}/> Listen</button>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <h3 className="font-bold text-xl text-[#0B2D6B] mt-8">Available Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {COURSES.map(course => (
              <div key={course.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                 <img src={course.image} alt={course.title} className="w-full h-32 object-cover"/>
                 <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">{course.level}</span>
                       <span className="text-[10px] text-gray-500">{course.modules} Modules</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{course.title}</h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                       <span className="font-bold text-[#6A0F1A]">{course.price > 0 ? `${course.price} XAF` : 'Free'}</span>
                       <button 
                          onClick={() => toggleEnrollment(course.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${enrolledCourses.has(course.id) ? 'bg-green-100 text-green-700' : 'bg-[#0B2D6B] text-white hover:bg-[#1a3b7d]'}`}
                       >
                          {enrolledCourses.has(course.id) ? 'Continue' : 'Enroll'}
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderDiaspora = () => (
     <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <h2 className="text-2xl font-bold text-[#0B2D6B]">Diaspora Connect</h2>
           <div className="flex bg-white p-1 rounded-xl border border-gray-200">
              <button 
                 onClick={() => setDiasporaTab('ALL')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${diasporaTab === 'ALL' ? 'bg-[#0B2D6B] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 All Groups
              </button>
              <button 
                 onClick={() => setDiasporaTab('MY_GROUP')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${diasporaTab === 'MY_GROUP' ? 'bg-[#0B2D6B] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 My Chapter
              </button>
           </div>
        </div>

        {diasporaTab === 'ALL' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {DIASPORA_GROUPS.map(group => (
                 <div key={group.id} className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                       <Globe className="text-blue-500" size={32}/>
                       <div className="text-right">
                          <span className="block text-xs font-bold text-gray-400 uppercase">{group.country}</span>
                          <span className="font-bold text-[#0B2D6B]">{group.region}</span>
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{group.chapterName}</h3>
                    <p className="text-sm text-gray-500 mb-6">President: {group.president}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Members</span>
                          <span className="font-bold">{group.members}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Project Contrib.</span>
                          <span className="font-bold text-green-600">{group.projectContribution.toLocaleString()} XAF</span>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       <button className="flex-1 bg-white border border-[#0B2D6B] text-[#0B2D6B] py-2 rounded-lg text-sm font-bold hover:bg-blue-50">Contact</button>
                       <button 
                          onClick={() => setNjangiModal({ isOpen: true, type: 'DONATION', targetName: group.chapterName, targetAccount: group.unicsAccountNumber })}
                          className="flex-1 bg-[#0B2D6B] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#1a3b7d]"
                       >
                          Pay Dues
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {diasporaTab === 'MY_GROUP' && (
           <div className="glass-card p-8 rounded-3xl text-center">
              <h3 className="text-xl font-bold text-gray-400 mb-4">You are not a member of any Diaspora Chapter yet.</h3>
              <button onClick={() => setDiasporaTab('ALL')} className="bg-[#0B2D6B] text-white px-6 py-3 rounded-xl font-bold">Find a Chapter</button>
           </div>
        )}
     </div>
  );

  const renderEmergency = () => (
     <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center px-4">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 ${sosActive ? 'bg-red-600 animate-ping' : 'bg-[#6A0F1A] hover:scale-105 cursor-pointer'}`} onClick={activateSOS}>
           <Siren size={64} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#6A0F1A] mb-2">EMERGENCY SOS</h2>
        <p className="text-gray-600 max-w-md mb-8">Pressing this button will alert the Bafut Palace Vigilante Group and the nearest medical center of your location.</p>
        
        {sosActive && (
           <div className="bg-red-100 text-red-700 px-6 py-4 rounded-xl font-bold flex items-center animate-bounce">
              <AlertCircle size={24} className="mr-2"/> Help is on the way! Location Shared.
           </div>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
           <a href="tel:119" className="bg-white border border-gray-200 p-4 rounded-xl flex items-center hover:bg-gray-50">
              <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600"><Phone size={24}/></div>
              <div className="text-left">
                 <h4 className="font-bold text-gray-800">Medical Emergency</h4>
                 <p className="text-sm text-gray-500">Call District Hospital</p>
              </div>
           </a>
           <a href="tel:117" className="bg-white border border-gray-200 p-4 rounded-xl flex items-center hover:bg-gray-50">
              <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600"><ShieldAlert size={24}/></div>
              <div className="text-left">
                 <h4 className="font-bold text-gray-800">Vigilante / Police</h4>
                 <p className="text-sm text-gray-500">Report Security Threat</p>
              </div>
           </a>
        </div>
     </div>
  );

  const renderContact = () => (
     <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0B2D6B] text-center mb-8">Contact the Palace Council</h2>
        <div className="glass-card p-8 rounded-3xl">
           <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#0B2D6B] outline-none"/>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / Phone</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#0B2D6B] outline-none"/>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                 <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#0B2D6B] outline-none">
                    <option>General Inquiry</option>
                    <option>Development Project Proposal</option>
                    <option>Report an Issue</option>
                    <option>Diaspora Matters</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                 <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#0B2D6B] outline-none"></textarea>
              </div>
              <button type="button" className="w-full bg-[#0B2D6B] text-white py-3 rounded-xl font-bold hover:bg-[#1a3b7d] transition-colors">Send Message</button>
           </form>
           <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <p className="flex items-center gap-2"><MapPin size={16}/> Bafut Palace, North West Region, Cameroon</p>
              <p className="flex items-center gap-2 mt-2 md:mt-0"><Mail size={16}/> council@bafutpalace.org</p>
           </div>
        </div>
     </div>
  );

  const renderYouth = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#0B2D6B]">Youth & Technology Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <h3 className="text-xl font-bold mb-2 flex items-center"><Laptop className="mr-2"/> Tech Bootcamps</h3>
              <p className="opacity-90 mb-6">Learn Coding, Digital Marketing, and AI skills. Funded by the Diaspora.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm">View Schedule</button>
           </div>
           <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[#0B2D6B] mb-4">Mentorship Program</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with successful Bafut professionals worldwide for career guidance.</p>
              <div className="flex -space-x-2 mb-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>)}
                 <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+40</div>
              </div>
              <button className="text-[#0B2D6B] font-bold text-sm hover:underline">Find a Mentor</button>
           </div>
        </div>
     </div>
  );

  const renderWomen = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#0B2D6B]">Women Empowerment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="glass-card p-6 rounded-2xl col-span-1 lg:col-span-2">
              <h3 className="text-xl font-bold text-[#0B2D6B] mb-4">Micro-Finance for Women</h3>
              <p className="text-gray-600 mb-6">Low-interest loans for women-led agricultural and craft businesses. Supported by Unics.</p>
              <div className="flex gap-4">
                 <div className="bg-pink-50 p-4 rounded-xl flex-1">
                    <div className="text-2xl font-bold text-pink-600">2.5%</div>
                    <div className="text-xs text-pink-400">Interest Rate</div>
                 </div>
                 <div className="bg-pink-50 p-4 rounded-xl flex-1">
                    <div className="text-2xl font-bold text-pink-600">50k - 500k</div>
                    <div className="text-xs text-pink-400">Loan Range (XAF)</div>
                 </div>
              </div>
              <button onClick={() => setNjangiModal({ isOpen: true, type: 'LOAN', group: { name: 'Women Fund', id: 'WF1', contributionAmount: 0, frequency: '', memberCount: 0, nextMeeting: '', totalPool: 0, unicsAccountNumber: '' } })} className="mt-6 w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700">Apply for Loan</button>
           </div>
           <div className="glass-card p-6 rounded-2xl bg-pink-50 border-pink-100">
              <h3 className="text-lg font-bold text-pink-800 mb-4">Family Health</h3>
              <ul className="space-y-3 text-sm text-pink-700">
                 <li className="flex items-center"><CheckCircle size={16} className="mr-2"/> Free Pre-natal Checks</li>
                 <li className="flex items-center"><CheckCircle size={16} className="mr-2"/> Nutrition Workshops</li>
                 <li className="flex items-center"><CheckCircle size={16} className="mr-2"/> Child Vaccination Alerts</li>
              </ul>
           </div>
        </div>
     </div>
  );

  // Njangi/Donation Modal
  const renderNjangiModal = () => (
     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNjangiModal({ ...njangiModal, isOpen: false })}></div>
        <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-fade-in-up">
           <div className="bg-[#0B2D6B] p-6 text-white text-center relative">
              <h3 className="text-xl font-bold">
                 {njangiModal.type === 'DEPOSIT' && 'Deposit to Wallet'}
                 {njangiModal.type === 'WITHDRAW' && 'Withdraw Funds'}
                 {njangiModal.type === 'TRANSFER' && 'Send Money (P2P)'}
                 {njangiModal.type === 'CONTRIBUTE' && 'Pay Njangi Dues'}
                 {njangiModal.type === 'SAVINGS' && 'Transfer to Savings'}
                 {njangiModal.type === 'DONATION' && 'Donate to Cause'}
                 {njangiModal.type === 'LOAN' && 'Apply for Micro-Loan'}
              </h3>
              <button 
                 onClick={() => setNjangiModal({ ...njangiModal, isOpen: false })}
                 className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                 <X size={24} />
              </button>
           </div>
           <div className="p-6">
              {njangiModal.group && njangiModal.type !== 'LOAN' && (
                 <div className="mb-4 bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Group Account</p>
                    <p className="font-bold text-[#0B2D6B]">{njangiModal.group.name}</p>
                    <p className="text-xs font-mono text-gray-400 mt-1">{njangiModal.group.unicsAccountNumber}</p>
                 </div>
              )}

              {njangiModal.type === 'DONATION' && (
                 <div className="mb-4 bg-red-50 p-3 rounded-lg text-center border border-red-100">
                    <p className="text-xs text-red-500 uppercase tracking-wide">Beneficiary</p>
                    <p className="font-bold text-[#6A0F1A]">{njangiModal.targetName}</p>
                    <p className="text-xs font-mono text-gray-400 mt-1">{njangiModal.targetAccount}</p>
                 </div>
              )}

              {njangiModal.type === 'LOAN' && (
                 <div className="mb-4 bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase tracking-wide">Loan Provider</p>
                    <p className="font-bold text-[#0B2D6B]">Unics Micro-Finance</p>
                 </div>
              )}

              {njangiModal.type === 'WITHDRAW' && (
                 <div className="mb-4 bg-orange-50 p-3 rounded-lg text-center border border-orange-100">
                    <p className="text-xs text-orange-600 uppercase tracking-wide">Withdrawal Channel</p>
                    <p className="font-bold text-[#0B2D6B]">Unics Mobile Money Gateway</p>
                    <p className="text-[10px] text-gray-500 mt-1">Fee: 2% (Auto-deducted)</p>
                 </div>
              )}

              {njangiModal.type === 'TRANSFER' && (
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Phone / ID</label>
                    <input 
                       type="text" 
                       value={recipientInput}
                       onChange={(e) => setRecipientInput(e.target.value)}
                       className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B2D6B] focus:border-transparent outline-none"
                       placeholder="e.g. 677000000 or BFT-01"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">Fee: 100 XAF Fixed</p>
                 </div>
              )}

              {njangiModal.type === 'DEPOSIT' && (
                 <div className="mb-6 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                          onClick={() => setPaymentProvider('MOMO')}
                          className={`p-3 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${paymentProvider === 'MOMO' ? 'border-[#0B2D6B] bg-blue-50 text-[#0B2D6B]' : 'border-gray-200 text-gray-500'}`}
                       >
                          <Smartphone size={24} className="mb-1"/>
                          <span className="font-bold text-xs">Mobile Money</span>
                          <span className="text-[10px] opacity-70">MTN/Orange</span>
                       </button>
                       <button 
                          onClick={() => setPaymentProvider('CARD')}
                          className={`p-3 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${paymentProvider === 'CARD' ? 'border-[#0B2D6B] bg-blue-50 text-[#0B2D6B]' : 'border-gray-200 text-gray-500'}`}
                       >
                          <CreditCardIcon size={24} className="mb-1"/>
                          <span className="font-bold text-xs">Bank Card</span>
                          <span className="text-[10px] opacity-70">Visa/MC</span>
                       </button>
                    </div>

                    <div className="mt-4">
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                          {paymentProvider === 'MOMO' ? 'Phone Number' : 'Card Number'}
                       </label>
                       <input 
                           type="text" 
                           value={recipientInput}
                           onChange={(e) => setRecipientInput(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B2D6B] focus:border-transparent outline-none"
                           placeholder={paymentProvider === 'MOMO' ? "e.g., 677 123 456" : "**** **** **** 1234"}
                        />
                    </div>
                 </div>
              )}
              
              <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Amount (XAF)</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">XAF</span>
                    <input 
                       type="number" 
                       value={amountInput}
                       onChange={(e) => setAmountInput(e.target.value)}
                       className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B2D6B] focus:border-transparent outline-none text-lg font-bold text-[#0B2D6B]"
                       placeholder="0.00"
                    />
                 </div>
              </div>

              <button 
                 onClick={handleNjangiTransaction}
                 className="w-full bg-[#0B2D6B] hover:bg-[#1a3b7d] text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center"
              >
                 <ShieldCheck className="mr-2" size={20}/> 
                 {njangiModal.type === 'LOAN' ? 'Submit Application' : 
                  njangiModal.type === 'TRANSFER' ? 'Send Money' : 
                  njangiModal.type === 'WITHDRAW' ? 'Confirm Withdrawal' : 
                  njangiModal.type === 'CONTRIBUTE' ? 'Pay Dues' : 'Secure Transaction'}
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center">
                 <Landmark size={10} className="mr-1"/> Processed by Unics Credit Union
              </p>
           </div>
        </div>
     </div>
  );

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {currentView === 'HOME' && renderHome()}
      {currentView === 'ABOUT' && renderAbout()}
      {currentView === 'NEWS' && renderNews()}
      {currentView === 'CULTURE' && renderCulture()}
      {currentView === 'MEDIA' && renderMedia()}
      {currentView === 'ACTIVITIES' && renderActivities()}
      {currentView === 'NJANGI' && renderNjangi()}
      {currentView === 'DONATIONS' && renderDonations()}
      {currentView === 'MARKETPLACE' && renderMarketplace()}
      {currentView === 'CROP_DOCTOR' && renderCropDoctor()}
      {currentView === 'HEALTH' && renderHealth()} 
      {currentView === 'PROJECTS' && renderProjects()} 
      {currentView === 'LANGUAGE' && renderLanguage()}
      {currentView === 'DIASPORA' && renderDiaspora()}
      {currentView === 'EMERGENCY' && renderEmergency()}
      {currentView === 'CONTACT' && renderContact()}
      {currentView === 'YOUTH' && renderYouth()}
      {currentView === 'WOMEN' && renderWomen()}
      {currentView === 'SERVICES' && renderServices()}
      
      {/* Floating Village AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#0B2D6B] hover:bg-[#1a3b7d] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center border-2 border-white/20"
        >
          {isChatOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>

      {/* Village AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-96 max-w-[90vw] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-200">
          <div className="bg-[#0B2D6B] p-4 text-white flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-full"><Bot size={20}/></div>
             <div>
                <h3 className="font-bold">Village Intelligence</h3>
                <p className="text-[10px] text-blue-200">Powered by Gemini AI</p>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[#0B2D6B] text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm rounded-tl-none border border-gray-100'}`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             {isChatting && (
                <div className="flex justify-start">
                   <div className="bg-white text-gray-500 p-3 rounded-2xl text-sm shadow-sm rounded-tl-none border border-gray-100 italic">
                      Consulting the spirits...
                   </div>
                </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about culture, farming, history..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2D6B]"
                />
                <button 
                  onClick={handleChat}
                  disabled={isChatting || !chatMessage.trim()}
                  className="bg-[#0B2D6B] text-white p-3 rounded-xl disabled:opacity-50 hover:bg-[#1a3b7d]"
                >
                   <Send size={18} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Digital ID Modal (Super Powerful Feature) */}
      {isIdModalOpen && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsIdModalOpen(false)}></div>
             <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="bg-gradient-to-br from-[#0B2D6B] to-black p-6 text-white text-center relative h-full">
                   <div className="flex justify-between items-start mb-6">
                      <Globe size={24} className="opacity-50"/>
                      <div className="flex flex-col items-end">
                         <h2 className="font-bold text-lg tracking-widest">BAFUT PASS</h2>
                         <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">CITIZEN</span>
                      </div>
                   </div>
                   
                   <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl mb-4 shadow-lg">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAFUT-ID-883920-VERIFIED" alt="Digital ID QR" className="w-full h-full"/>
                   </div>

                   <h3 className="text-xl font-bold">Ntumfor Paul</h3>
                   <p className="text-sm opacity-70 mb-6">ID: BFT-CIT-00293</p>

                   <div className="bg-white/10 rounded-xl p-4 text-left space-y-2 backdrop-blur-md border border-white/10">
                      <div className="flex justify-between text-xs">
                         <span className="opacity-60">Quarter</span>
                         <span className="font-bold">Mambu</span>
                      </div>
                      <div className="flex justify-between text-xs">
                         <span className="opacity-60">Status</span>
                         <span className="font-bold text-green-400">Verified & Active</span>
                      </div>
                      <div className="flex justify-between text-xs">
                         <span className="opacity-60">Balance</span>
                         <span className="font-bold">{walletBalance.toLocaleString()} XAF</span>
                      </div>
                      <div className="flex justify-between text-xs">
                         <span className="opacity-60">Trust Score</span>
                         <span className="font-bold text-yellow-400">{trustScore} / 850</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setIsIdModalOpen(false)}
                  className="absolute top-4 left-4 text-white/50 hover:text-white"
                >
                   <X size={20} />
                </button>
             </div>
         </div>
      )}
      
      {/* Njangi/Donation Modal */}
      {njangiModal.isOpen && renderNjangiModal()}

      {/* Placeholder for other views */}
      {!['HOME', 'NJANGI', 'MARKETPLACE', 'CROP_DOCTOR', 'PROJECTS', 'LANGUAGE', 'DIASPORA', 'MEDIA', 'DONATIONS', 'ABOUT', 'NEWS', 'CULTURE', 'ACTIVITIES', 'HEALTH', 'EMERGENCY', 'CONTACT', 'YOUTH', 'WOMEN', 'SERVICES'].includes(currentView) && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
             <Hammer size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-400">Under Construction</h2>
          <p className="text-gray-500 mt-2">The {currentView.toLowerCase().replace('_', ' ')} module is currently being built by the tech team.</p>
          <button onClick={() => setCurrentView('HOME')} className="mt-8 px-8 py-3 bg-[#0B2D6B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
             Back to Home
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;