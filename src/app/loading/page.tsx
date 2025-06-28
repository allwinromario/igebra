'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0F1C]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark theme background elements */}
        <div className="absolute w-[800px] h-[800px] -top-[400px] -left-[400px] bg-blue-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[400px] bg-purple-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-[600px] h-[600px] top-[40%] left-[30%] bg-cyan-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1C]/50 to-[#0A0F1C]"
          style={{
            backgroundImage: `linear-gradient(to right, #1a237e10 1px, transparent 1px),
                             linear-gradient(to bottom, #1a237e10 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-40 h-40 relative mb-8">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl transform scale-150"></div>
          
          {/* Inner container */}
          <div className="relative h-full w-full bg-gradient-to-br from-[#1a237e]/10 to-[#0d47a1]/5 rounded-full p-4 backdrop-blur-lg border border-white/5 shadow-2xl">
            {/* Spinner */}
            <svg
              className="w-full h-full text-blue-400 animate-spin-slow"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-10"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-70"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
        
        {/* Text content */}
        <div className="text-center mb-12 relative">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 mb-3 tracking-tight">
            iGebra.ai
          </h1>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-3"></div>
          <p className="text-blue-200/60 text-lg font-light">
            Your AI Study Companion
          </p>
        </div>
        
        {/* Progress bar container */}
        <div className="relative w-80">
          <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-md transform scale-105"></div>
          <div className="relative bg-white/5 h-2 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status text */}
        <p className="text-blue-200/40 mt-4 text-sm font-light tracking-wider">
          {progress < 100 ? (
            <span className="animate-pulse">Preparing your workspace...</span>
          ) : (
            <span className="animate-fade-in">Ready to begin!</span>
          )}
        </p>
      </div>
    </div>
  );
} 