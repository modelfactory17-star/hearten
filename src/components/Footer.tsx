export default function Footer() {
  return (
    <footer className="border-t border-hearten-border bg-hearten-bg">
      <div className="max-w-[1500px] mx-auto px-7 py-10 max-md:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* A 欄 — 關於 Hearten */}
          <div>
            <h4 className="text-base font-bold text-hearten-text mb-3">關於 Hearten</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <a href="/about" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">Hearten 愛情討論區</a>
              <a href="/privacy" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">私隱政策</a>
              <a href="/terms" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">使用條款及免責聲明</a>
              <a href="/removal" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">移除政策</a>
            </div>
          </div>

          {/* B 欄 — 會員專區 */}
          <div>
            <h4 className="text-base font-bold text-hearten-text mb-3">會員專區</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <a href="/contact" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">聯絡我們</a>
              <a href="/features" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">會員功能</a>
              <a href="/faq" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">常見問題</a>
              <a href="/register" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">註冊成為會員</a>
            </div>
          </div>

          {/* C 欄 — 商務合作 */}
          <div>
            <h4 className="text-base font-bold text-hearten-text mb-3">商務合作</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <a href="/contact" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">聯絡我們</a>
              <a href="/support" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">客服查詢</a>
              <a href="/advertise" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">廣告查詢</a>
              <a href="/partners" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">合作方案</a>
            </div>
          </div>

          {/* D 欄 — 探索 Hearten */}
          <div>
            <h4 className="text-base font-bold text-hearten-text mb-3">探索 Hearten</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <a href="/editors-picks" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">編輯精選</a>
              <a href="/recent-comments" className="py-2 text-sm text-hearten-muted hover:text-hearten-rose-light transition-colors whitespace-nowrap">最新留言</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-hearten-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg text-hearten-rose-light">♥</span>
            <span className="text-sm font-medium text-hearten-text">Hearten</span>
            <span className="text-xs text-hearten-dim">· Heart + Listen</span>
          </div>
          <p className="text-xs text-hearten-dim">
            © 2024-2026 Hearten · 香港最暖嘅愛情討論區
          </p>
        </div>
      </div>
    </footer>
  );
}
