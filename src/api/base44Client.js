// Clean, standard API utility file that exports basic fetch/axios mock client handlers
// for the future backend data wiring.

// Simple mock user
const MOCK_USER = {
  id: 'mock-user-1',
  email: 'founder@redarky.com',
  name: 'RedArky Founder',
  role: 'admin'
};

// Mock Axios-like client
export const createAxiosClient = (config = {}) => {
  return {
    get: async (url) => {
      console.log(`[Mock API GET] ${config.baseURL || ''}${url}`);
      // Return mock settings if matching public settings path
      if (url.includes('/public-settings/by-id/')) {
        return {
          id: 'mock-app',
          public_settings: {}
        };
      }
      return {};
    },
    post: async (url, data) => {
      console.log(`[Mock API POST] ${config.baseURL || ''}${url}`, data);
      return { data: {} };
    },
    put: async (url, data) => {
      console.log(`[Mock API PUT] ${config.baseURL || ''}${url}`, data);
      return { data: {} };
    },
    delete: async (url) => {
      console.log(`[Mock API DELETE] ${config.baseURL || ''}${url}`);
      return { data: {} };
    }
  };
};

// Mock base44 client to replace SDK client
export const base44 = {
  auth: {
    me: async () => {
      const storedUser = localStorage.getItem('redarky_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      // Return mock user if token exists or if we're in mock mode
      const token = localStorage.getItem('redarky_token');
      if (token) {
        return MOCK_USER;
      }
      throw new Error('Unauthenticated');
    },
    loginViaEmailPassword: async (email, password) => {
      console.log(`[Mock Login] Logging in as ${email}`);
      const user = { ...MOCK_USER, email, name: email.split('@')[0] };
      localStorage.setItem('redarky_user', JSON.stringify(user));
      localStorage.setItem('redarky_token', 'mock-jwt-token');
      return { access_token: 'mock-jwt-token', user };
    },
    loginWithProvider: (provider, redirectUrl) => {
      console.log(`[Mock OAuth] Provider: ${provider}, redirecting...`);
      localStorage.setItem('redarky_user', JSON.stringify(MOCK_USER));
      localStorage.setItem('redarky_token', 'mock-jwt-token');
      window.location.href = redirectUrl || '/';
    },
    register: async ({ email, password }) => {
      console.log(`[Mock Register] Registering ${email}`);
      return { email };
    },
    verifyOtp: async ({ email, otpCode }) => {
      console.log(`[Mock OTP Verification] Verifying OTP ${otpCode} for ${email}`);
      return { access_token: 'mock-jwt-token' };
    },
    resendOtp: async (email) => {
      console.log(`[Mock Resend OTP] Resending to ${email}`);
      return true;
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      console.log(`[Mock Reset Password] Token: ${resetToken}`);
      return true;
    },
    resetPasswordRequest: async (email) => {
      console.log(`[Mock Reset Password Request] Requested for ${email}`);
      return true;
    },
    logout: (redirectUrl) => {
      console.log(`[Mock Logout] Logging out`);
      localStorage.removeItem('redarky_user');
      localStorage.removeItem('redarky_token');
      if (redirectUrl) {
        window.location.href = '/login';
      }
    },
    redirectToLogin: (redirectUrl) => {
      console.log(`[Mock Redirect] Redirecting to login`);
      window.location.href = '/login';
    },
    setToken: (token) => {
      console.log(`[Mock Set Token] Token updated: ${token}`);
      localStorage.setItem('redarky_token', token);
    }
  }
};
