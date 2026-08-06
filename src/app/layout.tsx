import type { Metadata } from "next";
import { Noto_Sans_HK } from "next/font/google";
import "./globals.css";

const notoSansHK = Noto_Sans_HK({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Hearten — 香港最暖嘅愛情討論區",
  description: "匿名分享心事，AI 顧問 + 真人社群一齊陪你。Hearten = Heart + Listen，用心聽你嘅心事。",
  keywords: ["心事", "感情", "討論區", "香港", "傾訴", "AI顧問", "匿名", "樹窿"],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
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
    <html lang="zh-HK" suppressHydrationWarning className={`${notoSansHK.variable}`}>
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
