/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, User, MessageSquare, Sparkles, Star, AlertCircle } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  unread: boolean;
  messages: Array<{ sender: 'user' | 'partner'; text: string; time: string }>;
}

export default function ChatInbox() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'aura',
      name: 'Aura Bridal Atelier',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Elite Makeup Stylist',
      lastMessage: 'Hi Pranathi! Your Oct 18 wedding slot is locked.',
      unread: true,
      messages: [
        { sender: 'partner', text: 'Namaste Pranathi! Thank you for reserving Aura Bridal Atelier.', time: '09:00 AM' },
        { sender: 'user', text: 'Hi Aura team, I want to clarify if the Nizam Traditional Telugu look package includes Poola Jada hair flower arrangement?', time: '09:12 AM' },
        { sender: 'partner', text: 'Yes, absolutely! The Ultra Premium package includes fresh Jasmine Poola Jada floral weaving as standard. Do you have reference pictures?', time: '09:15 AM' },
        { sender: 'user', text: 'Perfect. I will upload my moodboard designs soon.', time: '09:18 AM' },
        { sender: 'partner', text: 'Excellent. Looking forward to our trial consultation session next week.', time: '09:20 AM' }
      ]
    },
    {
      id: 'concierge',
      name: 'VowGlow Elite Concierge',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      role: 'Atelier AI Concierge Support',
      lastMessage: 'Your custom budget optimization is complete.',
      unread: false,
      messages: [
        { sender: 'partner', text: 'Welcome to VowGlow VIP Concierge service. How can I facilitate your styling preparation plans today?', time: '08:00 AM' }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState('aura');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat.messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages local state
    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: inputText,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setChats(updatedChats);
    const sentText = inputText;
    setInputText('');

    // Trigger Simulated Response 2 seconds later
    setTimeout(() => {
      let automatedResponse = '';
      if (activeChatId === 'aura') {
        automatedResponse = `Hi Pranathi, I have received your message: "${sentText}". Our styling director is reviewing this and will contact you directly. We are so excited to style your Telugu look! 💍✨`;
      } else {
        automatedResponse = `VowGlow Concierge received: "${sentText}". We are checking coordinates with your artist and will dispatch updates to your registered inbox.`;
      }

      const partnerResponse = {
        sender: 'partner' as const,
        text: automatedResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: automatedResponse,
            unread: false,
            messages: [...c.messages, partnerResponse]
          };
        }
        return c;
      }));
    }, 2000);
  };

  return (
    <div id="chat-inbox-container" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Atelier Secure Communications</span>
        <h2 className="text-3xl font-serif text-slate-900 font-medium">Bridal Message Center</h2>
        <p className="text-xs text-slate-500">Secure end-to-end encrypted chats with your booked Hyderabad stylists and VowGlow Elite Concierge.</p>
      </div>

      <div className="bg-white border border-amber-200/40 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* CHATS SIDEBAR (4 COLUMNS) */}
        <div className="md:col-span-4 border-r border-slate-100 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {chats.map((chat) => {
              const active = chat.id === activeChatId;
              return (
                <div
                  id={`chat-item-sidebar-${chat.id}`}
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    // Mark as read
                    setChats(chats.map(c => c.id === chat.id ? { ...c, unread: false } : c));
                  }}
                  className={`p-4 flex gap-3 items-start cursor-pointer transition-all ${
                    active ? 'bg-white border-l-4 border-amber-800' : 'hover:bg-slate-100/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-200 flex-shrink-0 relative">
                    <img src={chat.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    {chat.unread && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{chat.name}</h4>
                      <span className="text-[9px] font-mono text-slate-400">Live</span>
                    </div>
                    <p className="text-[10px] text-amber-800 font-mono tracking-wider">{chat.role}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-tight">{chat.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHAT WINDOW (8 COLUMNS) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          
          {/* Active Partner Info header */}
          <div className="p-4 border-b flex items-center justify-between bg-[#FAF9F6] border-amber-200/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-300">
                <img src={activeChat.avatar} className="w-full h-full object-cover" alt="Active avatar" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-slate-900">{activeChat.name}</h3>
                <p className="text-[10px] text-amber-800 font-semibold uppercase font-mono">{activeChat.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold border border-emerald-100">
                🟢 Online
              </span>
            </div>
          </div>

          {/* MESSAGES SCROLL FEED */}
          <div
            id="chat-message-feed"
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px]"
          >
            {activeChat.messages.map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
                    isUser 
                      ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-tr-none shadow' 
                      : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className={`block text-[9px] font-mono mt-1 text-right ${isUser ? 'text-amber-200/80' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT FORM ROW */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-[#FAF9F6] flex gap-3 items-center">
            <input
              type="text"
              required
              placeholder={`Write secure message to ${activeChat.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 outline-none text-xs bg-white"
            />
            <button
              id="chat-send-btn"
              type="submit"
              className="p-3 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl hover:brightness-110 active:scale-95 transition-all shadow shadow-amber-900/10 flex items-center justify-center"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
