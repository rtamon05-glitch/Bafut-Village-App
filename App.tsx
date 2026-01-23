
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Professional, ChatMessage, MessageSender, User } from './types';
import { MOCK_PROFESSIONALS, APP_NAME, TAGLINE, HERO_SLIDES, MOCK_TRANSACTIONS, MOCK_REPORTS } from './constants';
import { ChatService } from './services/geminiService';

type ViewState = 'landing' | 'login' | 'signup_selection' | 'signup_patient' | 'signup_pro' | 'email_verification' | 'dashboard' | 'topup' | 'withdraw' | 'methods';

const Icons = {
  Mic: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Send: ({ className = "w-4 h-4" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  VideoOn: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  EndCall: ({ className = "w-5 h-5 rotate-[135deg]" }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>,
  Close: ({ className = "w-4 h-4" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Home: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Search: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Back: ({ className = "w-4 h-4" }: { className?: string }) => <svg className={className} fill="none" stroke="#86EFAC" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  File: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  CreditCard: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Shield: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Star: ({ className = "w-3 h-3 text-yellow-500" }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Heart: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Mail: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Trending: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Users: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Withdraw: ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

const TelehealthVideoCall = ({ participantName, onClose }: { participantName: string; onClose: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  
  return (
    <div className="fixed inset-0 z-[700] bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-[450px] h-full bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-80" alt="Consultant" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>
        <div className="absolute top-6 right-6 w-28 aspect-[3/4] bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl z-20">
          {!isCameraOff ? (
            <img src="https://i.pravatar.cc/300?u=me" className="w-full h-full object-cover scale-x-[-1]" alt="Me" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white/20"><Icons.VideoOn className="w-8 h-8 opacity-20" /></div>
          )}
        </div>
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-white font-black uppercase tracking-widest">{participantName}</p>
          </div>
          <p className="text-[8px] text-brand-green font-bold uppercase mt-1 tracking-tighter">Encrypted Care Terminal</p>
        </div>
        <div className="absolute bottom-32 left-8 right-8 z-10">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
             <p className="text-[9px] text-white/60 font-bold uppercase mb-1">Live AI Notes</p>
             <p className="text-[10px] text-white font-medium leading-relaxed italic animate-pulse">"I understand the anxiety you've been feeling lately. Let's explore the root cause together..."</p>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6 z-20">
          <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-xl text-white'}`}><Icons.Mic /></button>
          <button onClick={onClose} className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-500/40 active:scale-90 transition-transform rotate-[135deg]"><Icons.EndCall className="w-8 h-8" /></button>
          <button onClick={() => setIsCameraOff(!isCameraOff)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-xl text-white'}`}><Icons.VideoOn /></button>
        </div>
      </div>
    </div>
  );
};

const MobileContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
    <div className="w-full max-w-[450px] min-h-screen bg-white dark:bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
      {children}
    </div>
  </div>
);

const ChatInterface = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
    return history.length > 0 ? history : [{ id: '1', text: "Hello, I'm Dr. Leslie. How can I assist you today?", sender: MessageSender.MODEL, timestamp: new Date() }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatService = useRef(new ChatService());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const msg: ChatMessage = { id: Date.now().toString(), text: input, sender: MessageSender.USER, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setIsTyping(true);
    const replyText = await chatService.current.sendMessage(input);
    const reply: ChatMessage = { id: (Date.now()+1).toString(), text: replyText, sender: MessageSender.MODEL, timestamp: new Date() };
    setMessages(prev => {
      const final = [...prev, reply];
      localStorage.setItem('chat_history', JSON.stringify(final));
      return final;
    });
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-white dark:bg-slate-900 flex flex-col max-w-[450px] mx-auto animate-slide-up shadow-2xl">
      <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
        <button onClick={onClose} className="p-1"><Icons.Back /></button>
        <span className="text-[10px] font-black uppercase tracking-widest">DR. LESLIE AI</span>
        <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-slate-950 scrollbar-hide">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-[11px] shadow-sm font-medium ${m.sender === MessageSender.USER ? 'bg-brand-blue text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border dark:border-slate-700 rounded-bl-none'}`}>
              {m.text}
              <div className="text-[7px] mt-2 opacity-40 font-black uppercase">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1 items-center p-2 opacity-30">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      <div className="p-5 border-t dark:border-slate-800 flex gap-3 items-center">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Speak to clinical AI..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
        />
        <button onClick={handleSend} className="p-4 bg-brand-blue text-white rounded-xl active:scale-95 transition-transform"><Icons.Send /></button>
      </div>
    </div>
  );
};

const Branding = () => (
  <h1 className="text-4xl font-black text-white mb-2 leading-none tracking-tight">
    LESLEY<span className="text-brand-green">CARE</span>
  </h1>
);

const FooterCredits = ({ dark = false }: { dark?: boolean }) => (
  <div className={`mt-8 text-[8px] uppercase font-black tracking-widest ${dark ? 'text-slate-500' : 'text-white/40'}`}>
    <p className="mb-1">Designed by EGS</p>
    <p>Copyright @ Lesleycare</p>
  </div>
);

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lesleycare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState<'home' | 'directory' | 'wallet' | 'reports'>('home');
  const [filter, setFilter] = useState('All');
  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pendingUser, setPendingUser] = useState<Partial<User>>({});
  const [proBalance, setProBalance] = useState(1240.50);
  const [dialogueLedger, setDialogueLedger] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
    setDialogueLedger(history.slice(-10).reverse());
  }, [showChat, activeTab]);

  const handleLogin = (role: UserRole) => {
    const newUser = { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role };
    setUser(newUser);
    localStorage.setItem('lesleycare_user', JSON.stringify(newUser));
    setView('dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lesleycare_user');
    setView('landing');
  };

  const filteredProfessionals = MOCK_PROFESSIONALS.filter(p => {
    if (filter === 'All') return true;
    return p.title.toLowerCase().includes(filter.toLowerCase());
  });

  if (view === 'landing') return (
    <MobileContainer>
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={HERO_SLIDES[currentSlide]} className="w-full h-full object-cover opacity-60 animate-ken-burns-in scale-110" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-16 text-center">
          <Branding />
          <p className="text-[10px] text-slate-200 font-bold mb-10 tracking-[0.2em] uppercase">{TAGLINE}</p>
          <div className="space-y-4">
            <button onClick={() => setView('signup_selection')} className="w-full bg-brand-blue text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Get Started</button>
            <button onClick={() => setView('login')} className="w-full bg-white/10 text-white border border-white/20 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all">Member Sign In</button>
          </div>
          <FooterCredits />
        </div>
      </div>
    </MobileContainer>
  );

  if (view === 'signup_selection') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col">
        <button onClick={() => setView('landing')} className="mb-10 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit transition-colors"><Icons.Back /></button>
        <h2 className="text-2xl font-black mb-1 uppercase tracking-tight text-slate-900 dark:text-white">Join the Circle</h2>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] mb-12">Select your gateway to <span className="text-slate-900 dark:text-white">LESLEY</span><span className="text-brand-green">CARE</span></p>
        <div className="space-y-6 flex-1">
          <button onClick={() => setView('signup_patient')} className="w-full p-8 bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 hover:border-brand-blue transition-all text-left shadow-sm group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Icons.Heart /></div>
            <h3 className="text-sm font-black uppercase mb-2 text-slate-900 dark:text-white">I am a Patient</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Seek healing. Access private therapy and GP consultations.</p>
          </button>
          <button onClick={() => setView('signup_pro')} className="w-full p-8 bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 hover:border-brand-green transition-all text-left shadow-sm group">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-brand-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Icons.Shield /></div>
            <h3 className="text-sm font-black uppercase mb-2 text-slate-900 dark:text-white">I am a Professional</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Provide care. Join our world-class specialist network.</p>
          </button>
        </div>
        <FooterCredits dark />
      </div>
    </MobileContainer>
  );

  if (view === 'signup_pro') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <button onClick={() => setView('signup_selection')} className="mb-10 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit"><Icons.Back /></button>
        <h2 className="text-2xl font-black mb-1 uppercase text-slate-900 dark:text-white">Clinical Portal</h2>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-10">Register as a Specialist</p>
        <form onSubmit={(e) => {e.preventDefault(); setView('email_verification');}} className="space-y-4 flex-1">
          <input required type="text" placeholder="Full Professional Name" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-green" />
          <input required type="text" placeholder="Clinical License ID" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-green" />
          <select required className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 appearance-none font-bold uppercase tracking-widest">
            <option>Clinical Psychologist</option>
            <option>General Practitioner</option>
            <option>Mental Health Coach</option>
            <option>Phytotherapy Specialist</option>
          </select>
          <input required type="email" placeholder="Professional Email Gateway" onChange={e => setPendingUser({email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-green" />
          <input required type="password" placeholder="Passkey" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-green" />
          <div className="flex items-center gap-2 p-2">
            <input type="checkbox" required className="w-4 h-4 accent-brand-green" />
            <span className="text-[8px] font-black uppercase text-slate-400">I agree to the 20% platform commission policy.</span>
          </div>
          <button type="submit" className="w-full bg-brand-green text-slate-900 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl mt-4">Apply for Credentials</button>
        </form>
        <FooterCredits dark />
      </div>
    </MobileContainer>
  );

  if (view === 'signup_patient') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col overflow-y-auto">
        <button onClick={() => setView('signup_selection')} className="mb-10 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit"><Icons.Back /></button>
        <h2 className="text-2xl font-black mb-1 uppercase text-slate-900 dark:text-white">Patient Identity</h2>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-10">Confidential Health Onboarding</p>
        <form onSubmit={(e) => {e.preventDefault(); setView('email_verification');}} className="space-y-4 flex-1">
          <input required type="text" placeholder="Legal Full Name" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-blue" />
          <input required type="email" placeholder="Secure Email Gateway" onChange={e => setPendingUser({email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-blue" />
          <input required type="password" placeholder="Vault Passkey" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-blue" />
          <button type="submit" className="w-full bg-brand-blue text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl mt-8">Request Health Access</button>
        </form>
        <FooterCredits dark />
      </div>
    </MobileContainer>
  );

  if (view === 'login') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col">
        <button onClick={() => setView('landing')} className="mb-10 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit transition-colors"><Icons.Back /></button>
        <h2 className="text-2xl font-black mb-1 uppercase tracking-tight text-slate-900 dark:text-white">Member Sign In</h2>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] mb-12">Portal for Patients & Professionals</p>
        <form onSubmit={(e) => {e.preventDefault(); handleLogin(UserRole.CLIENT);}} className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Identity Gateway</label>
            <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-blue" />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Secure Passkey</label>
            <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-blue" />
          </div>
          <button type="submit" className="w-full bg-brand-blue text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl mt-8">Authenticate</button>
          <div className="mt-6 flex justify-between items-center px-1">
            <button type="button" className="text-[9px] font-black text-slate-400 uppercase">Forgot Passkey?</button>
            <button type="button" onClick={() => setView('signup_selection')} className="text-[9px] font-black text-brand-blue uppercase underline">Create Account</button>
          </div>
        </form>
        <FooterCredits dark />
      </div>
    </MobileContainer>
  );

  if (view === 'email_verification') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mb-8 animate-pulse"><Icons.Mail className="w-10 h-10" /></div>
        <h2 className="text-2xl font-black mb-4 uppercase text-slate-900 dark:text-white">Verify Identity</h2>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-10 px-6">We've sent a link to <span className="text-brand-blue font-black">{pendingUser.email}</span>. Confirm to activate your Care Terminal.</p>
        <button onClick={() => handleLogin(UserRole.CLIENT)} className="w-full bg-brand-blue text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">I Have Confirmed</button>
      </div>
    </MobileContainer>
  );

  if (view === 'withdraw') return (
    <MobileContainer>
      <div className="p-8 flex-1 flex flex-col">
        <button onClick={() => setView('dashboard')} className="mb-10 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit"><Icons.Back /></button>
        <h2 className="text-2xl font-black mb-1 uppercase text-slate-900 dark:text-white">Withdraw Funds</h2>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-10">Pro Wallet: ${proBalance.toFixed(2)}</p>
        <div className="space-y-6 flex-1">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-4">Payout Amount</label>
            <input type="number" defaultValue="500" className="w-full bg-transparent text-4xl font-black outline-none text-slate-900 dark:text-white" />
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-500">20% Platform Support</span>
              <span className="text-[9px] font-black text-red-500">-$100.00</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-900 dark:text-white">Direct Deposit Value</span>
              <span className="text-[12px] font-black text-brand-green">$400.00</span>
            </div>
          </div>
          <button onClick={() => {setProBalance(prev => prev - 500); setView('dashboard');}} className="w-full bg-brand-green text-slate-900 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Confirm Payout</button>
        </div>
      </div>
    </MobileContainer>
  );

  // Default dashboard view
  return (
    <MobileContainer>
      <div className="px-6 py-5 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-brand-green shadow-xl">
            <img src={`https://i.pravatar.cc/150?u=${user?.id}`} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Hi, {user?.name.split(' ')[0]}</h1>
            <p className="text-[8px] font-bold text-brand-green uppercase tracking-widest">Integrity Active</p>
          </div>
        </div>
        <button onClick={logout} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Icons.Close className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-slate-900 text-white p-7 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-all duration-700"></div>
               <Icons.Trending className="w-10 h-10 text-brand-green mb-6" />
               <h3 className="text-xl font-black uppercase leading-tight mb-3">Integrity Sync<br/>In Progress</h3>
               <p className="text-[10px] text-slate-400 font-medium mb-8 leading-relaxed">Your resilience score increased by 4% this week. Dr. Leslie has some new reflections to share.</p>
               <button onClick={() => setShowChat(true)} className="bg-brand-green text-slate-950 px-8 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-green-400/20 active:scale-95 transition-all">Daily Sync</button>
            </div>

            {user?.role === UserRole.CLIENT ? (
              <>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex justify-between">Dialogue Ledger <span className="text-brand-blue uppercase">All Records</span></h4>
                  <div className="space-y-3">
                    {dialogueLedger.length > 0 ? dialogueLedger.map((chat, idx) => (
                      <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${chat.sender === MessageSender.USER ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {chat.sender === MessageSender.USER ? 'U' : 'L'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{chat.sender === MessageSender.USER ? 'Identity Input' : 'Clinical Output'}</span>
                            <span className="text-[7px] font-bold text-slate-300">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 line-clamp-2 font-medium italic">"{chat.text}"</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/30 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                         <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">No dialogue recorded.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Active Programs</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:border-brand-blue transition-colors">
                       <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icons.Heart className="w-6 h-6" /></div>
                       <p className="text-[9px] font-black uppercase text-slate-900 dark:text-white">Mood Sync</p>
                       <p className="text-[7px] text-slate-400 font-bold mt-1">PENDING</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:border-brand-green transition-colors">
                       <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-brand-green rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icons.Trending className="w-6 h-6" /></div>
                       <p className="text-[9px] font-black uppercase text-slate-900 dark:text-white">Sleep Log</p>
                       <p className="text-[7px] text-slate-400 font-bold mt-1">8.2 HRS</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Practice Overview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
                       <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Wallet Value</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white">${proBalance.toFixed(2)}</p>
                       <button onClick={() => setView('withdraw')} className="mt-4 text-[7px] font-black uppercase text-brand-green border border-brand-green/20 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-brand-green hover:text-slate-950 transition-colors"><Icons.Withdraw className="w-3 h-3" /> Payout</button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
                       <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Patient Reach</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white">42 Active</p>
                       <div className="flex -space-x-2 mt-4">
                         {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/50?u=${i}`} alt="P" /></div>)}
                       </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Upcoming Consultations</h4>
                  {MOCK_TRANSACTIONS.slice(0, 2).map(tx => (
                    <div key={tx.id} className="bg-white dark:bg-slate-800 p-5 rounded-[32px] border border-slate-100 dark:border-slate-700 flex justify-between items-center group shadow-sm hover:shadow-xl transition-all">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black text-xs">AJ</div>
                         <div>
                           <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Alex Johnson</p>
                           <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">Video • 14:00 Today</p>
                         </div>
                       </div>
                       <button onClick={() => setShowVideoCall(true)} className="p-3 bg-brand-blue text-white rounded-2xl shadow-lg shadow-blue-500/30 active:scale-90 transition-transform"><Icons.VideoOn className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="bg-brand-blue/5 dark:bg-brand-blue/10 p-8 rounded-[40px] border-2 border-dashed border-brand-blue/20 text-center">
               <Icons.Users className="w-10 h-10 text-brand-blue mx-auto mb-6" />
               <h4 className="text-[12px] font-black uppercase mb-2 tracking-widest text-slate-900 dark:text-white">Community Circles</h4>
               <p className="text-[9px] text-slate-500 font-medium mb-8 px-8 leading-relaxed">Join peer-led support groups focused on global wellbeing and collective healing.</p>
               <button className="text-[8px] font-black bg-white dark:bg-slate-800 text-brand-blue px-8 py-3.5 rounded-2xl uppercase tracking-widest shadow-xl active:scale-95 transition-all">Explore Circles</button>
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                {['All', 'Psychologist', 'General Practitioner', 'Coach', 'Phytotherapy'].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${filter === cat ? 'bg-brand-blue text-white border-brand-blue shadow-xl scale-105' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}>{cat}</button>
                ))}
             </div>
             <div className="space-y-5">
               {filteredProfessionals.map(pro => (
                 <div key={pro.id} className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-slate-100 dark:border-slate-700 flex flex-col shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform"></div>
                    <div className="flex gap-6 mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-[30px] overflow-hidden border-2 border-slate-50 dark:border-slate-700 shadow-md"><img src={pro.avatarUrl} className="w-full h-full object-cover" alt={pro.name} /></div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${pro.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 dark:text-white">{pro.name}</h4>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-xl flex items-center gap-1"><Icons.Star className="w-3 h-3 text-yellow-500" /><span className="text-[9px] font-black text-yellow-700 dark:text-yellow-400">{pro.rating}</span></div>
                        </div>
                        <p className="text-[9px] text-brand-blue font-black uppercase tracking-widest mt-1">{pro.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium line-clamp-2">{pro.bio}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px]">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-tighter">${pro.hourlyRate}<span className="text-[7px] font-bold opacity-40 ml-1">USD/HR</span></span>
                      <button onClick={() => setShowVideoCall(true)} className="bg-brand-blue text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Encrypted Video</button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-150 transition-transform duration-1000"><Icons.Shield className="w-32 h-32" /></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Available Credits</p>
              <h2 className="text-5xl font-black mb-12 tracking-tight">$1,240<span className="text-2xl opacity-40">.50</span></h2>
              <div className="flex gap-4">
                <button onClick={() => setView('topup')} className="flex-1 bg-white text-brand-blue py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Deposit</button>
                {user?.role === UserRole.PROFESSIONAL && <button onClick={() => setView('withdraw')} className="flex-1 bg-white/20 backdrop-blur-xl py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Withdraw</button>}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ledger History</h3>
              {MOCK_TRANSACTIONS.map(tx => (
                <div key={tx.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm">
                  <div className="flex gap-5 items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-black ${tx.type === 'Credit' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-700 dark:bg-red-900/20'}`}>{tx.type === 'Credit' ? 'IN' : 'OUT'}</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-tight">{tx.description}</p>
                      <p className="text-[8px] text-slate-400 font-bold mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black ${tx.type === 'Credit' ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>{tx.type === 'Credit' ? '+' : '-'}${tx.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-center px-1">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Archive</h2>
                <button className="bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-xl text-[9px] font-black text-brand-blue uppercase active:scale-95">Upload Asset</button>
             </div>
             <div className="space-y-5">
               {MOCK_REPORTS.map(rpt => (
                 <div key={rpt.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 flex gap-5 items-center shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                   <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500"><Icons.File className="w-6 h-6" /></div>
                   <div className="flex-1 min-w-0">
                     <p className="text-[11px] font-black uppercase truncate text-slate-900 dark:text-white">{rpt.name}</p>
                     <p className="text-[8px] text-slate-400 font-bold mt-1">{rpt.date.toLocaleDateString()} • {rpt.size}</p>
                   </div>
                   <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase ${rpt.status === 'Reviewed' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20'}`}>{rpt.status}</div>
                 </div>
               ))}
             </div>
             <div className="bg-slate-950 text-white p-10 rounded-[48px] text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 to-transparent"></div>
                <Icons.Shield className="w-14 h-14 text-brand-green mx-auto mb-8 relative z-10 group-hover:scale-110 transition-transform" />
                <h4 className="text-[13px] font-black uppercase mb-4 tracking-widest relative z-10">Decentralized Records</h4>
                <p className="text-[10px] text-slate-400 font-medium mb-10 px-6 leading-relaxed relative z-10">Your health identity is sharded across our private CareChain. Total privacy assured.</p>
                <button className="text-[9px] font-black bg-brand-green text-slate-950 px-10 py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-green-400/20 relative z-10">Manage Access Keys</button>
             </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 px-10 py-6 flex justify-between items-center z-[100] rounded-t-[48px] shadow-[0_-15px_50px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('home')} className={`p-2 transition-all ${activeTab === 'home' ? 'text-brand-blue scale-125' : 'text-slate-400'}`} aria-label="Home"><Icons.Home /></button>
        <button onClick={() => setActiveTab('directory')} className={`p-2 transition-all ${activeTab === 'directory' ? 'text-brand-blue scale-125' : 'text-slate-400'}`} aria-label="Directory"><Icons.Search /></button>
        <div className="relative -top-14">
          <button onClick={() => setShowChat(true)} className="w-20 h-20 bg-brand-green text-slate-950 rounded-[30px] shadow-[0_25px_60px_rgba(134,239,172,0.6)] flex items-center justify-center border-8 border-white dark:border-slate-900 active:scale-90 transition-all hover:rotate-6 scale-110" aria-label="Consult Dr. Leslie"><Icons.Mic className="w-8 h-8" /></button>
        </div>
        <button onClick={() => setActiveTab('wallet')} className={`p-2 transition-all ${activeTab === 'wallet' ? 'text-brand-blue scale-125' : 'text-slate-400'}`} aria-label="Wallet"><Icons.CreditCard /></button>
        <button onClick={() => setActiveTab('reports')} className={`p-2 transition-all ${activeTab === 'reports' ? 'text-brand-blue scale-125' : 'text-slate-400'}`} aria-label="Reports"><Icons.File /></button>
      </div>

      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
      {showVideoCall && <TelehealthVideoCall participantName="Dr. Sarah Mbeki" onClose={() => setShowVideoCall(false)} />}
    </MobileContainer>
  );
}
