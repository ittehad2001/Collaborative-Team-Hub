import "./globals.css";
import AppChromeClient from "../components/AppChromeClient";

export const metadata = {
  title: "Collaborative Team Hub",
  description: "FredoCloud assignment",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppChromeClient>{children}</AppChromeClient>
      </body>
    </html>
  );
}
