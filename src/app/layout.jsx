import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "EMSI",
  description: "Système de Détection des Risques Académiques",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
