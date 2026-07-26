import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // 与 --background (#f0f4f8) 保持一致，否则 PWA 状态栏 / 启动画面是黑的，正文却是浅色
  themeColor: "#f0f4f8",
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easy-search.vercel.app"
const title = "EasySearch - 聚合搜索工具"
const description =
  "在一个界面快速选择多个搜索引擎进行搜索，支持百度、Google、小红书、抖音、YouTube等20+平台"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "EasySearch",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "EasySearch",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EasySearch",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
