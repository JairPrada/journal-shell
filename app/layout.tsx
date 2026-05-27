import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Journal Shell",
  description: "Microfrontend shell for journal app",
};

export const importMap = {
  imports: {
    "mf-login": process.env.NEXT_PUBLIC_MF_LOGIN_URL ?? "http://localhost:3001/remoteEntry.js",
    "mf-auth": process.env.NEXT_PUBLIC_MF_AUTH_URL ?? "http://localhost:3002/remoteEntry.js",
    "mf-personal-data": process.env.NEXT_PUBLIC_MF_PERSONAL_DATA_URL ?? "http://localhost:3003/remoteEntry.js",
    "mf-document-upload": process.env.NEXT_PUBLIC_MF_DOCUMENTS_URL ?? "http://localhost:3004/remoteEntry.js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(importMap) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
