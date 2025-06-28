'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { FiTrash2, FiLogOut } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        selectedSubject={selectedSubject}
        onSubjectSelect={setSelectedSubject}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        {/* Header Buttons */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiTrash2 className="mr-2" />
            Clear Chat
          </button>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <FiLogOut className="mr-2" />
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>

        {/* Chat Interface */}
        <ChatInterface
          selectedSubject={selectedSubject}
          isSidebarOpen={isSidebarOpen}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </main>
  );
} 