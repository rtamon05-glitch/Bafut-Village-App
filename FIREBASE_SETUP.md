# 🔥 Firebase Setup Guide for LESLEYCARE™

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. **Project name:** `lesleycare-platform` (or your choice)
4. **Google Analytics:** Enable or disable (your choice)
5. Click **"Create project"**

---

## Step 2: Register Web App

1. In your Firebase project, click the **Web icon** `</>`
2. **App nickname:** `lesleycare-web`
3. ✅ Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase config object** - you'll need this!

---

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

---

## Step 4: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. **Start in:** **Production mode** (we'll add custom rules)
4. **Location:** Choose closest to your users
5. Click **"Enable"**

### Apply Security Rules

1. Go to **Firestore Database → Rules** tab
2. Copy content from `firestore.rules` file
3. Paste and click **"Publish"**

---

## Step 5: Enable Firebase Storage

1. Go to **Build → Storage**
2. Click **"Get started"**
3. **Start in:** **Production mode**
4. Click **"Next"** → **"Done"**

### Apply Storage Rules

1. Go to **Storage → Rules** tab
2. Copy content from `storage.rules` file
3. Paste and click **"Publish"**

---

## Step 6: Configure Your App

1. Open `.env.local` in your project
2. Replace the placeholder values with your Firebase config:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key

# Firebase Configuration (from Step 2)
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=lesleycare-platform.firebaseapp.com
FIREBASE_PROJECT_ID=lesleycare-platform
FIREBASE_STORAGE_BUCKET=lesleycare-platform.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Step 7: Create Admin User

Since we need an admin to access the admin dashboard:

### Method 1: Manual Creation (Quick)

1. Run the app: `npm run dev`
2. Sign up as a normal user
3. Go to Firebase Console → **Firestore Database**
4. Find your user document in the `users` collection
5. Edit the document and change `role` from `"patient"` to `"admin"`
6. Save

### Method 2: Using Firebase Console

1. Go to **Authentication → Users**
2. Click **"Add user"**
3. **Email:** `admin@lesleycare.com`
4. **Password:** Create a secure password
5. Click **"Add user"**
6. Go to **Firestore Database**
7. Create a document in `users` collection with the user's UID as the document ID:
   ```json
   {
     "id": "the-user-uid",
     "name": "Admin User",
     "email": "admin@lesleycare.com",
     "role": "admin",
     "createdAt": [current timestamp]
   }
   ```

---

## Step 8: Run the Application

```bash
npm run dev
```

App will be available at: **http://localhost:3000**

---

## Step 9: Access Admin Dashboard

1. Create the admin dashboard route
2. Login with admin credentials
3. You should see the admin control panel

---

## Collections Structure

Your Firestore will have these collections:

- **users** - User profiles
- **professionals** - Professional details
- **wallets** - User wallet balances
- **transactions** - All platform transactions
- **medical_records** - Medical document metadata
- **chat_sessions/{userId}/messages** - Chat history
- **video_sessions** - Scheduled consultations
- **admin_logs** - Admin activity logs

---

## Security Features

✅ **Role-based access control** (Patient, Professional, Admin)  
✅ **Firestore security rules** prevent unauthorized access  
✅ **Storage rules** limit file types and sizes  
✅ **20% platform commission** on professional withdrawals  
✅ **Encrypted Firebase connections**

---

## Next Steps

1. Test user signup/login
2. Create a professional account and verify it via admin
3. Upload medical records
4. Test wallet transactions
5. Deploy to production when ready

---

## Troubleshooting

**"Firebase not initialized"**
- Make sure `.env.local` has all Firebase variables
- Restart the dev server after changing .env.local

**"Permission denied"**
- Check that security rules are properly deployed
- Verify user role in Firestore

**"Module not found: firebase"**
- Run `npm install` again
- Clear node_modules and reinstall

---

## Production Deployment

When ready to deploy:

1. Build the app: `npm run build`
2. Deploy to Firebase Hosting:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

Your LESLEYCARE™ platform is now live! 🚀
