import type { Metadata } from "next";
import "./globals.css";

// Temp: Google Fonts blocked on build, using system fallback
// import { Noto_Sans_HK } from "next/font/google";

export const metadata: Metadata = {
  title: "Hearten — 香港最暖嘅愛情討論區",
  description: "分享心事，愛情討論區，社群一齊陪住你",
  keywords: ["心事", "感情", "討論區", "香港", "傾訴", "AI顧問", "匿名", "樹窿"],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Hearten — 用心聽你嘅心事",
    description: "分享心事，愛情討論區，社群一齊陪住你",
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
      <body className="min-h-screen bg-hearten-bg text-foreground">
        {children}
      </body>
    </html>
  );
}
