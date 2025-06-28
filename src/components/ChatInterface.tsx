'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiRefreshCw, FiTrash2, FiCopy } from 'react-icons/fi';
import { PaperAirplaneIcon, ClipboardIcon, ClipboardDocumentCheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { SparklesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Subject = 'Mathematics' | 'Physics' | 'Computer Science';

interface ChatInterfaceProps {
  selectedSubject?: string;
  isSidebarOpen: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

function CodeBlock({ className, children }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const language = className?.replace('language-', '');
  const code = String(children).trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className={`${className} rounded-lg p-4 bg-gray-800 text-white overflow-x-auto`}>
        {language && (
          <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded-bl">
            {language}
          </div>
        )}
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {isCopied ? (
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex space-x-2 items-center p-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
    </div>
  );
}

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.role === 'user';
  const bubbleClass = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-bg-sidebar text-text-primary';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${
        isLast ? 'animate-slide-in' : ''
      }`}
    >
      <div className={`max-w-[80%] rounded-xl p-4 ${bubbleClass}`}>
        {isUser ? (
          message.content
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
}

export default function ChatInterface({ selectedSubject, isSidebarOpen, messages, setMessages }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState<number | null>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Copy message content to clipboard
  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(index);
      setTimeout(() => setIsCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: selectedSubject ? `[${selectedSubject}] ${input}` : input 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending chat request to:', window.location.origin + '/api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        let errorMessage = 'Failed to get response';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.details || `Server error (${response.status})`;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || data.choices?.[0]?.message?.content || 'No response content',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', {
        name: err.name,
        message: err.message,
        cause: err.cause,
        stack: err.stack,
      });

      let errorMessage = 'Failed to get response. Please try again.';
      
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch') {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {selectedSubject ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                {selectedSubject}
              </span>
            ) : (
              'AI Study Assistant'
            )}
          </h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-lg mx-auto p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Welcome to iGebra.ai
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedSubject
                  ? `I'm your personal ${selectedSubject} tutor. Ask me anything about the subject!`
                  : "I'm your AI study companion. Select a subject to get started or ask me anything!"}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                Pro tip: Use Alt + S to toggle sidebar
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in`}
          >
            <div
              className={`relative max-w-[80%] p-4 rounded-2xl backdrop-blur-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50'
              } shadow-lg hover:shadow-xl transition-all duration-200 group`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <button
                onClick={() => copyToClipboard(message.content, index)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Copy message"
              >
                {isCopied === index ? (
                  <span className="text-green-500 text-xs font-medium">Copied!</span>
                ) : (
                  <FiCopy size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mx-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 w-full p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask me anything${selectedSubject ? ` about ${selectedSubject}` : ''}...`}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md transition-shadow duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center transition-all duration-200 ${
                  isLoading || !input.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSend className="w-4 h-4 transform rotate-45" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Keyboard shortcut hint */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> to send
          </span>
        </div>
      </form>
    </div>
  );
} 