import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DatePlan — Plan a date. Without the back and forth.",
  description: "The no-signup, link-based date planning app. Collect both your preferences and get AI-matched date ideas in seconds.",
  openGraph: {
    title: "DatePlan",
    description: "Plan a date. Without the back and forth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
