'use client';

import { useParams, useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, ArrowLeft, Flag, Eye, EyeOff } from 'lucide-react';
import { posts, comments as allComments } from '@/lib/data';
import { useState } from 'react';

const MOODS = [
  { emoji: '😊', label: '支持' },
  { emoji: '😢', label: '傷心' },
  { emoji: '😡', label: '嬲' },
  { emoji: '🐷', label: '豬豬' },
];

type FontSize = 'small' | 'medium' | 'large';
const FONT_SIZES: { key: FontSize; label: string; className: string }[] = [
  { key: 'small', label: '小', className: 'text-[13px]' },
  { key: 'medium', label: '中', className: 'text-[15px]' },
  { key: 'large', label: '大', className: 'text-[17px]' },
];

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const post = posts.find((p) => p.id === params.id);

  const [hearts, setHearts] = useState(post?.hearts ?? 0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [mood, setMood] = useState<string | null>(null);

  // Post controls
  const [authorOnly, setAuthorOnly] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  if (!post) {
    return (
      <div className="min-h-screen bg-hearten-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-hearten-muted text-lg">搵唔到呢篇心事 😢</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-hearten-rose text-white text-sm"
          >
            返去首頁
          </button>
        </div>
      </div>
    );
  }

  const postComments = allComments.filter((c) => c.postId === post.id);
  const displayedComments = authorOnly
    ? postComments.filter((c) => c.isOP)
    : postComments;

  const bodyClass = FONT_SIZES.find((f) => f.key === fontSize)?.className ?? 'text-[15px]';

  return (
    <div className="min-h-screen bg-hearten-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-bg/90 backdrop-blur flex items-center px-4 gap-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-hearten-muted hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返去
        </button>
        <div className="flex-1" />
        <span className="text-xs text-hearten-muted">💬 心事詳情</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post */}
        <article className="bg-hearten-card border border-hearten-border rounded-xl p-6 mb-6">
          {/* Meta + Post Controls */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-hearten-rose/20 flex items-center justify-center text-2xl shrink-0">
                {post.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{post.anonymous}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-[10px] font-medium">
                    {post.category}
                  </span>
                </div>
                <span className="text-xs text-hearten-muted">{post.time}</span>
              </div>
            </div>

            {/* Post controls: 只看該作者 + 字型 */}
            <div className="flex items-center gap-2">
              {/* Font size */}
              <div className="flex items-center rounded-lg border border-hearten-border overflow-hidden">
                {FONT_SIZES.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFontSize(f.key)}
                    className={`px-2 py-1 text-xs transition-colors ${
                      fontSize === f.key
                        ? 'bg-hearten-rose text-white'
                        : 'text-hearten-muted hover:text-white hover:bg-hearten-card'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* 只看該作者 */}
              <button
                onClick={() => setAuthorOnly(!authorOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  authorOnly
                    ? 'bg-hearten-amber/20 text-hearten-amber'
                    : 'text-hearten-muted hover:text-white hover:bg-hearten-card'
                }`}
              >
                {authorOnly ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                只看該作者
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white mb-4">{post.title}</h1>

          {/* Body */}
          <div className={`text-gray-300 leading-relaxed whitespace-pre-line mb-6 ${bodyClass}`}>
            {post.body}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-hearten-border">
            <button
              onClick={() => {
                setLiked(!liked);
                setHearts((h) => (liked ? h - 1 : h + 1));
              }}
              className={`flex items-center gap-1.5 transition-colors text-sm ${
                liked ? 'text-hearten-rose' : 'text-hearten-muted hover:text-hearten-rose'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{hearts}</span>
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-blue-400 transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{postComments.length} 則留言</span>
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-green-400 transition-colors text-sm ml-auto">
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        </article>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-bold text-hearten-muted uppercase tracking-wider">
            💬 留言 ({displayedComments.length}{authorOnly ? ' · 只看該作者' : ''})
          </h2>
          <div className="flex-1 h-px bg-hearten-border" />
        </div>

        {/* Reply box */}
        <div className="bg-hearten-card border border-hearten-border rounded-xl p-4 mb-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="分享你嘅諗法..."
            rows={3}
            className="w-full bg-hearten-bg border border-hearten-border rounded-lg p-3 text-sm text-white placeholder-hearten-muted outline-none resize-none focus:border-hearten-rose transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            {/* Mood buttons */}
            <div className="flex items-center gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m.emoji}
                  onClick={() => setMood(mood === m.label ? null : m.label)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                    mood === m.label
                      ? 'bg-hearten-rose/20 text-hearten-rose border border-hearten-rose/40'
                      : 'border border-hearten-border text-hearten-muted hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="text-sm leading-none">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
            <button
              disabled={!replyText.trim()}
              className="px-4 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              留言
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-0">
          {displayedComments.length === 0 ? (
            <p className="text-center text-hearten-muted text-sm py-8">
              {authorOnly ? '該作者未有留言' : '仲未有留言。做第一個留言嘅人？ 💭'}
            </p>
          ) : (
            displayedComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, depth = 0 }: { comment: import('@/lib/data').Comment; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const [cHearts, setCHearts] = useState(comment.hearts);
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  return (
    <div className={depth > 0 ? 'ml-10 border-l-2 border-hearten-border pl-4' : ''}>
      <div className={`bg-hearten-card border border-hearten-border rounded-xl p-4 ${depth > 0 ? '' : 'mb-0'} mb-3`}>
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-hearten-rose/20 flex items-center justify-center text-sm shrink-0">
            {comment.emoji}
          </div>
          <span className="text-sm font-medium text-white">{comment.anonymous}</span>
          {comment.isOP && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-hearten-amber/20 text-hearten-amber">
              樓主
            </span>
          )}
          <span className="text-xs text-hearten-muted">{comment.time}</span>
          <button className="ml-auto text-hearten-muted hover:text-white">
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-300 leading-relaxed mb-3">{comment.body}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setLiked(!liked);
              setCHearts((h) => (liked ? h - 1 : h + 1));
            }}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? 'text-hearten-rose' : 'text-hearten-muted hover:text-hearten-rose'
            }`}
          >
            <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} />
            {cHearts > 0 && <span>{cHearts}</span>}
          </button>
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-hearten-muted hover:text-blue-400 transition-colors"
          >
            回覆
          </button>
        </div>

        {/* Inline reply */}
        {showReply && (
          <div className="mt-3 flex gap-2">
            <input
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="寫回覆..."
              className="flex-1 bg-hearten-bg border border-hearten-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
            />
            <button
              disabled={!replyInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white text-xs font-medium transition-colors"
            >
              回覆
            </button>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}
