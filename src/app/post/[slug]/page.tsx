'use client';

import { useParams, useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, ArrowLeft, Flag, Eye, EyeOff, Bookmark } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { db, type AuthUser } from '@/lib/db';
import type { Post, Comment } from '@/lib/db';
import { useState, useCallback, useEffect } from 'react';

const MOODS = [
  { emoji: '😊', label: '支持', key: 'support' },
  { emoji: '😢', label: '傷心', key: 'sad' },
  { emoji: '😡', label: '嬲', key: 'angry' },
  { emoji: '🐷', label: '豬豬', key: 'pig' },
];

const COMMENT_EMOJIS = [
  '😊', '😂', '❤️', '😢', '😡', '👍', '🤔', '😍',
  '🙏', '💪', '🔥', '🥺', '🤗', '😭', '😤', '💔',
  '🎉', '😅', '🤯', '😴', '🥰', '😎', '🙄', '😱',
];

type FontSize = 'small' | 'medium' | 'large';
const FONT_SIZES: { key: FontSize; label: string; className: string }[] = [
  { key: 'small', label: '小', className: 'text-[14px]' },
  { key: 'medium', label: '中', className: 'text-[16px]' },
  { key: 'large', label: '大', className: 'text-[18px]' },
];

function buildTree(staticComments: Comment[], userComments: Comment[]): Comment[] {
  const userByParent: Record<string, Comment[]> = {};
  const topLevel: Comment[] = [];
  for (const uc of userComments) {
    if (uc.parentId) (userByParent[uc.parentId] ??= []).push(uc);
    else topLevel.push(uc);
  }
  function attach(c: Comment): Comment {
    const kids = userByParent[c.id] ?? [];
    return { ...c, replies: [...c.replies.map(attach), ...kids] };
  }
  return [...topLevel, ...staticComments.map(attach)];
}

