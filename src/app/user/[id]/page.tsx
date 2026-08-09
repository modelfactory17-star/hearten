'use client';

import { useParams, useRouter } from 'next/navigation';
import { Send, MessageSquare, Heart, FileText, UserPlus, LogOut, Settings, X, Check, Camera, UserCheck, Clock } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { db, type AuthUser, type Post, type FriendStatus } from '@/lib/db';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect, useRef } from 'react';

interface ProfileData {
  id: string;
  username: string;
  emoji: string;
  avatar_url: string | null;
  bio: string;
  status: string;
  joined: string;
  posts_count: number;
  hearts_received: number;
}

const EMOJIS = ['🐱','🐶','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦄','🐙','🦋','🌺','🐳','🐬','🦉','🦩','🐉'];
const STATUSES = ['', '單身', '戀愛中', '已婚', '一言難盡'];

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const name = decodeURIComponent(params.id as string);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOwnProfile = currentUser?.username === name;

  // DM state
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  // Friend state
  const [friendStatus, setFriendStatus] = useState<FriendStatus>('none');
  const [friendLoading, setFriendLoading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editEmoji, setEditEmoji] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function openEdit() {
    setEditEmoji(profile?.emoji || '🐱');
    setEditBio(profile?.bio || '');
    setEditStatus(profile?.status || '');
    setShowEdit(true);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    const result = await db.auth.updateProfile(profile.id, {
      emoji: editEmoji,
      bio: editBio,
      status: editStatus,
    });
    if (result.ok) {
      setProfile({ ...profile, emoji: editEmoji, bio: editBio, status: editStatus });
      setShowEdit(false);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await db.auth.logout();
    window.location.href = '/';
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('只支援圖片格式（JPG、PNG、WebP）');
      return;
    }
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('圖片太大，上限 2MB');
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const path = `${profile.id}/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await db.auth.updateProfile(profile.id, { avatar_url: publicUrl });
      setProfile({ ...profile, avatar_url: publicUrl });
    } else {
      setUploadError('上傳失敗，請再試一次');
    }
    setUploading(false);
  }

  // ─── DM ───
  async function handleSendMessage() {
    if (!currentUser || !profile || !messageText.trim()) return;
    setSendingMsg(true);
    const ok = await db.messages.send(currentUser.id, profile.id, messageText.trim());
    if (ok) {
      setMessageText('');
      setMsgSent(true);
      setTimeout(() => setMsgSent(false), 2500);
      setShowMessageInput(false);
    }
    setSendingMsg(false);
  }

  // ─── Friend ───
  async function handleFriendAction() {
    if (!currentUser || !profile || friendLoading) return;
    if (!currentUser.id) {
      window.dispatchEvent(new Event('hearten:open-login'));
      return;
    }
    setFriendLoading(true);
    if (friendStatus === 'none') {
      const ok = await db.friendships.request(currentUser.id, profile.id);
      if (ok) setFriendStatus('pending_sent');
    }
    // accepted/rejected states are handled by the other user
    setFriendLoading(false);
  }

  async function handleAcceptFriend() {
    if (!currentUser || !profile || friendLoading) return;
    setFriendLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('friendships').select('id')
      .eq('requester_id', profile.id).eq('addressee_id', currentUser.id).eq('status', 'pending').maybeSingle();
    if (data) {
      await db.friendships.respond(data.id, 'accepted');
      setFriendStatus('accepted');
    }
    setFriendLoading(false);
  }

  useEffect(() => { db.auth.getUser().then(setCurrentUser); }, []);
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile?username=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (data && data.profile) {
          setProfile(data.profile as ProfileData);
          setUserPosts(Array.isArray(data.posts) ? data.posts : []);
        } else {
          setProfile(null);
          setUserPosts([]);
        }
      } catch {
        setProfile(null);
        setUserPosts([]);
      }
      setLoading(false);
    }
    load();
  }, [name]);

  // Load friendship status
  useEffect(() => {
    if (!currentUser || !profile || isOwnProfile) return;
    db.friendships.getStatus(currentUser.id, profile.id).then(setFriendStatus);
  }, [currentUser, profile, isOwnProfile]);

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

  if (loading) {
    return layout(<div className="flex items-center justify-center h-64"><p className="text-hearten-muted text-lg">載入中...</p></div>);
  }

  if (!profile) {
    return layout(
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <p className="text-hearten-muted text-lg">搵唔到呢位會員 😢</p>
          <button onClick={() => router.push('/')} className="px-4 py-2 rounded-lg bg-hearten-rose text-white text-base">返去首頁</button>
        </div>
      </div>
    );
  }

  const friendButton = () => {
    if (!currentUser) {
      return (
        <button onClick={() => window.dispatchEvent(new Event('hearten:open-login'))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-hearten-border hover:border-hearten-rose text-hearten-text hover:text-hearten-rose font-medium text-base transition-colors">
          <UserPlus className="w-5 h-5" />加到好友
        </button>
      );
    }

    switch (friendStatus) {
      case 'none':
        return (
          <button onClick={handleFriendAction} disabled={friendLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-hearten-border hover:border-hearten-rose text-hearten-text hover:text-hearten-rose font-medium text-base transition-colors">
            <UserPlus className="w-5 h-5" />{friendLoading ? '處理中...' : '加到好友'}
          </button>
        );
      case 'pending_sent':
        return (
          <button disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 font-medium text-base">
            <Clock className="w-5 h-5" />已發送好友請求
          </button>
        );
      case 'pending_received':
        return (
          <button onClick={handleAcceptFriend} disabled={friendLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base transition-colors">
            <UserCheck className="w-5 h-5" />{friendLoading ? '處理中...' : '接受好友請求'}
          </button>
        );
      case 'accepted':
        return (
          <button disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-medium text-base">
            <UserCheck className="w-5 h-5" />已成為好友
          </button>
        );
    }
  };

  return layout(
    <>
      <div className="max-w-xl mx-auto">
        {/* Profile Card */}
        <div className="bg-hearten-card border border-hearten-border rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-hearten-rose/30 via-hearten-rose/10 to-hearten-card" />
          <div className="flex justify-center -mt-10">
            <div className="w-24 h-24 rounded-full bg-hearten-card border-4 border-hearten-card flex items-center justify-center text-5xl shadow-lg overflow-hidden relative group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : profile.emoji}
              {isOwnProfile && (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
            {isOwnProfile && <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />}
          </div>
          {uploadError && <p className="text-sm text-red-400 mt-2 text-center">{uploadError}</p>}

          <div className="text-center px-6 pb-6">
            <h1 className="text-2xl font-bold text-hearten-text mt-3">{profile.username}</h1>
            {profile.bio ? (
              <p className="text-base text-hearten-muted mt-1 italic">「{profile.bio}」</p>
            ) : (
              <p className="text-base text-hearten-dim mt-1 italic">尚未填寫個人簡介</p>
            )}
            <div className="flex items-center justify-center gap-3 mt-3">
              {profile.status && <span className="px-2.5 py-0.5 rounded-full bg-hearten-rose/10 text-hearten-rose text-sm">{profile.status}</span>}
              <span className="text-sm text-hearten-dim">加入：{profile.joined}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 py-5 border-y border-hearten-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1"><FileText className="w-5 h-5" /></div>
                <div className="text-3xl font-bold text-hearten-text">{profile.posts_count || 0}</div>
                <div className="text-sm text-hearten-dim mt-0.5">心事</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1"><MessageSquare className="w-5 h-5" /></div>
                <div className="text-3xl font-bold text-hearten-text">0</div>
                <div className="text-sm text-hearten-dim mt-0.5">留言</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1"><Heart className="w-5 h-5" /></div>
                <div className="text-3xl font-bold text-hearten-text">{(profile.hearts_received || 0).toLocaleString()}</div>
                <div className="text-sm text-hearten-dim mt-0.5">獲讚</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5">
              {isOwnProfile ? (
                <>
                  <button onClick={openEdit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-hearten-border hover:border-hearten-rose text-hearten-text hover:text-hearten-rose font-medium text-base transition-colors">
                    <Settings className="w-5 h-5" />編輯資料
                  </button>
                  <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-base transition-colors">
                    <LogOut className="w-5 h-5" />登出
                  </button>
                </>
              ) : (
                <>
                  {/* Message button */}
                  {!currentUser ? (
                    <button onClick={() => window.dispatchEvent(new Event('hearten:open-login'))}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-base transition-colors">
                      <Send className="w-5 h-5" />登入以發送訊息
                    </button>
                  ) : msgSent ? (
                    <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium text-base">
                      <Check className="w-5 h-5" />已發送 ✉️
                    </button>
                  ) : (
                    <button onClick={() => setShowMessageInput(v => !v)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-base transition-colors">
                      <Send className="w-5 h-5" />發送訊息
                    </button>
                  )}
                  {/* Friend button */}
                  {friendButton()}
                </>
              )}
            </div>

            {/* Inline Message Input */}
            {showMessageInput && currentUser && (
              <div className="mt-4 flex gap-2">
                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="輸入訊息..."
                  autoFocus
                  className="flex-1 bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMsg || !messageText.trim()}
                  className="px-4 py-2 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-medium transition-colors disabled:opacity-40"
                >
                  {sendingMsg ? '...' : '發送'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-bold text-hearten-muted uppercase tracking-wider">📝 最近發帖 ({userPosts.length})</h2>
            <div className="flex-1 h-px bg-hearten-border" />
          </div>
          {userPosts.length === 0 ? (
            <p className="text-center text-hearten-muted text-base py-6">未有發帖</p>
          ) : (
            <div className="space-y-2">
              {userPosts.map((post) => (
                <button key={post.id} onClick={() => router.push(`/post/${post.slug}`)} className="w-full text-left bg-hearten-card border border-hearten-border rounded-xl p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-xs font-medium">{post.category}</span>
                    <span className="text-sm text-hearten-muted">{post.time}</span>
                  </div>
                  <h3 className="text-base font-semibold text-hearten-text">{post.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-hearten-dim">
                    <span>❤️ {post.hearts}</span>
                    <span>💬 {post.replies}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowEdit(false)} />
          <div className="relative bg-hearten-card border border-hearten-border rounded-2xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-hearten-text">編輯資料</h2>
              <button onClick={() => setShowEdit(false)} className="p-1 rounded-lg text-hearten-muted hover:text-hearten-text"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-hearten-text mb-2">頭像</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEditEmoji(e)} className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${editEmoji === e ? 'bg-hearten-rose/20 ring-2 ring-hearten-rose scale-110' : 'bg-hearten-bg hover:bg-hearten-rose/10'}`}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-hearten-text mb-2">個人簡介</label>
              <textarea value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={80} rows={2} placeholder="介紹一下自己..."
                className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose resize-none" />
              <p className="text-xs text-hearten-dim mt-1 text-right">{editBio.length}/80</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-hearten-text mb-2">感情狀態</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setEditStatus(s)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${editStatus === s ? 'bg-hearten-rose text-white' : 'bg-hearten-bg text-hearten-muted hover:bg-hearten-rose/10 hover:text-hearten-text'}`}>{s || '唔想講'}</button>
                ))}
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-base transition-colors disabled:opacity-50">
              <Check className="w-5 h-5" />{saving ? '儲存中...' : '儲存'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
