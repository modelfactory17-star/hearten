'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, MessageSquare, Heart, FileText, UserPlus } from 'lucide-react';
import { users, posts, getUserByName } from '@/lib/data';
import { db, type AuthUser } from '@/lib/db';
import { useState, useEffect } from 'react';

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const name = decodeURIComponent(params.id as string);
  const user = users.find((u) => u.id === name) || getUserByName(name);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    db.auth.getUser().then(setCurrentUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-hearten-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-hearten-muted text-lg">搵唔到呢位會員 😢</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-hearten-rose text-white text-base"
          >
            返去首頁
          </button>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter((p) => p.anonymous === user.name);

  return (
    <div className="min-h-screen bg-hearten-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-bg/90 backdrop-blur flex items-center px-4 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-hearten-muted hover:text-hearten-text transition-colors text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          返回上頁
        </button>
        <div className="flex-1" />
        <span className="text-base font-medium text-hearten-muted">會員資料</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-hearten-card border border-hearten-border rounded-2xl overflow-hidden">
          {/* Banner area */}
          <div className="h-24 bg-gradient-to-r from-hearten-rose/30 via-hearten-rose/10 to-hearten-card" />

          {/* Avatar */}
          <div className="flex justify-center -mt-10">
            <div className="w-24 h-24 rounded-full bg-hearten-card border-4 border-hearten-card flex items-center justify-center text-5xl shadow-lg">
              {user.emoji}
            </div>
          </div>

          {/* Info */}
          <div className="text-center px-6 pb-6">
            <h1 className="text-2xl font-bold text-hearten-text mt-3">{user.name}</h1>
            <p className="text-base text-hearten-muted mt-1 italic">「{user.bio}」</p>

            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="px-2.5 py-0.5 rounded-full bg-hearten-rose/10 text-hearten-rose text-sm">
                {user.status}
              </span>
              <span className="text-sm text-hearten-dim">
                加入：{user.joined}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 py-5 border-y border-hearten-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-hearten-text">{user.posts_count}</div>
                <div className="text-sm text-hearten-dim mt-0.5">心事</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-hearten-text">{user.comments_count}</div>
                <div className="text-sm text-hearten-dim mt-0.5">留言</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-hearten-muted mb-1">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-hearten-text">{user.hearts_received.toLocaleString()}</div>
                <div className="text-sm text-hearten-dim mt-0.5">獲讚</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  if (!currentUser) {
                    window.dispatchEvent(new Event('hearten:open-login'));
                    return;
                  }
                  setMsgSent(true);
                  setTimeout(() => setMsgSent(false), 2500);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-base transition-colors"
              >
                <Send className="w-5 h-5" />
                {msgSent ? '已發送 ✉️' : currentUser ? '發送訊息' : '登入以發送訊息'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-hearten-border hover:border-hearten-rose text-hearten-text hover:text-hearten-rose font-medium text-base transition-colors">
                <UserPlus className="w-5 h-5" />
                加到好友
              </button>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-bold text-hearten-muted uppercase tracking-wider">
              📝 最近發帖 ({userPosts.length})
            </h2>
            <div className="flex-1 h-px bg-hearten-border" />
          </div>

          {userPosts.length === 0 ? (
            <p className="text-center text-hearten-muted text-base py-6">未有發帖</p>
          ) : (
            <div className="space-y-2">
              {userPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => router.push(`/post/${post.id}`)}
                  className="w-full text-left bg-hearten-card border border-hearten-border rounded-xl p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-xs font-medium">
                      {post.category}
                    </span>
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
    </div>
  );
}
