export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FFFFFF', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
