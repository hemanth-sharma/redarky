import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] text-[#131b2e] px-4 antialiased">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#004ac6] text-white mb-4 shadow-sm">
            <Icon className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#131b2e] mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-[#434655] opacity-80">{subtitle}</p>}
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
          {children}
        </div>
        
        {footer && (
          <div className="text-center text-xs text-[#434655] font-medium mt-6 transition-colors">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}