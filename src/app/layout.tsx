import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveySphere — Your Opinions. Your Rewards.",
  description:
    "SurveySphere is a premium survey platform. Earn rewards by sharing your opinions through trusted, verified surveys from around the world.",
  openGraph: {
    title: "SurveySphere — Your Opinions. Your Rewards.",
    description:
      "SurveySphere is a premium survey platform. Earn rewards by sharing your opinions through trusted, verified surveys from around the world.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurveySphere — Your Opinions. Your Rewards.",
    description:
      "SurveySphere is a premium survey platform. Earn rewards by sharing your opinions through trusted, verified surveys from around the world.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
