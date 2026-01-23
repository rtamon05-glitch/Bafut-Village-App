# 🚀 Firebase Setup - Quick Start (DO THIS NOW!)

## ⏱️ Time: 20 minutes | Follow each step exactly

---

## STEP 1: Create Firebase Project (5 minutes)

### 1. Open Firebase Console
**ACTION:** Click this link → https://console.firebase.google.com

**What you see:** Firebase homepage

### 2. Create Project
**ACTION:** Click big blue button "**Add project**"

### 3. Name Your Project
**TYPE:** `lesleycare-platform`
**CLICK:** Blue "**Continue**" button

### 4. Google Analytics
**TOGGLE:** Turn ON (recommended)
**CLICK:** "**Continue**"

### 5. Analytics Account
**SELECT:** "Create new account"
**NAME:** `lesleycare-platform` (auto-filled)
**CHECK:** All boxes (terms)
**CLICK:** "**Create project**"

### 6. Wait
**WAIT:** 30 seconds (Firebase creates project)
**WHEN DONE:** Click "**Continue**"

✅ **Project created!**

---

## STEP 2: Register Web App (3 minutes)

### 1. Add Web App
**FIND:** Three icons (iOS, Android, Web)
**CLICK:** Web icon `</>`

### 2. Register
**TYPE App nickname:** `LESLEYCARE Web`
**UNCHECK:** "Also set up Firebase Hosting"
**CLICK:** "**Register app**"

### 3. Copy Config
**YOU SEE:** Code with `firebaseConfig`
**ACTION:** Click the **copy icon** 📋
**PASTE INTO:** A text file (you'll need this!)

**It looks like:**
```javascript
{
  apiKey: "AIza...",
  authDomain: "lesleycare-platform.firebaseapp.com",
  projectId: "lesleycare-platform",
  ...
}
```

**CLICK:** "**Continue to console**"

✅ **Web app registered!**

---

## STEP 3: Enable Authentication (3 minutes)

### 1. Go to Authentication
**LEFT SIDEBAR:** Click **"Build"** → **"Authentication"**

### 2. Get Started
**CLICK:** "**Get started**" button

### 3. Enable Email/Password
**FIND:** "Email/Password" row
**CLICK:** On the row itself
**TOGGLE:** Switch to **ON** (turns blue)
**CLICK:** "**Save**"

### 4. Verify
**CHECK:** Email/Password shows "**Enabled**" in green

✅ **Authentication ready!**

---

## STEP 4: Create Firestore Database (4 minutes)

### 1. Go to Firestore
**LEFT SIDEBAR:** **Build** → **Firestore Database**

### 2. Create Database
**CLICK:** "**Create database**"

### 3. Security Rules
**SELECT:** ⚪ **Production mode**
**CLICK:** "**Next**"

### 4. Choose Location
**SELECT YOUR REGION:**
- **USA:** `us-central1`
- **Europe:** `europe-west1`
- **Africa:** `europe-west1` (closest)
- **Asia:** `asia-southeast1`

**⚠️ CANNOT CHANGE LATER!**

**CLICK:** "**Enable**"

### 5. Wait
**WAIT:** 60 seconds
**WHEN DONE:** Firestore dashboard appears

✅ **Firestore created!**

---

## STEP 5: Enable Storage (3 minutes)

### 1. Go to Storage
**LEFT SIDEBAR:** **Build** → **Storage**

### 2. Get Started
**CLICK:** "**Get started**"

### 3. Security Rules
**SCREEN 1:** Shows default rules
**CLICK:** "**Next**"

### 4. Location
**AUTO-SELECTED:** Same as Firestore
**VERIFY:** Location matches
**CLICK:** "**Done**"

### 5. Wait
**WAIT:** 30 seconds
**WHEN DONE:** Storage browser appears

✅ **Storage enabled!**

---

## STEP 6: Deploy Security Rules (2 minutes)

### 1. Update Firestore Rules
**GO TO:** Firestore Database → **Rules** tab

**ACTION:** Delete everything and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /professionals/{profId} {
      allow read: if true;
      allow write: if isOwner(profId);
    }
    
    match /mood_entries/{entryId} {
      allow read, write: if isSignedIn();
    }
    
    match /{document=**} {
      allow read, write: if isSignedIn();
    }
  }
}
```

**CLICK:** "**Publish**"
**CONFIRM:** Click "**Publish**" again

### 2. Update Storage Rules
**GO TO:** Storage → **Rules** tab

**ACTION:** Delete everything and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /medical_records/{userId}/{filename} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**CLICK:** "**Publish**"

✅ **Security configured!**

---

## STEP 7: Get Your Firebase Config (1 minute)

### 1. Go to Settings
**CLICK:** ⚙️ Gear icon (top left)
**SELECT:** "**Project settings**"

### 2. Scroll to Your Apps
**SCROLL DOWN:** To "Your apps" section
**FIND:** "LESLEYCARE Web"

### 3. Copy Values
**YOU SEE:** `firebaseConfig` object

**COPY EACH VALUE:**
- `apiKey`: `AIza...`
- `authDomain`: `...firebaseapp.com`
- `projectId`: `...`
- `storageBucket`: `...appspot.com`
- `messagingSenderId`: `...`
- `appId`: `1:...`

**KEEP THIS WINDOW OPEN!**

---

## STEP 8: Update Your App (2 minutes)

### 1. Open .env.local
**FILE:** `c:\Users\PC\Desktop\leslaycare mbuagbor\Leslaycare\.env.local`

### 2. Replace Values
**FROM FIREBASE → TO .ENV.LOCAL**

```bash
FIREBASE_API_KEY=AIza... (your actual value)
FIREBASE_AUTH_DOMAIN=lesleycare-platform.firebaseapp.com
FIREBASE_PROJECT_ID=lesleycare-platform
FIREBASE_STORAGE_BUCKET=lesleycare-platform.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

