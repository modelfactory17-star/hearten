import Link from 'next/link';

type LoveWiseVariant = 'feed' | 'post' | 'sidebar';

const COPY: Record<LoveWiseVariant, { line: string; sub: string }> = {
  feed: {
    line: '感情事想搵人傾？',
    sub: 'LoveWise 有 16 位顧問同樹窿，24 小時陪你傾 · 免費開始',
  },
  post: {
    line: '睇完仲有嘢想講？',
    sub: 'LoveWise 愛情顧問平台 — 打字或語音，廣東話陪你傾',
  },
  sidebar: {
    line: '感情煩惱想有人聽？',
    sub: 'LoveWise 顧問 · 24 小時 · 免費開始',
  },
};

/**
 * 自家品牌推薦卡（LoveWise）。
 * 刻意做成「原生卡片」而唔係廣告框：低調、同站內卡片同一套 token，預設無搶眼標籤。
 */
export default function LoveWiseCard({ variant = 'feed' }: { variant?: LoveWiseVariant }) {
  const c = COPY[variant];
  const compact = variant === 'sidebar';

  return (
    <Link
      href="https://lovewise.com.hk"
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 rounded-xl border border-hearten-border bg-hearten-card/60 hover:bg-hearten-card hover:border-hearten-border-hover transition-colors duration-[0.15s] ${
        compact ? 'p-3' : 'px-4 py-3.5'
      }`}
    >
      <span
        className={`shrink-0 flex items-center justify-center rounded-full border border-hearten-border bg-hearten-bg ${
          compact ? 'w-8 h-8' : 'w-9 h-9'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`${compact ? 'w-4 h-4' : 'w-[18px] h-[18px]'} text-hearten-rose opacity-70`}
        >
          <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      </span>

      <span className="flex-1 min-w-0">
        <span className={`block font-semibold text-hearten-muted truncate ${compact ? 'text-[13px]' : 'text-sm'}`}>
          {c.line}
        </span>
        <span className="block text-xs text-hearten-dim truncate">{c.sub}</span>
      </span>

      <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold tracking-[0.04em] text-hearten-dim/80 group-hover:text-hearten-muted transition-colors">
        LoveWise
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
          <path d="M7 17L17 7M17 7H9M17 7v8" />
        </svg>
      </span>
    </Link>
  );
}
