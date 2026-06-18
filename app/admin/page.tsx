'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Mail, MessageCircle } from 'lucide-react'

export default function AdminLogin() {
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [modo,        setModo]        = useState<'login' | 'recuperar'>('login')
  const [recuperando, setRecuperando] = useState(false)
  const [recuperado,  setRecuperado]  = useState(false)
  const [waUrl,       setWaUrl]       = useState('')
  const [recError,    setRecError]    = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res  = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()

    if (res.ok) {
      window.location.href = '/admin/dashboard'
    } else {
      setError(data.error || 'Contraseña incorrecta')
      setLoading(false)
    }
  }

  async function handleRecuperar() {
    setRecuperando(true)
    setRecError('')
    try {
      const res  = await fetch('/api/admin/recuperar-clave', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setWaUrl(data.wa)
        setRecuperado(true)
      } else {
        setRecError(data.error || 'Error al enviar')
      }
    } catch {
      setRecError('Error de conexión')
    }
    setRecuperando(false)
  }

  const CARD: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={CARD}>

        {/* Ícono + título */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={28} color="#FFFFFF" />
          </div>
          <h1 style={{ color: '#111827', fontSize: 22, fontWeight: 900, margin: 0 }}>
            {modo === 'login' ? 'Panel de Administración' : 'Recuperar contraseña'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 6 }}>Mayorista Universal</p>
        </div>

        {/* ── LOGIN ── */}
        {modo === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>CONTRASEÑA</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresá tu contraseña"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="current-password"
                  style={{ width: '100%', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '12px 44px 12px 14px', color: '#111827', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a', padding: 0 }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', border: 'none', borderRadius: 10, padding: '13px', color: '#FFFFFF', fontSize: 15, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Ingresando...' : 'INGRESAR'}
            </button>

            {/* Link olvidé contraseña */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button type="button" onClick={() => setModo('recuperar')}
                style={{ background: 'none', border: 'none', color: '#7a8a9a', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                Olvidé mi contraseña
              </button>
            </div>
          </form>
        )}

        {/* ── RECUPERAR ── */}
        {modo === 'recuperar' && !recuperado && (
          <div>
            <p style={{ color: '#9aabb8', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
              Te enviamos la contraseña a tu email y por WhatsApp.
            </p>

            {recError && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
                {recError}
              </div>
            )}

            <button onClick={handleRecuperar} disabled={recuperando}
              style={{ width: '100%', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 15, fontWeight: 900, cursor: recuperando ? 'not-allowed' : 'pointer', opacity: recuperando ? 0.7 : 1, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Mail size={18} />
              {recuperando ? 'Enviando...' : 'Enviar por email'}
            </button>

            <button type="button" onClick={() => setModo('login')}
              style={{ width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '11px', color: '#9aabb8', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              ← Volver al login
            </button>
          </div>
        )}

        {/* ── RECUPERADO ── */}
        {modo === 'recuperar' && recuperado && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: '#4ADE80', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>¡Contraseña enviada!</p>
            <p style={{ color: '#9aabb8', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              Revisá tu email <strong style={{ color: '#ccc' }}>rubenmenalled@gmail.com</strong>
            </p>

            {/* Botón WhatsApp como alternativa */}
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', border: 'none', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14, fontWeight: 900, textDecoration: 'none', marginBottom: 12 }}>
              <MessageCircle size={18} />
              Recibir por WhatsApp también
            </a>

            <button type="button" onClick={() => { setModo('login'); setRecuperado(false) }}
              style={{ width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '11px', color: '#9aabb8', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              ← Volver al login
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
