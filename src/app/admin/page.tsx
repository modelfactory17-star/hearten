import { Suspense } from 'react';
import AdminContent from './AdminContent';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64 bg-[#0a0a0f]">
        <div className="animate-pulse text-gray-500 text-sm">載入中...</div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
