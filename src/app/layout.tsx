import type { Metadata } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "حكاية | منصة القصص العربية",
    template: "%s | حكاية",
  },
  description:
    "حكاية - منصة لنشر ومشاركة القصص العربية. اكتشف قصص الرومانسية، الرعب، الغموض، الانتقام والخيانة، أو شارك قصتك الخاصة.",
  keywords: ["قصص عربية", "حكاية", "روايات", "قصص رعب", "قصص رومانسية"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={notoNaskh.variable}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
