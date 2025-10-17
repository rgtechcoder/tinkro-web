// Simple Test AuthService - Clean localStorage only
class SimpleAuthService {
  constructor() {
    this.currentUser = null;
    console.log('SimpleAuthService initialized');
  }

  // Simple Email Signup
  async signUpWithEmail(email, password, displayName) {
    try {
      console.log('Signup attempt:', { email, displayName });
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      
      // Check if user exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered!'
        };
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email: email,
        name: displayName,
        password: btoa(password), // Simple encoding
        createdAt: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem('tinkro_users', JSON.stringify(users));
      
      // Set current user (without password)
      const userData = { ...newUser };
      delete userData.password;
      this.currentUser = userData;
      localStorage.setItem('tinkro_current_user', JSON.stringify(userData));
      
      console.log('User created:', userData);
      
      return {
        success: true,
        user: userData,
        message: 'Account created successfully!'
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Failed to create account. Please try again.'
      };
    }
  }
  
  // Simple Email Login
  async signInWithEmail(email, password) {
    try {
      console.log('Login attempt:', email);
      
      const users = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      const user = users.find(u => u.email === email && u.password === btoa(password));
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password!'
        };
      }
      
      // Set current user (without password)
      const userData = { ...user };
      delete userData.password;
      this.currentUser = userData;
      localStorage.setItem('tinkro_current_user', JSON.stringify(userData));
      
      return {
        success: true,
        user: userData,
        message: 'Login successful!'
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  // Mobile Number Login
  async signInWithPhone(phoneNumber, recaptchaVerifier) {
    try {
      console.log('Mobile login attempt:', phoneNumber);
      
      // For testing - simple localStorage check
      const users = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      
      // Add +91 prefix if not present
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      
      // Check if user exists with this phone number
      let user = users.find(u => u.phoneNumber === formattedPhone);
      
      // If user doesn't exist, create a new one
      if (!user) {
        const newUser = {
          id: Date.now(),
          phoneNumber: formattedPhone,
          name: `User ${phoneNumber.slice(-4)}`,
          createdAt: new Date().toISOString(),
          verified: true
        };
        
        users.push(newUser);
        localStorage.setItem('tinkro_users', JSON.stringify(users));
        user = newUser;
      }
      
      // Set current user
      this.currentUser = user;
      localStorage.setItem('tinkro_current_user', JSON.stringify(user));
      
      // Simulate OTP verification for demo
      return {
        success: true,
        user: user,
        message: 'Login successful!',
        confirmationResult: {
          confirm: async (otp) => {
            // For demo, any OTP works
            if (otp.length === 6) {
              return {
                user: user
              };
            } else {
              throw new Error('Invalid OTP');
            }
          }
        }
      };
      
    } catch (error) {
      console.error('Mobile login error:', error);
      return {
        success: false,
        message: 'Mobile login failed. Please try again.'
      };
    }
  }

  // Check if user is admin
  isAdmin() {
    if (!this.currentUser) return false;
    const adminEmails = ['admin@tinkro.com', 'rgtechcoder@gmail.com'];
    return adminEmails.includes(this.currentUser.email);
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Logout function
  logout() {
    this.currentUser = null;
    localStorage.removeItem('tinkro_current_user');
    return { success: true };
  }
}

const simpleAuthService = new SimpleAuthService();
export default simpleAuthService;