'use client';

interface AdBannerProps {
  size?: 'rectangle' | 'leaderboard';
}

export default function AdBanner({ size = 'rectangle' }: AdBannerProps) {
  const height = size === 'leaderboard' ? '90px' : '250px';
  const label = size === 'leaderboard' ? '728 × 90' : '300 × 250';

  return (
    <div className="relative border border-dashed border-hearten-border rounded-[10px] overflow-hidden transition-colors duration-[0.3s] hover:border-hearten-dim mb-4">
      <span className="absolute top-[6px] left-2 z-[1] text-[9px] font-semibold uppercase text-hearten-dim tracking-[0.05em]">
        廣告
      </span>
      <div
        className="flex flex-col items-center justify-center bg-hearten-card text-hearten-dim text-[11px] gap-1"
        style={{ width: '100%', height }}
      >
        <span>Google AdSense</span>
        <span>{label}</span>
      </div>
    </div>
  );
}
