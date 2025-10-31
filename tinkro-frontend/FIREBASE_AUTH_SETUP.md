# 🔐 Firebase Authentication Setup Guide

## Firebase Project Setup Kaise Kare

### Step 1: Firebase Console Setup
1. **Firebase Console** pe jao: https://console.firebase.google.com/
2. **"Create a project"** pe click karo
3. Project name dalo: `tinkro-web-auth`
4. Google Analytics enable karo (optional)
5. Project create karo

### Step 2: Web App Add Karo
1. Firebase project dashboard mein jao
2. **Web icon** (</>) pe click karo
3. App nickname dalo: `Tinkro Web App`
4. **"Also set up Firebase Hosting"** check karo (optional)
5. **"Register app"** pe click karo

### Step 3: Configuration Copy Karo
```javascript
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Yaha tumhara API key hoga
  authDomain: "tinkro-web-auth.firebaseapp.com",
  projectId: "tinkro-web-auth",
  storageBucket: "tinkro-web-auth.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef..."
};
```

### Step 4: Authentication Enable Karo
1. Firebase Console → **Authentication** → **Get Started**
2. **Sign-in method** tab pe jao
3. Enable karo ye providers:
   - ✅ **Email/Password**
   - ✅ **Google** (Client ID/Secret setup karo)
   - ✅ **Facebook** (App ID/Secret chahiye)
   - ✅ **Phone** (SMS verification ke liye)

### Step 5: Google OAuth Setup
1. **Google** provider pe click karo
2. **Enable** karo
3. **Project support email** select karo
4. **Save** karo

### Step 6: Facebook OAuth Setup
1. **Facebook Developer Console**: https://developers.facebook.com/
2. **Create App** → **Consumer** → **Continue**
3. App name dalo: `Tinkro Web`
4. **Facebook Login** → **Settings**
5. Valid OAuth Redirect URIs add karo:
   ```
   https://tinkro-web-auth.firebaseapp.com/__/auth/handler
   ```
6. Firebase mein **App ID** aur **App Secret** dalo

### Step 7: Phone Authentication Setup
1. **Phone** provider enable karo
2. **Test phone numbers** add karo (development ke liye)
3. **reCAPTCHA** automatically setup ho jayega

## Code Configuration

### AuthService.js Update Karo
```javascript
// src/services/AuthService.js
const firebaseConfig = {
  // Yaha tumhara actual Firebase config paste karo
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Testing Authentication

### Email/Password Test:
1. **Sign Up** page pe jao
2. Valid email aur strong password dalo
3. Account create hona chahiye
4. Firebase Console → Authentication → Users mein check karo

### Google Login Test:
1. **"Google se continue karo"** button pe click karo
2. Google account select karo
3. Permission de do
4. Automatically login ho jana chahiye

### Phone Login Test:
1. **"Phone se login karo"** pe click karo
2. Valid phone number dalo (+91 se start karo)
3. OTP receive karo SMS mein
4. 6-digit OTP enter karo
5. Login ho jana chahiye

## Security Rules & Settings

### Authentication Domain Setup:
```javascript
// Firebase Console → Authentication → Settings → Authorized domains
// Ye domains add karo:
- localhost
- 127.0.0.1
- your-domain.com (production ke liye)
```

### Password Policy:
```javascript
// Firebase Console → Authentication → Settings → Password policy
- Minimum length: 6 characters
- Require uppercase: Optional
- Require lowercase: Optional  
- Require numeric: Optional
- Require non-alphanumeric: Optional
```

## Common Issues & Solutions

### Issue 1: "Firebase not defined"
```bash
# Solution: Install Firebase properly
npm install firebase
```

### Issue 2: "Auth domain not authorized"
```javascript
// Solution: Add domain in Firebase Console
// Authentication → Settings → Authorized domains
```

### Issue 3: "reCAPTCHA error in phone auth"
```html
<!-- Solution: Add reCAPTCHA container -->
<div id="recaptcha-container"></div>
```

### Issue 4: "Google OAuth not working"
```javascript
// Solution: Check Google Cloud Console
// APIs & Services → Credentials → OAuth 2.0 Client IDs
```

## Admin User Setup

### Default Admin Emails:
```javascript
// src/services/AuthService.js - getUserRole() function mein
const adminEmails = [
  'admin@tinkro.com',
  'rgtechcoder@gmail.com',
  'your-email@gmail.com', // Yaha apna email add karo
];
```

### Admin Access:
1. Admin email se login karo
2. Header mein **User Menu** → **Admin Dashboard**
3. Ya directly: `window.location.hash = 'admin'`

## Production Deployment

### Environment Variables:
```bash
# .env.production
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-production-domain
VITE_FIREBASE_PROJECT_ID=your-production-project-id
```

### Security Checklist:
- ✅ API keys properly configured
- ✅ Authorized domains set
- ✅ Google/Facebook OAuth properly configured  
- ✅ Phone verification working
- ✅ Admin emails configured
- ✅ Password reset working
- ✅ User data properly stored in localStorage

## Features Included

### 🔐 Multiple Login Options:
- **Email/Password** with validation
- **Google OAuth** one-click login
- **Facebook OAuth** social login  
- **Phone/SMS** OTP verification

### 👤 User Management:
- **Profile creation** with photo upload
- **Profile editing** with address management
- **Order history** tracking
- **Wishlist** functionality
- **Preferences** management

### 🛡️ Security Features:
- **JWT-based** authentication
- **Role-based** access (Admin/User)
- **Password reset** via email
- **Input validation** and sanitization
- **Secure logout** from all devices

### 📱 Responsive Design:
- **Mobile-first** approach
- **Smooth animations** with Framer Motion
- **Professional UI** with Tailwind CSS
- **Loading states** and error handling

## Next Steps

1. **Firebase project setup** karo
2. **Configuration update** karo AuthService.js mein  
3. **Test all login methods** properly
4. **Admin user create** karo
5. **Production mein deploy** karo
6. **Users ko demo** do

## Support

Koi problem aaye to:
1. **Console logs** check karo
2. **Firebase Console** mein errors dekho
3. **Network tab** mein API calls check karo
4. **Authentication state** properly track karo

Happy coding! 🚀