export const metadata = {
  title: 'Voiceless',
  description: 'This is anonymous feedback app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