async function sharePost(title: string) {
  const url = window.location.href;
  if (navigator.share) {
    try { await navigator.share({ title, url }); } catch {}
  } else {
    try { await navigator.clipboard.writeText(url); alert('連結已複製！'); } catch {}
  }
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  const [post, setPost] = useState<Post | null>(null);
  const [postId, setPostId] = useState<string>(''); // resolved UUID from slug
  const [heartCount, setHeartCount] = useState(0);
  const [hearted, setHearted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({ support: 0, sad: 0, angry: 0, pig: 0 });
  const [userMoods, setUserMoods] = useState<string[]>([]);
  const [authorOnly, setAuthorOnly] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tree = buildTree([], userComments);
  const displayedComments = authorOnly ? tree.filter(c => c.isOP) : tree;
  const commentCount = userComments.length;
  const bodyClass = FONT_SIZES.find(f => f.key === fontSize)?.className ?? 'text-[16px]';

  const refreshComments = useCallback(async () => {
    const res = await fetch(`/api/comments?post_id=${encodeURIComponent(postId)}`);
    const comments = await res.json();
    setUserComments(Array.isArray(comments) ? comments : []);
  }, [postId]);

  useEffect(() => {
    // Resolve post from slug first, then load all post-dependent data
    db.posts.getBySlug(slug).then(p => {
      if (!p) return;
      setPost(p);
      const id = p.id;
      setPostId(id);

      // Post queries (no user needed)
      db.likes.count('post', id).then(setHeartCount);
      db.moods.countByPost(id).then(setMoodCounts);
      fetch(`/api/comments?post_id=${encodeURIComponent(id)}`)
        .then(r => r.json())
        .then(c => setUserComments(Array.isArray(c) ? c : []));

      // User-dependent queries
      db.auth.getUser().then(u => {
        setUser(u);
        if (u) {
          db.likes.isLiked(u.id, 'post', id).then(setHearted);
          db.moods.getUserMoods(u.id, id).then(setUserMoods);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!user) { setBookmarked(false); return; }
    db.bookmarks.isBookmarked(user.id, postId).then(setBookmarked);
  }, [user, postId]);

  const handleHeartPost = async () => {
    if (!user) { window.dispatchEvent(new Event('hearten:open-login')); return; }
    const now = await db.likes.toggle(user.id, 'post', postId);
    setHearted(now);
    setHeartCount(c => now ? c + 1 : c - 1);
  };

  const handleSubmitComment = async () => {
    if (!replyText.trim() || !user) return;
    const c = await db.comments.create(user.id, postId, replyText);
    if (c) { setReplyText(''); refreshComments(); }
  };

  const handleBookmark = async () => {
    if (!user) { window.dispatchEvent(new Event('hearten:open-login')); return; }
    const now = await db.bookmarks.toggle(user.id, postId);
    setBookmarked(now);
  };

  const handleShare = async () => {
    await sharePost(post?.title ?? '');
    setShareDone(true);
    setTimeout(() => setShareDone(false), 2000);
  };

  return (
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
          {!post ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-3">
                <p className="text-hearten-muted text-lg">搵唔到呢篇心事 😢</p>
                <button onClick={() => router.push('/')} className="px-4 py-2 rounded-lg bg-hearten-rose text-white text-sm">返去首頁</button>
              </div>
            </div>
          ) : (
            <>
              {/* Back nav */}
              <button onClick={() => router.push('/')} className="flex items-center gap-1 text-hearten-muted hover:text-hearten-text transition-colors text-sm mb-4">
                <ArrowLeft className="w-4 h-4" />返回上頁
              </button>

              <article className="bg-hearten-card border border-hearten-border rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-hearten-rose/20 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {post.avatar_url ? (
                        <img src={post.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : post.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span onClick={() => router.push(`/user/${encodeURIComponent(post.anonymous)}`)}
                          className="font-medium text-hearten-text text-sm hover:text-hearten-rose cursor-pointer transition-colors">{post.anonymous}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-[10px] font-medium">{post.category}</span>
                      </div>
                      <span className="text-xs text-hearten-muted">{post.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-hearten-border overflow-hidden">
                      {FONT_SIZES.map(f => (
                        <button key={f.key} onClick={() => setFontSize(f.key)}
                          className={`px-2 py-1 text-xs transition-colors ${fontSize === f.key ? 'bg-hearten-rose text-white' : 'text-hearten-muted hover:text-hearten-text hover:bg-hearten-card'}`}>{f.label}</button>
                      ))}
                    </div>
                    <button onClick={() => setAuthorOnly(!authorOnly)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${authorOnly ? 'bg-hearten-amber/20 text-hearten-amber' : 'text-hearten-muted hover:text-hearten-text hover:bg-hearten-card'}`}>
                      {authorOnly ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}只看該作者
                    </button>
                  </div>
                </div>

                <h1 className="text-xl font-bold text-hearten-text mb-4">{post.title}</h1>

                {/* Image gallery */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {post.images.map((url, i) => (
                      <div key={i}
                        className="rounded-xl overflow-hidden border border-hearten-border">
                        <img src={url} alt="" className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Body with video embeds */}
                <BodyWithEmbeds body={post.body} bodyClass={bodyClass} />

                <div className="flex items-center gap-5 pt-4 border-t border-hearten-border flex-wrap">
                  <button onClick={handleHeartPost}
                    className={`flex items-center gap-1.5 transition-colors text-sm ${hearted ? 'text-hearten-rose' : 'text-hearten-muted hover:text-hearten-rose'}`}>
                    <Heart className={`w-4 h-4 ${hearted ? 'fill-current' : ''}`} /><span>{heartCount}</span>
                  </button>
                  {MOODS.map(m => (
                    <button key={m.emoji}
                      onClick={async () => {
                        if (!user) { window.dispatchEvent(new Event('hearten:open-login')); return; }
                        const now = await db.moods.toggle(user.id, postId, m.key);
                        setUserMoods(prev => now ? [...prev, m.key] : prev.filter(k => k !== m.key));
                        setMoodCounts(prev => ({ ...prev, [m.key]: prev[m.key] + (now ? 1 : -1) }));
                      }}
                      className={`text-lg transition-all flex items-center gap-0.5 ${
                        userMoods.includes(m.key)
                          ? 'scale-110'
                          : 'opacity-50 hover:opacity-100 hover:scale-110'
                      }`}>
                      {m.emoji}
                      {moodCounts[m.key] > 0 && (
                        <span className="text-xs text-hearten-dim ml-0.5">{moodCounts[m.key]}</span>
                      )}
                    </button>
                  ))}
                  <button className="flex items-center gap-1.5 text-hearten-muted hover:text-blue-400 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" /><span>{commentCount} 則留言</span>
                  </button>
                  <button onClick={handleBookmark}
                    className={`flex items-center gap-1.5 transition-colors text-sm ${bookmarked ? 'text-hearten-amber' : 'text-hearten-muted hover:text-hearten-amber'}`}>
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare}
                    className={`flex items-center gap-1.5 transition-colors text-sm ml-auto ${shareDone ? 'text-green-400' : 'text-hearten-muted hover:text-green-400'}`}>
                    <Share2 className="w-4 h-4" />{shareDone ? '已複製' : '分享'}
                  </button>
                </div>
              </article>

              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-bold text-hearten-muted uppercase tracking-wider">
                  💬 留言 ({displayedComments.length}{authorOnly ? ' · 只看該作者' : ''})
                </h2>
                <div className="flex-1 h-px bg-hearten-border" />
              </div>

              <div className="space-y-0 mb-4">
                {displayedComments.length === 0 ? (
                  <p className="text-center text-hearten-muted text-sm py-8">
                    {authorOnly ? '該作者未有留言' : '仲未有留言。做第一個留言嘅人？ 💭'}
                  </p>
                ) : (
                  displayedComments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} postId={postId} onCommentAdded={refreshComments} />
                  ))
                )}
              </div>

              {user ? (
                <div className="bg-hearten-card border border-hearten-border rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-hearten-rose/20 flex items-center justify-center text-sm shrink-0 overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : user.emoji}
                    </div>
                    <span className="text-sm font-medium text-hearten-text">{user.username}</span>
                  </div>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="分享你嘅諗法..." rows={3}
                    className="w-full bg-hearten-bg border border-hearten-border rounded-lg p-3 text-sm text-hearten-text placeholder-hearten-muted outline-none resize-none focus:border-hearten-rose transition-colors" />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {COMMENT_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => setReplyText(prev => prev + emoji)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-hearten-bg text-sm transition-colors"
                          title={emoji}>{emoji}</button>
                      ))}
                    </div>
                    <button onClick={handleSubmitComment} disabled={!replyText.trim()}
                      className="px-4 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">留言</button>
                  </div>
                </div>
              ) : (
                <div className="bg-hearten-card border border-hearten-border rounded-xl p-6 mb-4 text-center">
                  <p className="text-hearten-muted text-sm mb-3">請先登入以留言 💬</p>
                  <button onClick={() => window.dispatchEvent(new Event('hearten:open-login'))}
                    className="px-4 py-2 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-medium transition-colors">登入 / 註冊</button>
                </div>
              )}
            </>
          )}
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}

function CommentItem({ comment, postId, onCommentAdded, depth = 0 }: {
  comment: Comment; postId: string; onCommentAdded: () => void; depth?: number;
}) {
  const router = useRouter();
  const [cHearted, setCHearted] = useState(false);
  const [cHeartCount, setCHeartCount] = useState(comment.hearts);
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    db.auth.getUser().then(u => {
      setUser(u);
      if (u) db.likes.isLiked(u.id, 'comment', comment.id).then(setCHearted);
    });
    db.likes.count('comment', comment.id).then(setCHeartCount);
  }, [comment.id]);

  const handleHeartComment = async () => {
    if (!user) { window.dispatchEvent(new Event('hearten:open-login')); return; }
    const now = await db.likes.toggle(user.id, 'comment', comment.id);
    setCHearted(now);
    setCHeartCount(c => now ? c + 1 : c - 1);
  };

  const handleReply = async () => {
    if (!replyInput.trim() || !user) return;
    const c = await db.comments.create(user.id, postId, replyInput, comment.id);
    if (c) { setReplyInput(''); setShowReply(false); onCommentAdded(); }
  };

  return (
    <div className={depth > 0 ? 'ml-10 border-l-2 border-hearten-border pl-4' : ''}>
      <div className={`bg-hearten-card border border-hearten-border rounded-xl p-4 ${depth > 0 ? '' : 'mb-0'} mb-3`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-hearten-rose/20 flex items-center justify-center text-sm shrink-0 overflow-hidden">
            {comment.avatar_url ? (
              <img src={comment.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : comment.emoji}
          </div>
          <span onClick={() => router.push(`/user/${encodeURIComponent(comment.anonymous)}`)}
            className="text-sm font-medium text-hearten-text hover:text-hearten-rose cursor-pointer transition-colors">{comment.anonymous}</span>
          {comment.isOP && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-hearten-amber/20 text-hearten-amber">樓主</span>}
          <span className="text-xs text-hearten-muted">{comment.time}</span>
          <button className="ml-auto text-hearten-muted hover:text-hearten-text"><Flag className="w-3.5 h-3.5" /></button>
        </div>
        <p className="text-[15px] text-hearten-muted leading-relaxed mb-3">{comment.body}</p>
        <div className="flex items-center gap-4">
          <button onClick={handleHeartComment}
            className={`flex items-center gap-1 text-xs transition-colors ${cHearted ? 'text-hearten-rose' : 'text-hearten-muted hover:text-hearten-rose'}`}>
            <Heart className={`w-3 h-3 ${cHearted ? 'fill-current' : ''}`} />{cHeartCount > 0 && <span>{cHeartCount}</span>}
          </button>
          {user && (
            <button onClick={() => setShowReply(!showReply)}
              className="text-xs text-hearten-muted hover:text-blue-400 transition-colors">回覆</button>
          )}
        </div>
        {showReply && user && (
          <div className="mt-3">
            <div className="flex gap-2 mb-2">
              <input value={replyInput} onChange={e => setReplyInput(e.target.value)} placeholder="寫回覆..."
                className="flex-1 bg-hearten-bg border border-hearten-border rounded-lg px-3 py-1.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors" />
              <button onClick={handleReply} disabled={!replyInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white text-xs font-medium transition-colors">回覆</button>
            </div>
            <div className="flex items-center gap-1">
              {['😊','😂','❤️','😢','😡','👍','🤔','😍'].map(emoji => (
                <button key={emoji} onClick={() => setReplyInput(prev => prev + emoji)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-hearten-bg text-sm transition-colors">{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      {comment.replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} depth={depth + 1} />
      ))}
    </div>
  );
}

// ─── Body renderer with YouTube/Vimeo embeds ───────────────

function BodyWithEmbeds({ body, bodyClass }: { body: string; bodyClass: string }) {
  const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+))(?:[&\w.=/%~?-]*)?/g;
  const vimeoRegex = /(https?:\/\/(?:www\.)?vimeo\.com\/(\d+))/g;

  const parts: { type: 'text' | 'youtube' | 'vimeo'; content: string }[] = [];
  let lastIndex = 0;
  const allMatches: { index: number; end: number; type: 'youtube' | 'vimeo'; id: string }[] = [];

  let m: RegExpExecArray | null;
  while ((m = ytRegex.exec(body)) !== null) {
    allMatches.push({ index: m.index, end: m.index + m[0].length, type: 'youtube', id: m[2] });
  }
  while ((m = vimeoRegex.exec(body)) !== null) {
    allMatches.push({ index: m.index, end: m.index + m[0].length, type: 'vimeo', id: m[2] });
  }
  allMatches.sort((a, b) => a.index - b.index);

  for (const match of allMatches) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: body.slice(lastIndex, match.index) });
    }
    parts.push({ type: match.type, content: match.id });
    lastIndex = match.end;
  }
  if (lastIndex < body.length) {
    parts.push({ type: 'text', content: body.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <div className={`text-hearten-muted leading-relaxed whitespace-pre-line mb-6 ${bodyClass}`}>{body}</div>;
  }

  return (
    <div className="mb-6">
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <div key={i} className={`text-hearten-muted leading-relaxed whitespace-pre-line ${bodyClass}`}>{part.content}</div>;
        }
        if (part.type === 'youtube') {
          return (
            <div key={i} className="my-4 rounded-xl overflow-hidden border border-hearten-border">
              <iframe src={`https://www.youtube.com/embed/${part.content}`}
                className="w-full aspect-video" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          );
        }
        if (part.type === 'vimeo') {
          return (
            <div key={i} className="my-4 rounded-xl overflow-hidden border border-hearten-border">
              <iframe src={`https://player.vimeo.com/video/${part.content}`}
                className="w-full aspect-video" allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
