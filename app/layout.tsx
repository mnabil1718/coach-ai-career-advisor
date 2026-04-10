import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/toaster";
import NextTopLoader from "nextjs-toploader";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Coach.ai - Your Personal AI Career Coach",
    description: "Review your CV, simulate interviews, and identify skill gaps for free.",
};

const geistSans = Ubuntu_Sans({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.className} antialiased min-h-screen flex flex-col`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextTopLoader showSpinner={false} />
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
