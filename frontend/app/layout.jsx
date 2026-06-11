import './globals.css'

export const metadata = {
  title: 'Fashion Hub - CRM Platformasi',
  description: 'Fashion Hub uchun korporativ darajadagi CRM platformasi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="text-slate-900" suppressHydrationWarning>{children}</body>
    </html>
  )
}
