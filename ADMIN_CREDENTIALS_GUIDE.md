# 🔐 Admin Credentials Management Guide

## 📋 How to Change Admin Username & Password

### 🎯 Quick Steps:

1. **Open `.env` file** in project root directory
2. **Find these lines:**
   ```env
   VITE_ADMIN_USERNAME=tinkro_admin
   VITE_ADMIN_PASSWORD=Tinkro@2024#Admin
   ```

3. **Change to your desired credentials:**
   ```env
   VITE_ADMIN_USERNAME=your_new_username
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

4. **Save the file**
5. **Restart development server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

---

## 🔒 Password Security Guidelines:

### ✅ **Strong Password Requirements:**
- **Minimum 8 characters**
- **Mix of uppercase & lowercase letters**
- **Include numbers (0-9)**
- **Special characters (!@#$%^&*)**
- **Avoid common words**

### 💡 **Good Password Examples:**
```
MyCompany@2024!
Tinkro#Admin123
SecurePass$456
AdminLogin!2024
```

### ❌ **Avoid These:**
```
admin123       (too simple)
password       (common word)
123456789      (only numbers)
qwertyuiop     (keyboard pattern)
```

---

## 📂 File Locations:

### **Environment File:**
```
📁 Project Root
  └── .env                    ← Edit this file
      └── src/
      └── package.json
      └── README.md
```

### **Login Component:**
```
📁 src/components/
  └── AdminLogin.jsx          ← Auto-updates from .env
```

---

## 🔄 Change Process Example:

### **1. Current Credentials (Default):**
```env
VITE_ADMIN_USERNAME=tinkro_admin
VITE_ADMIN_PASSWORD=Tinkro@2024#Admin
```

### **2. Your New Credentials:**
```env
VITE_ADMIN_USERNAME=rahul_admin
VITE_ADMIN_PASSWORD=MySecure@Pass123
```

### **3. Test New Login:**
- Go to Admin Dashboard
- Use new username: `rahul_admin`
- Use new password: `MySecure@Pass123`

---

## 🛡️ Security Best Practices:

### **📍 Production Deployment:**
```env
# Use strong, unique credentials
VITE_ADMIN_USERNAME=company_admin_2024
VITE_ADMIN_PASSWORD=Str0ng!P@ssw0rd#2024
```

### **🔐 Additional Security:**
- **Change default credentials immediately**
- **Use different passwords for different environments**
- **Don't share credentials in public repositories**
- **Consider 2FA for production systems**

---

## ❓ Troubleshooting:

### **Problem: Login not working after change**
**Solution:** 
1. Check `.env` file saved properly
2. Restart development server completely
3. Clear browser cache/localStorage
4. Verify no extra spaces in credentials

### **Problem: Credentials not updating**
**Solution:**
1. Ensure file is saved as `.env` (not `.env.txt`)
2. Restart server: `Ctrl+C` then `npm run dev`
3. Check browser developer console for errors

---

## 🎯 Quick Reference:

| Action | Command | File |
|--------|---------|------|
| Edit Credentials | Open in editor | `.env` |
| Restart Server | `npm run dev` | Terminal |
| Access Admin | Double-click logo | Website |
| Test Login | Use new credentials | Login page |

**Credentials updated successfully! 🎉**