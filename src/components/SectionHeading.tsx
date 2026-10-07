import type { LucideIcon } from 'lucide-react';
import IconBadge from './IconBadge';

/**
 * 區塊標題 — 線條 icon 方塊 + H2（+ 可選副題／分隔線）。
 * divider：標題後面拉一條淡線，副題貼右邊（首頁區塊用）。
 */
export default function SectionHeading({ icon, title, subtitle, divider = false, className = '' }: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  divider?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <IconBadge icon={icon} size="md" />
      <h2 className="text-xl font-bold text-hearten-text shrink-0">{title}</h2>
      {divider && <div className="flex-1 h-px bg-hearten-border" />}
      {subtitle && <span className="text-sm text-hearten-dim font-normal shrink-0">{subtitle}</span>}
    </div>
  );
}
