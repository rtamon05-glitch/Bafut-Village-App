# 🏥 LESLEYCARE™ - Quick Start Guide

## ⚡ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key

**Get Your API Key:**
1. Visit: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your new API key

**Add to .env.local:**
Open `.env.local` and replace `your_gemini_api_key_here` with your actual API key:

```bash
GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

### 3. Run the App
```bash
npm run dev
```

The app will open at: **http://localhost:3000**

---

## 🎯 Testing the App

### Test Dr. Leslie AI Chat:
1. Click "Get Started" → "I am a Patient"
2. Fill in the signup form
3. Click "I Have Confirmed" on verification page
4. On the dashboard, click the large green microphone button
5. Type a message to Dr. Leslie AI

### Expected Behavior:
- Dr. Leslie should respond with empathetic, clinical guidance
- Chat history is saved in localStorage
- Dialogue appears in "Dialogue Ledger" on home tab

---

## 🔧 What Was Fixed

✅ **Package.json**: Changed `@google/genai` → `@google/generative-ai`  
✅ **geminiService.ts**: Complete rewrite using correct Gemini SDK  
✅ **.env.local**: Created environment configuration file  
✅ **index.html**: Fixed import map for correct SDK  
✅ **Types**: Added React TypeScript definitions  

---

## ⚠️ Known Limitations

**Live Audio Mode:**
The live audio feature requires the Gemini Multimodal Live API which is currently in limited preview and requires WebSocket backend implementation. Currently falls back to text chat.

**To Enable Full Audio:**
- Implement FastAPI/Node.js backend with WebSocket proxy
- Use Gemini Multimodal Live API
- Implement audio streaming via PCM encoding

---

## 🚀 Next Steps

1. **Add your Gemini API key** to `.env.local`
2. **Run `npm run dev`**
3. **Test the chat interface**
4. (Optional) Implement backend for live audio support
