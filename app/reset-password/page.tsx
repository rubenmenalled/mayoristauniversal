'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase maneja el token de la URL automáticamente al detectar el hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('No se pudo actualizar la contraseña. El link puede haber expirado.')
    } else {
      setSuccess('✅ ¡Contraseña actualizada! Redirigiendo...')
      setTimeout(() => router.push('/mi-cuenta'), 2000)
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
    background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(10,31,92,0.2)',
    color: '#1565C0', fontSize: 15, boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    color: '#1565C0', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={28} color="#FFFFFF" />
            </div>
            <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, letterSpacing: '0.08em' }}>MAYORISTA UNIVERSAL</div>
          </a>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(10,31,92,0.15)',
          borderRadius: 20, padding: '32px 28px',
        }}>
          <h2 style={{ color: '#1565C0', fontWeight: 900, fontSize: 20, marginBottom: 6 }}>Nueva contraseña</h2>
          <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 24 }}>Ingresá tu nueva contraseña para continuar.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <label style={labelStyle}>NUEVA CONTRASEÑA *</label>
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" required minLength={6}
                style={{ ...inputStyle, paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>REPETIR CONTRASEÑA *</label>
              <input type={showPass ? 'text' : 'password'} value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repetí la contraseña" required
                style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#16a34a', fontSize: 13 }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#1565C0',
                fontWeight: 900, fontSize: 15, opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#4b5563', fontSize: 13 }}>
          <a href="/login" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver al login</a>
        </p>
      </div>
    </div>
  )
}
