import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './services/firebase.config';
import { UserRole } from './types';

/**
 * SETUP SCRIPT - Run once to create admin and test accounts
 * 
 * HOW TO RUN:
 * 1. Uncomment the function call at the bottom
 * 2. Import this file in App.tsx temporarily
 * 3. Reload the page
 * 4. Check console for success messages
 * 5. Comment out again after running
 */

export async function createAdminAndTestAccounts() {
    console.log('🚀 Starting account creation...');

    try {
        // 1. CREATE ADMIN ACCOUNT
        console.log('👑 Creating admin account...');

        const adminCredential = await createUserWithEmailAndPassword(
            auth,
            'admin@lesleycare.com',
            'Admin@LesleyCare2026!'
        );

        await setDoc(doc(db, 'users', adminCredential.user.uid), {
            id: adminCredential.user.uid,
            name: 'Admin User',
            email: 'admin@lesleycare.com',
            role: UserRole.ADMIN,
            avatarUrl: `https://i.pravatar.cc/150?u=${adminCredential.user.uid}`,
            isAnonymous: false,
            createdAt: new Date(),
        });

        // Initialize admin wallet
        await setDoc(doc(db, 'wallets', adminCredential.user.uid), {
            userId: adminCredential.user.uid,
            balance: 0,
            currency: 'USD',
            lastUpdated: new Date(),
        });

        console.log('✅ Admin account created!');
        console.log('   Email: admin@lesleycare.com');
        console.log('   Password: Admin@LesleyCare2026!');

        // 2. CREATE TEST PROFESSIONAL #1 (VERIFIED)
        console.log('\n👨‍⚕️ Creating professional 1 (Dr. Sarah)...');

        const prof1 = await createUserWithEmailAndPassword(
            auth,
            'dr.sarah@lesleycare.com',
            'Therapist@2026!'
        );

        await setDoc(doc(db, 'users', prof1.user.uid), {
            id: prof1.user.uid,
            name: 'Dr. Sarah Mitchell',
            email: 'dr.sarah@lesleycare.com',
            role: UserRole.PROFESSIONAL,
            avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150',
            isAnonymous: false,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'professionals', prof1.user.uid), {
            uid: prof1.user.uid,
            title: 'Clinical Psychologist',
            licenseId: 'PSY-12345-CA',
            specialty: ['Anxiety', 'Depression', 'PTSD'],
            hourlyRate: 120,
            bio: 'Licensed clinical psychologist with 10+ years experience helping clients overcome anxiety and depression.',
            languages: ['English', 'Spanish'],
            isOnline: true,
            isVerified: true,
            rating: 4.9,
            totalSessions: 342,
            verifiedAt: new Date(),
            verifiedBy: adminCredential.user.uid,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'wallets', prof1.user.uid), {
            userId: prof1.user.uid,
            balance: 2450.50,
            currency: 'USD',
            lastUpdated: new Date(),
        });

        console.log('✅ Professional 1 created and verified!');

        // 3. CREATE TEST PROFESSIONAL #2 (PENDING)
        console.log('\n👨‍⚕️ Creating professional 2 (Dr. James)...');

        const prof2 = await createUserWithEmailAndPassword(
            auth,
            'dr.james@lesleycare.com',
            'Therapist@2026!'
        );

        await setDoc(doc(db, 'users', prof2.user.uid), {
            id: prof2.user.uid,
            name: 'Dr. James Anderson',
            email: 'dr.james@lesleycare.com',
            role: UserRole.PROFESSIONAL,
            avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
            isAnonymous: false,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'professionals', prof2.user.uid), {
            uid: prof2.user.uid,
            title: 'Mental Health Coach',
            licenseId: 'MHC-67890-NY',
            specialty: ['Stress Management', 'Life Coaching', 'Mindfulness'],
            hourlyRate: 85,
            bio: 'Certified mental health coach specializing in stress management and work-life balance.',
            languages: ['English'],
            isOnline: false,
            isVerified: false, // PENDING VERIFICATION
            rating: 0,
            totalSessions: 0,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'wallets', prof2.user.uid), {
            userId: prof2.user.uid,
            balance: 0,
            currency: 'USD',
            lastUpdated: new Date(),
        });

        console.log('✅ Professional 2 created (pending verification)');

        // 4. CREATE TEST PATIENT #1
        console.log('\n👤 Creating patient 1...');

        const patient1 = await createUserWithEmailAndPassword(
            auth,
            'patient1@lesleycare.com',
            'Patient@2026!'
        );

        await setDoc(doc(db, 'users', patient1.user.uid), {
            id: patient1.user.uid,
            name: 'Alex Johnson',
            email: 'patient1@lesleycare.com',
            role: UserRole.CLIENT,
            avatarUrl: `https://i.pravatar.cc/150?u=${patient1.user.uid}`,
            isAnonymous: false,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'wallets', patient1.user.uid), {
            userId: patient1.user.uid,
            balance: 500.00,
            currency: 'USD',
            lastUpdated: new Date(),
        });

        console.log('✅ Patient 1 created!');

        // 5. CREATE TEST PATIENT #2
        console.log('\n👤 Creating patient 2...');

        const patient2 = await createUserWithEmailAndPassword(
            auth,
            'patient2@lesleycare.com',
            'Patient@2026!'
        );

        await setDoc(doc(db, 'users', patient2.user.uid), {
            id: patient2.user.uid,
            name: 'Maria Garcia',
            email: 'patient2@lesleycare.com',
            role: UserRole.CLIENT,
            avatarUrl: `https://i.pravatar.cc/150?u=${patient2.user.uid}`,
            isAnonymous: false,
            createdAt: new Date(),
        });

        await setDoc(doc(db, 'wallets', patient2.user.uid), {
            userId: patient2.user.uid,
            balance: 1000.00,
            currency: 'USD',
            lastUpdated: new Date(),
        });

        console.log('✅ Patient 2 created!');

        console.log('\n\n🎉 ALL ACCOUNTS CREATED SUCCESSFULLY! 🎉\n');
        console.log('📧 Check CREDENTIALS.md for all login details\n');

    } catch (error: any) {
        console.error('❌ Error creating accounts:', error);
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Some accounts already exist - this is normal if you ran this before');
        } else {
            console.error('Error details:', error.message);
        }
    }
}

// UNCOMMENT TO RUN (then comment out again after running once!)
// createAdminAndTestAccounts();
