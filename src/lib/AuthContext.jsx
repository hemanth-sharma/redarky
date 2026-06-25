import React, { createContext, useState, useContext, useEffect } from 'react';
import { redarky } from '@/api/redarkyClient.js';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

// Pre-populate if not set (so first load is authenticated automatically)
if (localStorage.getItem('redarky_token') === null) {
  localStorage.setItem('redarky_token', 'mock-jwt-token');
  localStorage.setItem('redarky_user', JSON.stringify({
    id: 'mock-user-1',
    email: 'founder@redarky.com',
    name: 'RedArky Founder',
    role: 'admin'
  }));
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // Standard standalone fallback
      setAppPublicSettings({
        id: 'mock-app',
        public_settings: {}
      });
      setIsLoadingPublicSettings(false);

      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error. Falling back to mock user.', error);
      setAppPublicSettings({
        id: 'mock-app',
        public_settings: {}
      });
      setUser({
        id: 'mock-user-1',
        email: 'founder@redarky.com',
        name: 'RedArky Founder'
      });
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      setIsLoadingPublicSettings(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await redarky.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.log('User auth check failed. Redirecting to login.', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    redarky.auth.logout(shouldRedirect ? window.location.href : null);
  };

  const navigateToLogin = () => {
    redarky.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
