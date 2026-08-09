'use client';

import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { db, type AuthUser } from '@/lib/db';
import { useState, useEffect, useRef } from 'react';

interface ConvPartner {
  id: string;
  username: string;
  emoji: string;
  avatar_url: string | null;
}

interface Conversation {
  partnerId: string;
  partner: ConvPartner | null;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showList, setShowList] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { db.auth.getUser().then(setCurrentUser); }, []);

  // Load conversations
  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    fetch(`/api/messages?user_id=${encodeURIComponent(currentUser.id)}`)
      .then(r => r.json())
      .then(data => {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [currentUser?.id]);

  // Load chat when selecting a conversation
  useEffect(() => {
    if (!activeChat || !currentUser?.id) return;
    setChatLoading(true);
    fetch(`/api/messages?user_id=${encodeURIComponent(currentUser.id)}&with=${encodeURIComponent(activeChat)}`)
      .then(r => r.json())
      .then(data => {
        setChatMessages(Array.isArray(data) ? data : []);
        setChatLoading(false);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        // Mark as read
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'read', user_id: currentUser.id, partner_id: activeChat }),
        });
        // Update unread count locally
        setConversations(prev => prev.map(c =>
          c.partnerId === activeChat ? { ...c, unread: 0 } : c
        ));
      });
  }, [activeChat, currentUser?.id]);

  // Open chat
  function openChat(partnerId: string) {
    setActiveChat(partnerId);
    setShowList(false);
  }

  async function handleSend() {
    if (!currentUser || !activeChat || !messageText.trim()) return;
    setSending(true);
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send',
        sender_id: currentUser.id,
        receiver_id: activeChat,
        text: messageText.trim(),
      }),
    });
    const data = await res.json();
    if (data.ok && data.message) {
      setChatMessages(prev => [...prev, data.message]);
      setMessageText('');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      // Refresh conversations
      fetch(`/api/messages?user_id=${encodeURIComponent(currentUser.id)}`)
        .then(r => r.json())
        .then(d => setConversations(Array.isArray(d) ? d : []));
    }
    setSending(false);
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '剛剛';
    if (mins < 60) return `${mins} 分鐘前`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} 小時前`;
    const days = Math.floor(hrs / 24);
    return `${days} 日前`;
  }

  const activeConv = conversations.find(c => c.partnerId === activeChat);

  const layout = (content: React.ReactNode) => (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />
      <div className="flex max-w-[1500px] mx-auto">
        <div className="hidden lg:block"><LeftSidebar /></div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-hearten-bg shadow-xl animate-slide-in overflow-y-auto">
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-hearten-card text-hearten-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <LeftSidebar />
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {content}
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );

  const conversationList = (
    <div className="space-y-1">
      {conversations.map(conv => (
        <button
          key={conv.partnerId}
          onClick={() => openChat(conv.partnerId)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeChat === conv.partnerId ? 'bg-hearten-rose/10 border border-hearten-rose/20' : 'hover:bg-hearten-card border border-transparent'}`}
        >
          <div className="w-10 h-10 rounded-full bg-hearten-rose/20 flex items-center justify-center text-lg shrink-0 overflow-hidden relative">
            {conv.partner?.avatar_url ? (
              <img src={conv.partner.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : conv.partner?.emoji || '👤'}
            {conv.unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-hearten-rose text-white text-[10px] font-bold flex items-center justify-center">{conv.unread > 9 ? '9+' : conv.unread}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-hearten-text truncate">{conv.partner?.username || '未知用戶'}</span>
              <span className="text-xs text-hearten-dim shrink-0 ml-2">{timeAgo(conv.lastTime)}</span>
            </div>
            <p className="text-xs text-hearten-muted truncate mt-0.5">{conv.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const chatView = activeChat && activeConv ? (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-3 border-b border-hearten-border">
        <button onClick={() => { setActiveChat(null); setShowList(true); }}
          className="lg:hidden p-1.5 rounded-lg text-hearten-muted hover:text-hearten-text">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <a href={`/user/${encodeURIComponent(activeConv.partner?.username || '')}`} target="_blank" rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-hearten-rose/20 flex items-center justify-center shrink-0 overflow-hidden">
          {activeConv.partner?.avatar_url ? (
            <img src={activeConv.partner.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : activeConv.partner?.emoji || '👤'}
        </a>
        <span className="font-semibold text-hearten-text">{activeConv.partner?.username || '未知用戶'}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {chatLoading ? (
          <p className="text-center text-hearten-dim py-8">載入中...</p>
        ) : chatMessages.length === 0 ? (
          <p className="text-center text-hearten-muted py-8">未有訊息，發送第一條訊息啦！</p>
        ) : (
          chatMessages.map(msg => {
            const isMine = msg.sender_id === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-hearten-rose text-white rounded-br-md' : 'bg-hearten-card border border-hearten-border text-hearten-text rounded-bl-md'}`}>
                  {msg.body}
                  <div className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-hearten-dim'}`}>
                    {timeAgo(msg.created_at)}
                    {isMine && msg.read && <span className="ml-1">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Send input */}
      <div className="flex gap-2 pt-3 border-t border-hearten-border">
        <input
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="輸入訊息..."
          className="flex-1 bg-hearten-bg border border-hearten-border rounded-xl px-4 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose"
        />
        <button
          onClick={handleSend}
          disabled={sending || !messageText.trim()}
          className="px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : null;

  return layout(
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-hearten-text mb-6">💬 訊息</h1>

      <div className="bg-hearten-card border border-hearten-border rounded-2xl overflow-hidden">
        <div className="flex h-[calc(100vh-250px)] min-h-[500px]">
          {/* Conversation list — hidden on mobile when chat is open */}
          <div className={`${!showList && activeChat ? 'hidden' : ''} lg:block w-full lg:w-80 border-r border-hearten-border overflow-y-auto p-3`}>
            {loading ? (
              <p className="text-center text-hearten-dim py-8 text-sm">載入中...</p>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-10 h-10 mx-auto text-hearten-dim mb-3" />
                <p className="text-hearten-muted text-sm">未有訊息</p>
                <p className="text-hearten-dim text-xs mt-1">去其他會員頁面發送訊息啦！</p>
              </div>
            ) : (
              conversationList
            )}
          </div>

          {/* Chat view */}
          <div className={`${showList ? 'hidden lg:flex' : 'flex'} lg:flex flex-1 flex-col p-4`}>
            {activeChat && activeConv ? chatView : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-hearten-dim mb-3" />
                  <p className="text-hearten-muted">選擇一個對話開始聊天</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
