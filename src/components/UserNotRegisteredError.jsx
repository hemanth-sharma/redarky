import React from 'react';

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf8ff] text-[#131b2e] px-4 antialiased">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#131b2e] mb-3 tracking-tight">Access Restricted</h1>
          <p className="text-sm text-[#434655] leading-relaxed mb-6">
            You are not registered to use this application. Please contact your system administrator to request workspace credentials.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-left text-xs text-[#434655] space-y-2">
            <p className="font-bold text-[#131b2e]">Troubleshooting options:</p>
            <ul className="list-disc list-inside space-y-1.5 opacity-90 pl-1">
              <li>Verify you logged in using the authorized corporate account.</li>
              <li>Contact the project creator to review row registration status.</li>
              <li>Try completely logging out and re-authenticating your profile.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;