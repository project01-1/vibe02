import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: { default: "Python Future Lab", template: "%s | Python Future Lab" },
    description: "블록코딩 경험을 Python 텍스트 코딩으로 자연스럽게 연결하는 미션형 학습 플랫폼",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Python Future Lab",
      description: "블록으로 이해하고, Python으로 완성해요.",
      type: "website",
      locale: "ko_KR",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Python Future Lab — 블록에서 Python으로" }],
    },
    twitter: { card: "summary_large_image", title: "Python Future Lab", description: "블록으로 이해하고, Python으로 완성해요.", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
