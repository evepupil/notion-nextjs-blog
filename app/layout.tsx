import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.chaosyn.com"),
  title: {
    default: "潮思 Chaosyn",
    template: "%s - 潮思 Chaosyn",
  },
  description: "技术探索、AI 应用、Serverless 与个人知识平台。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
