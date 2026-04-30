import "./globals.css";

export const metadata = {
  title: "Collaborative Team Hub",
  description: "FredoCloud assignment"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
