'use client';

import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { db, type AuthUser } from '@/lib/db';
import { useState, useEffect } from 'react';

interface FeedCardProps {
  id: string;
  emoji: string;
  avatar_url: string | null;
  title: string;
  preview: string;
  category: string;
  hearts: number;
  replies: number;
  time: string;
  anonymous: string;
  images?: string[];
  onClick?: () => void;
}

export default function FeedCard({
  id,
  emoji,
  avatar_url,
  title,
  preview,
  category,
  hearts,
  replies,
  time,
  anonymous,
  images,
  onClick,
}: FeedCardProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(hearts);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    db.auth.getUser().then((u) => {
      setUser(u);
      if (u) {
        db.bookmarks.isBookmarked(u.id, id).then(setBookmarked);
        db.likes.isLiked(u.id, 'post', id).then(setHearted);
      }
    });
    db.likes.count('post', id).then(setHeartCount);
  }, [id]);

  const handleHeart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new Event('hearten:open-login'));
      return;
    }
    const now = await db.likes.toggle(user.id, 'post', id);
    setHearted(now);
    setHeartCount(c => now ? c + 1 : c - 1);
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new Event('hearten:open-login'));
      return;
    }
    const now = await db.bookmarks.toggle(user.id, id);
    setBookmarked(now);
  };

  return (
    <article
      onClick={onClick}
      className={`bg-hearten-card border border-hearten-border rounded-xl p-5 hover:border-gray-600 transition-colors ${onClick ? 'cursor-pointer' : ''} group`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          onClick={(e) => { e.stopPropagation(); router.push(`/user/${encodeURIComponent(anonymous)}`); }}
          className="w-10 h-10 rounded-full bg-hearten-rose/20 flex items-center justify-center text-lg shrink-0 hover:ring-2 hover:ring-hearten-rose/50 cursor-pointer transition-all overflow-hidden"
        >
          {avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            emoji
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-hearten-muted mb-1.5">
            <span
              onClick={(e) => { e.stopPropagation(); router.push(`/user/${encodeURIComponent(anonymous)}`); }}
              className="hover:text-hearten-rose cursor-pointer transition-colors"
            >{anonymous}</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-[10px] font-medium">
              {category}
            </span>
            <span>·</span>
            <span>{time}</span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-hearten-text mb-1.5 group-hover:text-hearten-rose transition-colors">
            {title}
          </h3>

          {/* Preview */}
          <p className="text-sm text-hearten-muted line-clamp-2 leading-relaxed">
            {preview}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-hearten-border">
            <button onClick={handleHeart}
              className={`flex items-center gap-1.5 transition-colors text-sm ${hearted ? 'text-hearten-rose' : 'text-hearten-muted hover:text-hearten-rose'}`}>
              <Heart className={`w-4 h-4 ${hearted ? 'fill-current' : ''}`} />
              <span>{heartCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-blue-400 transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{replies}</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 transition-colors text-sm ${bookmarked ? 'text-hearten-amber' : 'text-hearten-muted hover:text-hearten-amber'}`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-green-400 transition-colors text-sm ml-auto">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {images && images.length > 0 && (
          <img src={images[0]} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0" />
        )}
      </div>
    </article>
  );
}
