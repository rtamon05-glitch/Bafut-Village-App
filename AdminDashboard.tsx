
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from './services/firebase.config';
import { authService } from './services/authService';
import { userService } from './services/userService';
import { walletService } from './services/walletService';
import { medicalRecordService } from './services/medicalRecordService';
import { UserRole, Professional, Transaction, MedicalReport } from './types';

type AdminTab = 'overview' | 'users' | 'professionals' | 'transactions' | 'records' | 'analytics' | 'settings';

const Icons = {
    Dashboard: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ),
    Users: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ),
    Shield: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    CreditCard: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
    File: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    Chart: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    Settings: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    Check: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    ),
    X: ({ className = "w-5 h-5" }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
    ),
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [stats, setStats] = useState({ users: 0, professionals: 0, revenue: 0, sessions: 0 });
    const [pendingPros, setPendingPros] = useState<Professional[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [records, setRecords] = useState<MedicalReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Get stats
            const usersSnap = await getDocs(collection(db, 'users'));
            const prosSnap = await getDocs(query(collection(db, 'professionals'), where('isVerified', '==', true)));
            const txSnap = await getDocs(query(collection(db, 'transactions'), where('type', '==', 'credit')));

            let revenue = 0;
            txSnap.forEach(doc => revenue += doc.data().amount || 0);

            setStats({
                users: usersSnap.size,
                professionals: prosSnap.size,
                revenue: revenue * 0.20, // 20% platform fee
                sessions: prosSnap.size * 15, // Mock session count
            });

            // Get pending professionals
            const pending = await userService.getPendingVerifications();
            setPendingPros(pending);

            // Get all transactions (limited)
            const txQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), firestoreLimit(50));
            const txSnapshot = await getDocs(txQuery);
            const txList: Transaction[] = [];
            txSnapshot.forEach(doc => {
                const data = doc.data();
                txList.push({
                    id: doc.id,
                    ...data,
                    date: data.createdAt?.toDate() || new Date(),
                } as Transaction);
            });
            setTransactions(txList);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
        setLoading(false);
    };

    const handleVerifyProfessional = async (profId: string, approve: boolean) => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            await userService.verifyProfessional(profId, approve, currentUser.uid);
            alert(approve ? 'Professional verified!' : 'Professional rejected');
            loadDashboardData();
        } catch (error) {
            alert('Error processing verification');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-xl font-bold">Loading Admin Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black">LESLEYCARE<span className="text-green-400">™</span> ADMIN</h1>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Platform Control Center</p>
                    </div>
                    <button
                        onClick={() => authService.logout()}
                        className="px-6 py-2 bg-red-600 rounded-lg text-sm font-bold hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', icon: Icons.Dashboard, label: 'Overview' },
                        { id: 'users', icon: Icons.Users, label: 'Users' },
                        { id: 'professionals', icon: Icons.Shield, label: 'Verify Pros' },
                        { id: 'transactions', icon: Icons.CreditCard, label: 'Transactions' },
                        { id: 'records', icon: Icons.File, label: 'Records' },
                        { id: 'analytics', icon: Icons.Chart, label: 'Analytics' },
                        { id: 'settings', icon: Icons.Settings, label: 'Settings' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AdminTab)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-green-400 text-slate-950'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <Icons.Users className="w-8 h-8 text-blue-400 mb-4" />
                                <p className="text-sm text-slate-400 uppercase tracking-widest">Total Users</p>
                                <p className="text-3xl font-black mt-2">{stats.users}</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <Icons.Shield className="w-8 h-8 text-green-400 mb-4" />
                                <p className="text-sm text-slate-400 uppercase tracking-widest">Professionals</p>
                                <p className="text-3xl font-black mt-2">{stats.professionals}</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <Icons.CreditCard className="w-8 h-8 text-yellow-400 mb-4" />
                                <p className="text-sm text-slate-400 uppercase tracking-widest">Revenue (20%)</p>
                                <p className="text-3xl font-black mt-2">${stats.revenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <Icons.Chart className="w-8 h-8 text-purple-400 mb-4" />
                                <p className="text-sm text-slate-400 uppercase tracking-widest">Total Sessions</p>
                                <p className="text-3xl font-black mt-2">{stats.sessions}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-black mb-4">Recent Activity</h2>
                            <div className="space-y-3">
                                {transactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-bold">{tx.description}</p>
                                            <p className="text-xs text-slate-400">{tx.date.toLocaleDateString()}</p>
                                        </div>
                                        <p className={`font-black ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Professionals Verification Tab */}
                {activeTab === 'professionals' && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-black mb-4">Pending Verifications ({pendingPros.length})</h2>
                            {pendingPros.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No pending verifications</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingPros.map(pro => (
                                        <div key={pro.id} className="p-6 bg-slate-800 rounded-xl flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black">{pro.name}</h3>
                                                <p className="text-sm text-green-400 mt-1">{pro.title}</p>
                                                <p className="text-xs text-slate-400 mt-2">{pro.email}</p>
                                                {pro.bio && <p className="text-sm text-slate-300 mt-4">{pro.bio}</p>}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleVerifyProfessional(pro.id, true)}
                                                    className="px-4 py-2 bg-green-600 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
                                                >
                                                    <Icons.Check className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyProfessional(pro.id, false)}
                                                    className="px-4 py-2 bg-red-600 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2"
                                                >
                                                    <Icons.X className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-black mb-4">All Transactions</h2>
                        <div className="space-y-3">
                            {transactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-bold">{tx.description}</p>
                                        <p className="text-xs text-slate-400">{tx.date.toLocaleString()}</p>
                                        <p className="text-xs text-slate-500 mt-1">Status: {tx.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-lg ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-slate-400">{tx.method}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-black mb-4">Platform Analytics</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-800 rounded-xl">
                                <h3 className="font-bold text-slate-400 mb-2">User Growth</h3>
                                <p className="text-4xl font-black text-green-400">+{stats.users}</p>
                                <p className="text-xs text-slate-500 mt-2">Total registered users</p>
                            </div>
                            <div className="p-6 bg-slate-800 rounded-xl">
                                <h3 className="font-bold text-slate-400 mb-2">Revenue Growth</h3>
                                <p className="text-4xl font-black text-yellow-400">${stats.revenue.toFixed(0)}</p>
                                <p className="text-xs text-slate-500 mt-2">Platform earnings (20%)</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-black mb-4">Platform Settings</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800 rounded-xl">
                                <label className="text-sm font-bold text-slate-400">Platform Commission</label>
                                <input
                                    type="number"
                                    defaultValue="20"
                                    className="w-full mt-2 p-3 bg-slate-900 rounded-lg text-white font-bold"
                                />
                                <p className="text-xs text-slate-500 mt-2">Percentage fee on professional withdrawals</p>
                            </div>
                            <div className="p-4 bg-slate-800 rounded-xl">
                                <label className="text-sm font-bold text-slate-400">Minimum Withdrawal</label>
                                <input
                                    type="number"
                                    defaultValue="100"
                                    className="w-full mt-2 p-3 bg-slate-900 rounded-lg text-white font-bold"
                                />
                                <p className="text-xs text-slate-500 mt-2">Minimum amount for professional withdrawals (USD)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
