import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearten — 香港最暖嘅感情樹窿",
  description: "匿名分享心事，AI 顧問 + 真人社群一齊陪你。Hearten = Heart + Listen，用心聽你嘅心事。",
  keywords: ["心事", "感情", "討論區", "香港", "傾訴", "AI顧問", "匿名", "樹窿"],
  openGraph: {
    title: "Hearten — 用心聽你嘅心事",
    description: "匿名分享心事，AI 顧問 + 真人社群一齊陪你。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-HK" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('hearten-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-hearten-bg text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
