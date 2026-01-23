# 🔐 LESLEYCARE™ - Admin & Test Credentials

**⚠️ KEEP THIS FILE SECURE! DO NOT SHARE OR COMMIT TO GIT**

---

## 👑 ADMIN ACCESS

### Admin Account

**Email:** `admin@lesleycare.com`  
**Password:** `Admin@LesleyCare2026!`  
**Role:** Administrator

**Access Level:**
- Full platform control
- User management
- Professional verification
- Transaction monitoring
- Analytics dashboard
- System settings

**Admin Dashboard URL:**
```
http://localhost:3000/admin
```

---

## 👨‍⚕️ TEST PROFESSIONAL ACCOUNTS

### Test Therapist #1

**Email:** `dr.sarah@lesleycare.com`  
**Password:** `Therapist@2026!`  
**Role:** Professional  
**Specialty:** Clinical Psychologist  
**Status:** Verified

---

### Test Therapist #2

**Email:** `dr.james@lesleycare.com`  
**Password:** `Therapist@2026!`  
**Role:** Professional  
**Specialty:** Mental Health Coach  
**Status:** Pending Verification

---

## 👤 TEST PATIENT ACCOUNTS

### Patient #1

**Email:** `patient1@lesleycare.com`  
**Password:** `Patient@2026!`  
**Role:** Client  
**Profile:** Active user

---

### Patient #2

**Email:** `patient2@lesleycare.com`  
**Password:** `Patient@2026!`  
**Role:** Client  
**Profile:** New user

---

## 🔑 QUICK ACCESS GUIDE

### Login Flow

1. **Open App:** http://localhost:3000
2. **Click:** "Member Sign In"
3. **Enter:** Email and Password from above
4. **Click:** "Authenticate"

### Admin Panel Access

1. **Login** with admin credentials
2. **Navigate to:** http://localhost:3000/admin
3. **Or:** Access via dashboard menu

---

## 📧 EMAIL CREDENTIALS (SendGrid)

**For Email Automation:**

**SendGrid Account:** (You need to create this)
- URL: https://app.sendgrid.com/
- Create free account
- Generate API key
- Add to .env.local: `SENDGRID_API_KEY=...`

**Sender Email:** `hello@lesleycare.com`  
**Support Email:** `support@lesleycare.com`

---

## 🔒 SECURITY NOTES

### Change These Passwords!

**For Production:**
1. Change ALL default passwords
2. Use unique strong passwords
3. Enable 2FA where possible
4. Rotate passwords every 90 days

### Password Requirements

Minimum requirements for new passwords:
- 12+ characters
- Upper & lowercase letters
- Numbers
- Special characters
- No common words

**Example Strong Password:**
```
Lc$2026!SecureP@ssw0rd#Xyz
```

---

## 🎯 FIRST-TIME SETUP CHECKLIST

After restarting server:

- [ ] Login as admin to verify access
- [ ] Create professional account for testing
- [ ] Verify professional as admin
- [ ] Create patient account
- [ ] Test chat with Dr. Leslie
- [ ] Test mood tracker
- [ ] Book a test session
- [ ] Check admin dashboard stats

---

## 📱 TESTING SCENARIOS

### Scenario 1: Patient Journey
1. Login as `patient1@lesleycare.com`
2. Browse professionals
3. Book a session with dr.sarah
4. Use Dr. Leslie AI chat
5. Log mood entries
6. Upload medical record

### Scenario 2: Professional Workflow
1. Login as `dr.sarah@lesleycare.com`
2. Check booking requests
3. Accept sessions
4. View earnings
5. Request withdrawal

### Scenario 3: Admin Management
1. Login as `admin@lesleycare.com`
2. Verify dr.james account
3. Monitor transactions
4. View platform analytics
5. Manage users

---

## 🆘 TROUBLESHOOTING

### Can't Login?

**"Invalid credentials":**
- Copy-paste email exactly (no spaces!)
- Check password is typed correctly
- Verify account exists in Firebase Console

**"User not found":**
- Account needs to be created first
- Use signup flow
- Then manually change role in Firestore

### Admin Panel Not Loading?

1. Check user role is "admin" in Firestore
2. Clear browser cache
3. Try incognito/private window
4. Check console for errors

---

## 📝 NOTES

- Admin account must be created manually in Firebase Console
- Professional accounts need admin verification
- Patient accounts are auto-active
- All passwords are examples - change in production!

**Last Updated:** January 23, 2026  
**Platform:** LESLEYCARE™ Intelligence Platform  
**Version:** 1.0.0

---

## 🔐 REMEMBER

**DO NOT:**
- ❌ Commit this file to Git
- ❌ Share passwords via email
- ❌ Use these passwords in production
- ❌ Store passwords in plain text long-term

**DO:**
- ✅ Use a password manager
- ✅ Enable Firebase security rules
- ✅ Change default passwords
- ✅ Monitor access logs
- ✅ Set up 2FA for admin

---

**Need Help?** Check the documentation or Firebase Console for user management.
