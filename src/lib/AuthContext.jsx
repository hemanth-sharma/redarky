import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

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

      if (!appParams.appId) {
        console.log('No App ID configured. Falling back to mock user for visual prototype.');
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
        return;
      }
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed. Falling back to mock settings and mock user.', appError);
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
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed. Falling back to mock user.', error);
      setUser({
        id: 'mock-user-1',
        email: 'founder@redarky.com',
        name: 'RedArky Founder'
      });
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
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
