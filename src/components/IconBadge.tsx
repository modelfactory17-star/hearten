import type { LucideIcon } from 'lucide-react';

type Size = 'sm' | 'md' | 'lg';

const BOX: Record<Size, string> = {
  sm: 'w-6 h-6 rounded-md',
  md: 'w-7 h-7 rounded-lg',
  lg: 'w-12 h-12 rounded-xl',
};

const ICON: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

/**
 * 淡色圓角方塊承住線條 icon — 全站介面圖示統一用呢個，
 * 取代以前散落嘅 emoji 前綴／圖示位。
 */
export default function IconBadge({ icon: Icon, size = 'md', className = '' }: {
  icon: LucideIcon;
  size?: Size;
  className?: string;
}) {
  return (
    <span className={`${BOX[size]} inline-flex items-center justify-center bg-hearten-rose/10 text-hearten-rose-light shrink-0 ${className}`}>
      <Icon className={ICON[size]} />
    </span>
  );
}
