import './globals.css'

export const metadata = {
  title: 'Fashion Hub — CRM Platform',
  description: 'Enterprise-grade Customer Relationship Management platform for Fashion Hub',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-black text-white noise">{children}</body>
    </html>
  )
}