**SAVE:** Ctrl+S

### 3. Restart Server
**TERMINAL:**
1. Press `Ctrl+C` (stop server)
2. Type: `npm run dev`
3. Press Enter

**WAIT FOR:**
```
➜  Local:   http://localhost:3000/
```

✅ **App connected to Firebase!**

---

## STEP 9: Create Admin User (3 minutes)

### Method A: Via Firebase Console (Easiest)

#### 1. Go to Authentication
**CLICK:** Authentication → **Users** tab

#### 2. Add User
**CLICK:** "**Add user**" (blue button)

**FILL IN:**
- Email: `admin@lesleycare.com`
- Password: `Admin@2026!` (change this!)

**CLICK:** "**Add user**"

#### 3. Copy UID
**FIND:** Your new user in table
**HOVER:** Over the UID
**CLICK:** Copy icon 📋
**PASTE:** Into notepad (save it!)

#### 4. Create Firestore Document
**GO TO:** Firestore Database → **Data** tab

**CLICK:** "+ Start collection"

**COLLECTION ID:** `users`
**CLICK:** "Next"

**DOCUMENT ID:** Paste the UID you copied

**ADD FIELDS:**
1. Field: `id`, Type: `string`, Value: (same UID)
2. Field: `name`, Type: `string`, Value: `Admin User`
3. Field: `email`, Type: `string`, Value: `admin@lesleycare.com`
4. Field: `role`, Type: `string`, Value: `admin`
5. Field: `createdAt`, Type: `timestamp`, (click calendar icon, select now)

**CLICK:** "**Save**"

✅ **Admin user created!**

---

## STEP 10: Test Everything (2 minutes)

### 1. Open App
**BROWSER:** http://localhost:3000

### 2. Test Signup
**CLICK:** "Get Started"
**SELECT:** "I am a Patient"
**FILL:** Name, email, password
**SUBMIT**
**SKIP:** Email verification (click "I Have Confirmed")

### 3. Verify in Firebase
**GO TO:** Firebase → Authentication → Users
**CHECK:** Your test user appears ✅

### 4. Test Dr. Leslie Chat
**IN APP:** Click green microphone button
**TYPE:** "Hello"
**CHECK:** AI responds ✅

### 5. Test Mood Tracker
**ADD TO APP.TSX:** Import and render MoodTracker component
**TEST:** Log a mood
**CHECK:** Firestore → `mood_entries` collection created ✅

---

## ✅ SETUP COMPLETE!

### What You Now Have:
- ✅ Firebase project
- ✅ Authentication working
- ✅ Database storing data
- ✅ Storage for files
- ✅ Admin user ready
- ✅ Security rules deployed
- ✅ App fully connected

---

## 🆘 Problems? Quick Fixes

**"Permission denied"**
→ Check security rules are published

**"Firebase not initialized"**
→ Restart dev server

**Can't login as admin**
→ Verify `role` field is `"admin"` in Firestore

**Config error**
→ Double-check .env.local has NO spaces around =

---

## 🎉 NEXT STEPS

1. Follow the email engagement workflow guide
2. Implement more advanced features
3. Test with real users
4. Deploy to production!

**Your LESLEYCARE™ platform is LIVE!** 🚀
