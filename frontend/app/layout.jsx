import { Toaster } from "@/components/toaster"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
