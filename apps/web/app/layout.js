import "./globals.css";
import { Manrope, Sora } from "next/font/google";
import AppChromeClient from "../components/AppChromeClient";

const displayFont = Sora({ subsets: ["latin"], variable: "--font-display" });
const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Sable & Stone",
  description: "A refined workspace for collaborative teams.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
        <AppChromeClient>{children}</AppChromeClient>
      </body>
    </html>
  );
}
