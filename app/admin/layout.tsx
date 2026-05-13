export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#030D1E' }}>
        {children}
      </body>
    </html>
  )
}
