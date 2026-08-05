'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface FeedCardProps {
  emoji: string;
  title: string;
  preview: string;
  category: string;
  hearts: number;
  replies: number;
  time: string;
  anonymous: string;
}

export default function FeedCard({
  emoji,
  title,
  preview,
  category,
  hearts,
  replies,
  time,
  anonymous,
}: FeedCardProps) {
  return (
    <article className="bg-hearten-card border border-hearten-border rounded-xl p-5 hover:border-gray-600 transition-colors cursor-pointer group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-hearten-rose/20 flex items-center justify-center text-lg shrink-0">
          {emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-hearten-muted mb-1.5">
            <span>{anonymous}</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 rounded-md bg-hearten-rose/10 text-hearten-rose text-[10px] font-medium">
              {category}
            </span>
            <span>·</span>
            <span>{time}</span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-white mb-1.5 group-hover:text-hearten-rose transition-colors">
            {title}
          </h3>

          {/* Preview */}
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {preview}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-hearten-border">
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-hearten-rose transition-colors text-sm">
              <Heart className="w-4 h-4" />
              <span>{hearts}</span>
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-blue-400 transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{replies}</span>
            </button>
            <button className="flex items-center gap-1.5 text-hearten-muted hover:text-green-400 transition-colors text-sm ml-auto">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
