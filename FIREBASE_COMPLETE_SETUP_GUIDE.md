# 🔥 Complete Firebase Setup Guide for LESLEYCARE™
## Step-by-Step Tutorial with Screenshots

> **⏱️ Estimated Time:** 30-45 minutes  
> **💰 Cost:** Free (Firebase Spark Plan)  
> **📋 Prerequisites:** Google account

---

## 📌 Table of Contents

1. [Create Firebase Project](#step-1-create-firebase-project)
2. [Register Web App](#step-2-register-web-app)
3. [Enable Authentication](#step-3-enable-authentication)
4. [Setup Firestore Database](#step-4-setup-firestore-database)
5. [Enable Firebase Storage](#step-5-enable-firebase-storage)
6. [Configure Security Rules](#step-6-configure-security-rules)
7. [Get Your Config](#step-7-get-your-config)
8. [Update Your App](#step-8-update-your-app)
9. [Create Admin User](#step-9-create-admin-user)
10. [Test Everything](#step-10-test-everything)

---

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console

1. Open your browser
2. Navigate to: **https://console.firebase.google.com**
3. Sign in with your Google account

**What you'll see:**
- Firebase homepage with "Create a project" button
- List of existing projects (if you have any)

---

### 1.2 Click "Create a project" or "Add project"

**Location:** Top center of the page, big blue button

---

### 1.3 Enter Project Name

**On the first screen you'll see:**
- Text field: "Enter your project name"
- Character limit: 1-30 characters
- Name validation (checks for uniqueness)

**What to enter:**
```
lesleycare-platform
```

**Or use any name you prefer:**
```
my-telehealth-app
lesleycare-prod
healthcare-platform-2026
```

**Tips:**
- Use lowercase letters
- Hyphens are good
- No spaces allowed
- Make it memorable

**Then click:** `Continue` (blue button bottom right)

---

### 1.4 Google Analytics (Optional)

**Screen shows:**
- Toggle: "Enable Google Analytics for this project"
- Explanation of what Analytics does

**Recommendation:**
- ✅ **Enable it** - Free analytics and insights
- ❌ **Disable it** - If you want minimal setup

**For this guide, we'll ENABLE it.**

**Click:** `Continue`

---

### 1.5 Configure Google Analytics

**If you enabled Analytics, you'll see:**

**Option 1:** Use existing Analytics account
**Option 2:** Create new Analytics account (recommended)

**Select:** "Create new account"

**Account name:** (auto-filled with project name)
```
lesleycare-platform
```

**Checkboxes below:**
- ✅ Analytics data sharing settings (keep default)
- ✅ Google Analytics terms
- ✅ Firebase terms

**Click:** `Create project` (blue button)

---

### 1.6 Wait for Project Creation

**You'll see:**
- Animated Firebase logo
- "Creating your project..." message
- Progress indicator

**Time:** 20-40 seconds

**When done:**
- ✅ Checkmark appears
- "Your new project is ready"
- Button: "Continue"

**Click:** `Continue`

---

## Step 2: Register Web App

### 2.1 Add Firebase to Your Web App

**You're now on the** Project Overview **page**

**You'll see:**
- Project name at top
- Three large icons: iOS, Android, **Web (</>)**
- "Get started by adding Firebase to your app"

**Click:** The **Web icon** `</>`

**Icon location:** Center of screen, third option

---

### 2.2 Register App Details

**Modal popup appears:**

**Fields:**
1. **App nickname** (required)
   ```
   LESLEYCARE Web
   ```
   *This is just for you to identify the app in Firebase*

2. **Also set up Firebase Hosting** (checkbox)
   - ☐ Leave UNCHECKED for now
   - We'll add hosting later if needed

**Click:** `Register app` (blue button)

---

### 2.3 Add Firebase SDK

**Screen shows:**

**Section: "Add Firebase SDK"**

You'll see JavaScript code like:
```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
  
  const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "lesleycare-platform.firebaseapp.com",
    projectId: "lesleycare-platform",
    storageBucket: "lesleycare-platform.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
  };
  
  const app = initializeApp(firebaseConfig);
</script>
```

**IMPORTANT:** 🔴 **Copy the `firebaseConfig` object** - you'll need this!

**Click:** `Continue to console` (skip the "npm install" for now)

---

## Step 3: Enable Authentication

### 3.1 Navigate to Authentication

**In the left sidebar, click:**
- 🔐 **Build** (expand the menu)
- ⚡ **Authentication**

**Or use quick link:** Project Overview → Authentication card

---

### 3.2 Get Started

**Screen shows:**
- Large illustration
- Heading: "Authentication"  
- Button: "Get started"

**Click:** `Get started`

---

### 3.3 Choose Sign-in Method

**You're now on:** Sign-in method **tab**

**You'll see a table with providers:**
- Email/Password
- Phone
- Google
- Anonymous
- Facebook
- Twitter
- GitHub
- More...

**Find "Email/Password" row** (usually first)
- Status: Disabled (gray)
- Icon: Envelope

**Click** on the "Email/Password" **row**

---

### 3.4 Enable Email/Password Auth

**Modal appears:** "Email/Password"

**Two toggles visible:**

1. **Email/Password** 
   - Switch to: ✅ **Enabled**

2. **Email link (passwordless sign-in)**
   - Leave: ☐ **Disabled** (for now)

**After enabling:**
- Toggle turns blue
- Message: "Enabled"

**Click:** `Save` (blue button bottom right)

---

### 3.5 Verify Authentication is Active

**Back on Sign-in method tab:**

**Email/Password row now shows:**
- Status: **Enabled** (blue text)
- ✅ Green checkmark

✅ **Authentication is ready!**

---

## Step 4: Setup Firestore Database

### 4.1 Navigate to Firestore

**In the left sidebar:**
- 🔐 **Build**
- 📊 **Firestore Database**

**Click:** Firestore Database

---

### 4.2 Create Database

**Screen shows:**
- Illustration of database
- Heading: "Cloud Firestore"
- Button: "Create database"

**Click:** `Create database`

---

### 4.3 Choose Database Mode

**Modal: "Create database"**

**Two options:**

1. **Start in production mode** ⭐ (Recommended)
   - Secure by default
   - We'll add custom rules

2. **Start in test mode**
   - Open to all (insecure!)
   - Good for quick prototyping

**Select:** ⚪ **Production mode**

**Explanation shows:**
```
Client requests to your database will be denied by default. 
You'll need to write security rules to allow access.
```

**This is good!** We have custom rules ready.

**Click:** `Next`

---

### 4.4 Set Database Location

**Screen: "Set Cloud Firestore location"**

**Choose region closest to your users:**

**For USA:**
- `us-central1 (Iowa)`
- `us-east1 (South Carolina)`
- `us-west1 (Oregon)`

**For Europe:**
- `europe-west1 (Belgium)`
- `europe-west2 (London)`

**For Africa:**
- `europe-west1 (Belgium)` - Closest option

**For Asia:**
- `asia-south1 (Mumbai)`
- `asia-southeast1 (Singapore)`

**⚠️ WARNING:** Once set, **you cannot change** the location!

**Choose wisely based on where most users will be.**

**After selecting location, click:** `Enable`

---

### 4.5 Wait for Database Creation

**Loading screen:**
- "Enabling Cloud Firestore..."
- Progress animation

**Time:** 30-60 seconds

**When done:**
- Firestore console appears
- Empty database (no collections yet)
- Tab navigation: Data | Rules | Indexes | Usage

✅ **Firestore is ready!**

---

## Step 5: Enable Firebase Storage

### 5.1 Navigate to Storage

**Left sidebar:**
- 🔐 **Build**
- 📁 **Storage**

**Click:** Storage

---

### 5.2 Get Started with Storage

**Screen shows:**
- Illustration of file storage
- Heading: "Cloud Storage"
- Button: "Get started"

**Click:** `Get started`

---

### 5.3 Security Rules for Storage

**Modal: "Get started with Cloud Storage"**

**Step 1 of 2:** Security rules

**Shows default rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**This means:** Only authenticated users can read/write files.

**Recommendation:** Click `Next` (we'll update rules later)

---

### 5.4 Choose Storage Location

**Step 2 of 2:** "Set a location"

**IMPORTANT:** Must match Firestore location!

**Shows:**
- Dropdown with regions
- Pre-selected: Same as database

**Verify location matches your Firestore**

**Click:** `Done`

---

### 5.5 Storage Created

**Loading:**
- "Creating storage bucket..."

**When complete:**
- Storage browser appears
- Empty storage (no files yet)
- Tabs: Files | Rules | Usage

✅ **Storage is ready!**

---

## Step 6: Configure Security Rules

### 6.1 Update Firestore Rules

**Navigate to:** Firestore Database → **Rules** tab

**You'll see:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**This denies all access!** We need to update it.

---

### 6.2 Copy Your Project's Firestore Rules

**In your code editor, open:**
```
firestore.rules
```

**Copy the ENTIRE content** (should be ~80 lines)

**Back to Firebase Console:**
1. **Select all** the existing rules (Ctrl+A)
2. **Paste** your new rules
3. **Click:** `Publish` (top right)

**Confirmation dialog:**
- "Are you sure you want to publish?"
- **Click:** `Publish`

**Success message appears:**
✅ "Rules published successfully"

---

### 6.3 Update Storage Rules

**Navigate to:** Storage → **Rules** tab

**You'll see default rules**

**In your code editor, open:**
```
storage.rules
```

**Copy the ENTIRE content**

**Back to Firebase Console:**
1. **Select all** existing rules
2. **Paste** your new rules
3. **Click:** `Publish`

**Confirmation:**
- "Are you sure?"
- **Click:** `Publish`

✅ **Security rules updated!**

---

## Step 7: Get Your Config

### 7.1 Go to Project Settings

**Click the** ⚙️ **gear icon** (top left, next to "Project Overview")

**Dropdown menu shows:**
- Project settings
- Usage and billing
- Integrations
- Service accounts

**Click:** `Project settings`

---

### 7.2 Find Your Web App Config

**Scroll down to:** "Your apps" section

**You'll see:**
- SDK setup and configuration
- Your web app: "LESLEYCARE Web"

**Under your app name, you'll see icons:**
- Config (</>) 
- Npm
- CDN

**The firebaseConfig object is visible:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "lesleycare-platform.firebaseapp.com",
  projectId: "lesleycare-platform",
  storageBucket: "lesleycare-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### 7.3 Copy Your Configuration

**Method 1:** Click the copy icon 📋 next to the config

**Method 2:** Manually copy each value

**You need:**
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

**Keep this window open!** You'll need these values next.

---

## Step 8: Update Your App

### 8.1 Open .env.local File

**In your code editor:**
```
c:\Users\PC\Desktop\leslaycare mbuagbor\Leslaycare\.env.local
```

**You'll see:**
```bash
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyBsxGb9W5rHMQL0sPwKGJRebO3Vz5t7z8E

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

---

### 8.2 Replace Firebase Config Values

**From your Firebase console, copy each value:**

**Example (yours will be different):**
```bash
FIREBASE_API_KEY=AIzaSyC8rtZ71vzLmkqBv9W2XyHd2Jn4K9pQrSt
FIREBASE_AUTH_DOMAIN=lesleycare-platform.firebaseapp.com
FIREBASE_PROJECT_ID=lesleycare-platform
FIREBASE_STORAGE_BUCKET=lesleycare-platform.appspot.com
FIREBASE_MESSAGING_SENDER_ID=987654321
FIREBASE_APP_ID=1:987654321:web:a1b2c3d4e5f6g7h8
```

**IMPORTANT:** 
- ❌ No quotes around values
- ❌ No spaces before/after =
- ✅ Keep `GEMINI_API_KEY` unchanged

---

### 8.3 Save the File

**Press:** `Ctrl + S` (Windows) or `Cmd + S` (Mac)

**Verify:** File saved indicator (circle or checkmark in tab)

---

### 8.4 Restart Dev Server

**In your terminal:**

1. **Stop** the current server:
   - Press: `Ctrl + C`
   - Confirm: `Y` (if prompted)

2. **Start** server again:
   ```bash
   npm run dev
   ```

**Wait for:**
```
VITE v6.4.1  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

✅ **App is now connected to Firebase!**

---

## Step 9: Create Admin User

### Method 1: Via Firebase Console (Easiest)

#### 9.1 Go to Authentication

**Firebase Console → Authentication → Users tab**

---

#### 9.2 Add User

**Click:** `Add user` (blue button top right)

**Modal appears: "Add a user"**

**Fill in:**
- **Email:** `admin@lesleycare.com`
- **Password:** Create a strong password (save it!)
  - Example: `Admin@2026!Secure`
  - Requirements: 6+ characters

**Click:** `Add user`

---

#### 9.3 Copy User UID

**User appears in table:**
- Email: admin@lesleycare.com
- UID: A long string like `xY7wK2mN9pQ...`

**Hover over UID → Copy icon appears**

**Click:** Copy icon 📋

**Save the UID** - you'll need it next!

---

#### 9.4 Create User Document in Firestore

**Navigate to:** Firestore Database → Data tab

**Click:** `+ Start collection`

**Collection ID:**
```
users
```

**Click:** `Next`

---

**Document ID:**
- Paste the **User UID** you copied
- Example: `xY7wK2mN9pQ1rS3tU4vW5x`

**Add fields:**

| Field | Type | Value |
|-------|------|-------|
| `id` | string | (same UID) |
| `name` | string | `Admin User` |
| `email` | string | `admin@lesleycare.com` |
| `role` | string | `admin` |
| `createdAt` | timestamp | (click "Add timestamp") |

**Click:** `Save`

✅ **Admin user created!**

---

### Method 2: Via App Signup (Alternative)

#### 9.1 Open Your App

**Browser:** http://localhost:3000

---

#### 9.2 Sign Up

1. Click "Get Started"
2. Select "I am a Patient"
3. Fill form:
   - Name: Admin User
   - Email: admin@lesleycare.com
   - Password: YourStrongPassword
4. Submit

---

#### 9.3 Skip Email Verification

Click "I Have Confirmed"

---

#### 9.4 Change Role in Firebase

**Go to Firebase Console:**
- Firestore → users collection
- Find your new user document
- Edit the `role` field
- Change `"patient"` to `"admin"`
- Save

✅ **You're now an admin!**

---

## Step 10: Test Everything

### 10.1 Test Authentication

**Open:** http://localhost:3000

**Test Signup:**
1. Click "Get Started"
2. Create test account
3. Verify you're logged in

**Verify in Firebase:**
- Authentication → Users
- Your test user appears ✅

---

### 10.2 Test Firestore

**In your app:**
- Create some data (chat messages, etc.)

**Check Firebase:**
- Firestore → Data
- Collections appear ✅

---

### 10.3 Test AI Chat

1. Login to app
2. Click green microphone button
3. Send message: "Hello Dr. Leslie"
4. Verify AI response ✅

---

### 10.4 Access Admin Dashboard

**Create admin route file:**

**New file:** `admin.html` (in project root)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - LESLEYCARE</title>
  <script type="module" src="/AdminDashboard.tsx"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**Access:** http://localhost:3000/admin.html

**Login with admin credentials**

**Verify admin dashboard loads ✅**

---

## ✅ Setup Complete Checklist

- [x] Firebase project created
- [x] Web app registered
- [x] Authentication enabled
- [x] Firestore database created
- [x] Storage enabled
- [x] Security rules deployed
- [x] Config added to .env.local
- [x] App connected to Firebase
- [x] Admin user created
- [x] Everything tested

---

## 🆘 Troubleshooting

### "Firebase not initialized"

**Cause:** Environment variables not loaded

**Fix:**
1. Verify `.env.local` has all values
2. Restart dev server
3. Clear browser cache

---

### "Permission denied" errors

**Cause:** Security rules not deployed

**Fix:**
1. Go to Firestore → Rules
2. Verify your rules are published
3. Check timestamp (should be recent)

---

### "App not found" error

**Cause:** Wrong config values

**Fix:**
1. Double-check all `.env.local` values
2. Ensure no extra spaces
3. Match exactly from Firebase console

---

### Can't login as admin

**Cause:** Role not set correctly

**Fix:**
1. Firestore → users → [your user]
2. Verify `role` field = `"admin"`
3. Logout and login again

---

## 🎉 You're All Set!

Your LESLEYCARE™ platform is now fully connected to Firebase!

**What you can now do:**
- ✅ User signup/login
- ✅ Store data persistently
- ✅ Upload medical records
- ✅ Manage users via admin
- ✅ Track transactions
- ✅ Everything is secure!

**Next:** Start implementing advanced features from the `advanced_features_plan.md`!

---

## 📞 Need Help?

- **Firebase Docs:** https://firebase.google.com/docs
- **Support:** https://firebase.google.com/support
- **Community:** https://stackoverflow.com/questions/tagged/firebase

🚀 **Happy Building!**
